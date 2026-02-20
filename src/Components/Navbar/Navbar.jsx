import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import logo from '../Assets/logo.png';
import cart_icon from '../Assets/cart_icon.png';
import { ShopContext } from '../../Context/ShopContext';
import NotificationBell from '../NotificationBell/NotificationBell';
import ThemeToggle from '../ThemeToggle/ThemeToggle';

const Navbar = () => {
  const [menu, setMenu] = useState("shop");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { getTotalCartItems } = useContext(ShopContext);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const updateUser = () => {
      const userData = localStorage.getItem('user');
      const isLoggedIn = localStorage.getItem('isLoggedIn');

      if (isLoggedIn === 'true' && userData) {
        setUser(JSON.parse(userData));
      } else {
        setUser(null);
      }
    };

    // Initial check
    updateUser();

    // Listen for storage changes (login/logout from other tabs)
    window.addEventListener('storage', updateUser);

    // Listen for custom login event
    window.addEventListener('userLoggedIn', updateUser);

    return () => {
      window.removeEventListener('storage', updateUser);
      window.removeEventListener('userLoggedIn', updateUser);
    };
  }, []);

  useEffect(() => {
    // Prevent body scroll when mobile menu is open
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('auth-token');
    setUser(null);
    setMobileMenuOpen(false);
    window.dispatchEvent(new Event('userLoggedIn')); // Trigger update
    navigate('/');
  };

  const handleMenuClick = (menuItem) => {
    setMenu(menuItem);
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <nav className='navbar'>
        {/* Mobile Hamburger Button */}
        <button
          className={`hamburger ${mobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Logo */}
        <Link to='/' className='nav-logo'>
          <img src={logo} alt="Modo logo" />
          <p>MODO</p>
        </Link>

        {/* Desktop Navigation */}
        <ul className="nav-menu desktop-menu">
          <li onClick={() => setMenu("shop")}>
            <Link to='/'>Shop</Link>
            {menu === "shop" && <hr />}
          </li>
          <li onClick={() => setMenu("mens")}>
            <Link to='/mens'>Men</Link>
            {menu === "mens" && <hr />}
          </li>
          <li onClick={() => setMenu("womens")}>
            <Link to='/womens'>Women</Link>
            {menu === "womens" && <hr />}
          </li>
          <li onClick={() => setMenu("kids")}>
            <Link to='/kids'>Kids</Link>
            {menu === "kids" && <hr />}
          </li>
        </ul>

        {/* Cart & Login */}
        <div className="nav-login-cart">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notifications (only for logged in users) */}
          {user && <NotificationBell />}

          {user ? (
            <div className="nav-user-info desktop-only">
              <span className="nav-username">
                Hi, {user.username}
                {user.role && <span className={`role-badge-small ${user.role}`}>{user.role}</span>}
              </span>
              {user.role === 'admin' && (
                <Link to='/admin'><button className="admin-btn">Admin</button></Link>
              )}
              {user.role === 'seller' && (
                <Link to='/seller'><button className="seller-btn">Seller</button></Link>
              )}
              <Link to='/orders'><button className="orders-btn">Orders</button></Link>
              <Link to='/profile'><button className="profile-btn">Profile</button></Link>
              <button onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <Link to='/login' className="desktop-only"><button>Login</button></Link>
          )}
          <Link to='/wishlist' className="wishlist-link">
            <svg className="wishlist-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </Link>
          <Link to='/cart' className="cart-link">
            <img src={cart_icon} alt="Shopping cart" />
            <div className="nav-cart-count">{getTotalCartItems()}</div>
          </Link>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="mobile-menu-overlay"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Drawer */}
      <div className={`mobile-menu-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <h2>Menu</h2>
          <button
            className="close-btn"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            ×
          </button>
        </div>

        <ul className="mobile-menu-list">
          <li onClick={() => handleMenuClick("shop")}>
            <Link to='/'>Shop</Link>
          </li>
          <li onClick={() => handleMenuClick("mens")}>
            <Link to='/mens'>Men</Link>
          </li>
          <li onClick={() => handleMenuClick("womens")}>
            <Link to='/womens'>Women</Link>
          </li>
          <li onClick={() => handleMenuClick("kids")}>
            <Link to='/kids'>Kids</Link>
          </li>
          <li onClick={() => handleMenuClick("wishlist")}>
            <Link to='/wishlist'>Wishlist</Link>
          </li>
          {user && (
            <>
              <li onClick={() => handleMenuClick("orders")}>
                <Link to='/orders'>My Orders</Link>
              </li>
              {user.role === 'admin' && (
                <li onClick={() => handleMenuClick("admin")}>
                  <Link to='/admin'>Admin Dashboard</Link>
                </li>
              )}
              {user.role === 'seller' && (
                <li onClick={() => handleMenuClick("seller")}>
                  <Link to='/seller'>Seller Dashboard</Link>
                </li>
              )}
            </>
          )}
        </ul>

        <div className="mobile-menu-footer">
          {user ? (
            <>
              <div className="mobile-user-info">
                <span>Hi, {user.username}</span>
                {user.role && <span className={`role-badge ${user.role}`}>{user.role}</span>}
              </div>
              <Link to='/profile' onClick={() => setMobileMenuOpen(false)}>
                <button className="mobile-btn profile-btn">Profile</button>
              </Link>
              <button className="mobile-btn logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <Link to='/login' onClick={() => setMobileMenuOpen(false)}>
              <button className="mobile-btn login-btn">Login</button>
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
