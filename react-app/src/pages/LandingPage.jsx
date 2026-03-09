import { useEffect } from 'react';
import './LandingPage.css';

export default function LandingPage() {
  useEffect(() => {
    
    const counters = document.querySelectorAll('.stat span');
    const speed = 200;
    const animateCounters = () => {
      counters.forEach((counter) => {
        const update = () => {
          const target = +counter.getAttribute('data-target');
          const count = +counter.innerText;
          const increment = Math.ceil(target / speed);
          if (count < target) {
            counter.innerText = count + increment;
            setTimeout(update, 20);
          } else {
            counter.innerText = target.toLocaleString();
          }
        };
        update();
      });
    };

    const statsSection = document.querySelector('.stats');
    const observer = new IntersectionObserver((entries, observerInstance) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounters();
          observerInstance.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    if (statsSection) observer.observe(statsSection);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="landing-page">
      <header>
        <div className="logo">
          <img src="/track.png" alt="Job Hound Logo" />
          Job Hound
        </div>
        <nav>
          <a href="#features">Features</a>
          <a href="#demo">Demo</a>
          <a href="#reviews">Reviews</a>
          <a href="#faq">FAQ</a>
          <a href="#signup">Sign Up</a>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-text">
          <h1>Sniff Out Your Dream Job with Job Hound ✨</h1>
          <p>Your loyal companion in the job hunt — track applications, stay organized, and get hired faster on a platform you'll love to use.</p>
          <button className="cta-btn" onClick={() => window.location.href='/signup'}>🚀 Start Your Journey</button>
        </div>
        <img src="/Screenshot 2025-09-08 113221.png" alt="Job Hound Dashboard" />
      </section>

      <section className="stats">
        <div className="stat"><i>👥</i><span data-target="50000">0</span> Users</div>
        <div className="stat"><i>📄</i><span data-target="100000">0</span> Applications Tracked</div>
        <div className="stat"><i>🏆</i><span data-target="90">0</span>% Success Rate</div>
      </section>

      <section id="features" className="features">
        <h2>Why Choose Job Hound?</h2>
        <div className="feature-grid">
          <div className="feature"><h3>📊 Smart Tracking</h3><p>Manage all your job applications in one place with AI-powered insights.</p></div>
          <div className="feature"><h3>🤖 AI Assistance</h3><p>Generate personalized resumes and cover letters tailored to each job.</p></div>
          <div className="feature"><h3>📅 Reminders</h3><p>Never miss deadlines with interview and follow-up notifications.</p></div>
          <div className="feature"><h3>☁️ Cloud Sync</h3><p>Access your data across all devices, anytime, anywhere.</p></div>
        </div>
      </section>

      <section id="demo" className="video-section">
        <h2>See Job Hound in Action</h2>
        <iframe src="https://www.youtube.com/embed/DbpS7e_b4k8?autoplay=1&mute=1&loop=1&playlist=DbpS7e_b4k8&controls=0&showinfo=0" allowFullScreen></iframe>
      </section>

      <section id="reviews" className="reviews">
        <h2>What Our Users Say</h2>
        <div className="review-grid">
          <div className="review"><img src="https://i.pravatar.cc/150?u=priya" alt="User Aditya S." /><h3>Aditya S.</h3><div className="stars">⭐⭐⭐⭐⭐</div><p>“Job Hound kept me on top of 50+ applications. I finally landed my dream job thanks to reminders & AI cover letters!”</p></div>
          <div className="review"><img src="https://i.pravatar.cc/150?u=aditya" alt="User Priya K." /><h3>Priya K.</h3><div className="stars">⭐⭐⭐⭐</div><p>“I love the clean dashboard and resume suggestions. My job hunt became stress-free and more productive.”</p></div>
          <div className="review"><img src="https://i.pravatar.cc/150?u=rahul" alt="User Rahul M." /><h3>Aditi </h3><div className="stars">⭐⭐⭐⭐⭐</div><p>“Within 3 weeks I had 5 interviews scheduled. Job Hound is a total game-changer!”</p></div>
          <div className="review"><img src="https://i.pravatar.cc/150?u=sneha" alt="User Sneha R." /><h3>Sneha R.</h3><div className="stars">⭐⭐⭐⭐⭐</div><p>“The cloud sync is fantastic — I manage everything seamlessly on laptop & phone.”</p></div>
        </div>
      </section>

      <section id="faq" className="faq">
        <h2>Frequently Asked Questions</h2>
        <details><summary>Is Job Hound free?</summary><p>Yes, we offer a robust free tier with premium features available for power users who need advanced capabilities.</p></details>
        <details><summary>Can I track unlimited jobs?</summary><p>Absolutely! Our platform is built to scale with your job search, allowing you to track as many applications as you need.</p></details>
        <details><summary>Is my data secure?</summary><p>Yes, we use industry-standard encryption to protect your data. Your privacy and security are our top priorities.</p></details>
      </section>

      <section className="newsletter">
        <h2>Stay Updated</h2>
        <p>Get career tips and feature updates straight to your inbox.</p>
        <br/>
        <form>
          <input type="email" placeholder="Enter your email" required />
          <button type="submit">Subscribe</button>
        </form>
      </section>

      <section id="signup" className="cta-section">
        <h2>Ready to Land Your Dream Job?</h2>
        <p>Join thousands of professionals accelerating their careers with Job Hound.</p>
        <br/>
        <button onClick={() => window.location.href='/signup'}>✨ Get Started Free</button>
      </section>

      <footer>
        © 2025 Job Hound. All rights reserved.
      </footer>
    </div>
  );
}
