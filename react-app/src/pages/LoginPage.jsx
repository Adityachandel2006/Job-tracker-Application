import { useEffect } from 'react';
import './LoginPage.css';

export default function LoginPage() {
  useEffect(() => {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;

    const handler = (event) => {
      event.preventDefault();
      const storedUser = JSON.parse(localStorage.getItem('jobHoundUser'));
      const emailInput = document.getElementById('email').value;

      if (storedUser && storedUser.email === emailInput) {
        localStorage.setItem('jobHoundSession', JSON.stringify(storedUser));
        alert('Login successful! Redirecting to your tracker.');
        window.location.href = '/';
      } else {
        alert('User not found or email is incorrect. Please sign up or try again.');
      }
    };

    loginForm.addEventListener('submit', handler);
    return () => loginForm.removeEventListener('submit', handler);
  }, []);

  return (
    <div className="login-page">
      <div className="container">
        <div className="logo">
          <img src="/track.png" alt="JobHound Logo" />
          <h1>JobHound</h1>
        </div>
        <h2>Login to your account</h2>
        <form id="loginForm">
          <input type="email" id="email" placeholder="Email" required />
          <input type="password" id="password" placeholder="Password" required />
          <button type="submit" className="btn yellow-btn">Sign In</button>
        </form>
        <p><a href="#">Forgot Password?</a></p>
        <button className="btn google">Continue with Google</button>
        <button className="btn linkedin">Continue with LinkedIn</button>
        <p>Not a member yet? <a href="/signup">Create an account</a></p>
        <div className="footer">© 2025 JobHound. All rights reserved.</div>
      </div>
    </div>
  );
}
