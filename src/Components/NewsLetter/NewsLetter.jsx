import React, { useState } from 'react'
import './NewsLetter.css'

const NewsLetter = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (email && email.includes('@')) {
      setSubscribed(true);
      alert(`Thank you for subscribing with ${email}!`);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    } else {
      alert('Please enter a valid email address');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubscribe();
    }
  };

  return (
    <div className='newsletter'>
      <h1>Get Exclusive Offers On Your Email</h1>
      <p>Subscribe to our newsletter and stay updated</p>
      <div>
        <input
          type="email"
          placeholder='Your Email id'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={handleSubscribe} disabled={subscribed}>
          {subscribed ? 'Subscribed!' : 'Subscribe'}
        </button>
      </div>
    </div>
  )
}

export default NewsLetter
