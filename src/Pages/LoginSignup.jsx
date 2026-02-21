import React, { useState, useContext } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './CSS/LoginSignup.css'
import authAPI from '../api/authAPI'
import { ShopContext } from '../Context/ShopContext'
import { useToastContext } from '../Context/ToastContext'

const LoginSignup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useContext(ShopContext);
  const toast = useToastContext();
  const [state, setState] = useState("Login");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);


  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error for this field when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Validate username for signup
    if (state === "Sign Up") {
      if (!formData.username) {
        newErrors.username = 'Username is required';
      } else if (formData.username.length < 3) {
        newErrors.username = 'Username must be at least 3 characters';
      }

      // Check terms agreement
      if (!agreedToTerms) {
        newErrors.terms = 'You must agree to the terms and conditions';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const login = async () => {
    console.log('Login function called');
    if (!validateForm()) {
      console.log('Validation failed', errors);
      return;
    }

    try {
      setLoading(true);
      console.log('Sending login request...');
      const response = await authAPI.login({
        email: formData.email,
        password: formData.password
      });

      console.log('Login response:', response);

      if (response.data.success) {
        // Store auth token and user data in localStorage
        localStorage.setItem('auth-token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data));
        localStorage.setItem('isLoggedIn', 'true');

        // Dispatch custom event to update Navbar
        window.dispatchEvent(new Event('userLoggedIn'));

        toast.success(`Welcome back, ${response.data.data.username}!`);

        // Check if there's a pending cart item
        const pendingItem = localStorage.getItem('pendingCartItem');
        if (pendingItem) {
          try {
            // Try to parse as JSON (from ProductDisplay with size/quantity)
            const itemData = JSON.parse(pendingItem);
            if (itemData.productId) {
              // Add the item to cart
              for (let i = 0; i < (itemData.quantity || 1); i++) {
                await addToCart(itemData.productId);
              }
              toast.success('Product added to your cart!');
            }
          } catch (e) {
            // It's just a product ID (from Item component)
            await addToCart(parseInt(pendingItem));
            toast.success('Product added to your cart!');
          }
          // Clear the pending item
          localStorage.removeItem('pendingCartItem');
        }

        // Redirect based on user role
        const userRole = response.data.data.role;
        let redirectPath = '/';

        if (userRole === 'admin') {
          redirectPath = '/admin';
        } else if (userRole === 'seller') {
          redirectPath = '/seller';
        } else if (userRole === 'delivery') {
          redirectPath = '/delivery';
        } else {
          // For customers, redirect back to where they came from, or home
          redirectPath = location.state?.from || '/';
        }

        setTimeout(() => navigate(redirectPath), 1500);
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response?.data?.error) {
        setErrors({ general: error.response.data.error });
      } else {
        setErrors({ general: 'Login failed. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const signup = async () => {
    console.log('=== Signup function called ===');
    console.log('Form data:', formData);
    console.log('Agreed to terms:', agreedToTerms);

    const isValid = validateForm();
    console.log('Validation result:', isValid);
    console.log('Validation errors:', errors);

    if (!isValid) {
      console.log('❌ Validation failed - stopping signup');
      console.log('Current errors object:', errors);

      // Build detailed error message
      const errorMessages = [];
      if (errors.username) errorMessages.push('• Username: ' + errors.username);
      if (errors.email) errorMessages.push('• Email: ' + errors.email);
      if (errors.password) errorMessages.push('• Password: ' + errors.password);
      if (errors.terms) errorMessages.push('• Terms: ' + errors.terms);

      const errorText = errorMessages.length > 0
        ? 'Please fix these errors:\n\n' + errorMessages.join('\n')
        : 'Please fix the form errors before continuing';

      alert(errorText);
      return;
    }

    try {
      setLoading(true);
      console.log('✅ Validation passed - sending signup request...');
      const response = await authAPI.signup({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      console.log('Signup response:', response);

      if (response.data.success) {
        alert(`Account created successfully! Welcome, ${response.data.data.username}!`);

        // Auto-login after signup - store token and user data
        localStorage.setItem('auth-token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data));
        localStorage.setItem('isLoggedIn', 'true');

        // Dispatch custom event to update Navbar
        window.dispatchEvent(new Event('userLoggedIn'));

        console.log('✅ Signup successful - redirecting');

        // Redirect based on user role
        const userRole = response.data.data.role;
        let redirectPath = '/';

        if (userRole === 'admin') {
          redirectPath = '/admin';
        } else if (userRole === 'seller') {
          redirectPath = '/seller';
        } else if (userRole === 'delivery') {
          redirectPath = '/delivery';
        } else {
          // For customers, redirect back to where they came from, or home
          redirectPath = location.state?.from || '/';
        }

        navigate(redirectPath);
      }
    } catch (error) {
      console.error('❌ Signup error:', error);
      console.error('Error response:', error.response);
      if (error.response?.data?.error) {
        setErrors({ general: error.response.data.error });
        alert('Signup failed: ' + error.response.data.error);
      } else {
        setErrors({ general: 'Signup failed. Please try again.' });
        alert('Signup failed. Please check your internet connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('=== Continue button clicked ===');
    console.log('Current state:', state);
    console.log('Form data:', formData);
    console.log('Agreed to terms:', agreedToTerms);

    if (state === "Login") {
      login();
    } else {
      signup();
    }
  };

  return (
    <div className='loginsignup'>
      <div className="loginsignup-container">
        <h1>{state}</h1>

        {errors.general && (
          <div className="error-message general-error">
            {errors.general}
          </div>
        )}

        <div className="loginsignup-fields">
          {state === "Sign Up" && (
            <div className="input-group">
              <input
                name='username'
                value={formData.username}
                onChange={changeHandler}
                type="text"
                placeholder='Your Name'
                className={errors.username ? 'error' : ''}
              />
              {errors.username && (
                <span className="error-message">{errors.username}</span>
              )}
            </div>
          )}

          <div className="input-group">
            <input
              name='email'
              value={formData.email}
              onChange={changeHandler}
              type="email"
              placeholder='Email Address'
              className={errors.email ? 'error' : ''}
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          <div className="input-group">
            <input
              name='password'
              value={formData.password}
              onChange={changeHandler}
              type="password"
              placeholder='Password'
              className={errors.password ? 'error' : ''}
            />
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={handleContinue}
          disabled={loading}
          style={{
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? 'Please wait...' : 'Continue'}
        </button>

        {state === "Sign Up" ? (
          <p className="loginsignup-login">
            Already have an account?
            <span onClick={() => {
              setState("Login");
              setErrors({});
              setFormData({ username: "", email: "", password: "" });
              setAgreedToTerms(false);
            }}> Login here</span>
          </p>
        ) : (
          <>
            <p className="loginsignup-login">
              Create an account?
              <span onClick={() => {
                setState("Sign Up");
                setErrors({});
                setFormData({ username: "", email: "", password: "" });
              }}> Click here</span>
            </p>
            <p className="loginsignup-forgot">
              <span onClick={() => navigate('/forgot-password')} style={{ cursor: 'pointer' }}>
                Forgot your password?
              </span>
            </p>
          </>
        )}

        {state === "Sign Up" && (
          <div className="loginsignup-agree">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => {
                setAgreedToTerms(e.target.checked);
                if (errors.terms) {
                  setErrors({ ...errors, terms: '' });
                }
              }}
            />
            <p>By continuing, I agree to the terms of use & privacy policy.</p>
          </div>
        )}

        {errors.terms && (
          <span className="error-message terms-error">{errors.terms}</span>
        )}
      </div>
    </div>
  )
}

export default LoginSignup
