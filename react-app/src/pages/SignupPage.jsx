import { useEffect } from 'react';
import './SignupPage.css';


const signupHtml = `
  <div class="signup-page">
    <div class="container">
      <div class="logo">
        <img src="/track.png" alt="JobHound Logo" />
        <h1>JobHound</h1>
      </div>
      <h2>Create your account</h2>
      <p>Join thousands of professionals and track your career effectively.</p>
      <button class="btn google">Continue with Google</button>
      <button class="btn linkedin">Continue with LinkedIn</button>
      <p>or sign up with your email</p>
      <form id="signupForm">
        <input type="text" id="fullname" placeholder="Full Name" required>
        <input type="email" id="email" placeholder="Email" required>
        <div class="password-wrapper">
          <input type="password" id="password" placeholder="Password" required>
          <span class="toggle-password" onclick="togglePassword()">👁</span>
        </div>
        <input type="date" id="dob" required style="color-scheme: dark;">
        <button type="submit" class="btn yellow-btn">Get Started</button>
      </form>
      <p>Already a member? <a href="/login">Sign In</a></p>
      <div class="footer">
        By signing up, you agree to our <a href="#">Terms of Use</a> and <a href="#">Privacy Policy</a>.
      </div>
      <div class="trust">✨ Trusted by 5,000+ job seekers ✨</div>
    </div>
  </div>
`;

export default function SignupPage() {
  useEffect(() => {
    function togglePassword() {
      const pwd = document.getElementById('password');
      if (pwd) {
        pwd.type = pwd.type === 'password' ? 'text' : 'password';
      }
    }

    // expose for inline onclick in the HTML
    window.togglePassword = togglePassword;

    const signupForm = document.getElementById('signupForm');
    if (!signupForm) return;

    const handler = (event) => {
      event.preventDefault();
      const fullName = document.getElementById('fullname').value;
      const email = document.getElementById('email').value;
      const dob = document.getElementById('dob').value;
      const user = { fullName, email, dob };
      localStorage.setItem('jobHoundUser', JSON.stringify(user));
      localStorage.setItem('jobHoundSession', JSON.stringify(user));
      window.location.href = '/';
    };

    signupForm.addEventListener('submit', handler);

    return () => {
      signupForm.removeEventListener('submit', handler);
    };
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: signupHtml }} />;
}
