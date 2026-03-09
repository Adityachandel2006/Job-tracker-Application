import { useEffect } from 'react';
import './ProfilePage.css';

export default function ProfilePage() {
  useEffect(() => {
    const $ = (sel) => document.querySelector(sel);
    const LS_SESSION_KEY = 'jobHoundSession';
    const LS_USER_KEY = 'jobHoundUser';
    const LS_JOBS_PREFIX = 'jobtrack_pro_v1';
    const jobsKeyForEmail = (email) => `${LS_JOBS_PREFIX}_${email || 'default'}`;

    function checkSession() {
      const session = localStorage.getItem(LS_SESSION_KEY);
      if (!session) {
        alert('You must be logged in to view this page.');
        window.location.href = '/login';
      }
    }

    function loadProfile() {
      const sessionUser = JSON.parse(localStorage.getItem(LS_SESSION_KEY));
      const mainUser = JSON.parse(localStorage.getItem(LS_USER_KEY));

      if (sessionUser) {
        const nameInput = $('#profileName');
        const emailInput = $('#profileEmail');
        if (nameInput) {
          nameInput.value =
            (mainUser && (mainUser.fullName || mainUser.name)) ||
            sessionUser.name ||
            '';
        }
        if (emailInput) {
          emailInput.value = sessionUser.email || '';
        }
      }

      const jobsKey = jobsKeyForEmail(sessionUser && sessionUser.email);
      const jobs = JSON.parse(localStorage.getItem(jobsKey) || '[]');
      const total = jobs.length;
      const c = (s) => jobs.filter((j) => j.status === s).length;

      const statTotal = $('#statTotal');
      const statInterviews = $('#statInterviews');
      const statOffers = $('#statOffers');

      if (statTotal) statTotal.textContent = total;
      if (statInterviews) statInterviews.textContent = c('Interview');
      if (statOffers) statOffers.textContent = c('Offer');
    }

    function handleUpdateProfile(event) {
      event.preventDefault();
      const nameInput = $('#profileName');
      if (!nameInput) return;
      
      const newName = nameInput.value.trim();
      const sessionUser = JSON.parse(localStorage.getItem(LS_SESSION_KEY));
      const storedUser = JSON.parse(localStorage.getItem(LS_USER_KEY));

      if (sessionUser) {
        sessionUser.name = newName;
        sessionUser.fullName = newName;
        localStorage.setItem(LS_SESSION_KEY, JSON.stringify(sessionUser));
      }
      if (storedUser) {
        storedUser.name = newName;
        storedUser.fullName = newName;
        localStorage.setItem(LS_USER_KEY, JSON.stringify(storedUser));
      }

      alert('Profile updated successfully!');
    }

    function handleChangePassword(event) {
      event.preventDefault();
      alert('Password change is not implemented in this demo.');
    }

    function handleLogout() {
      if (
        confirm(
          'Are you sure you want to log out? This will also remove all of your tracked job data.'
        )
      ) {
        const sessionUser = JSON.parse(localStorage.getItem(LS_SESSION_KEY));
        const jobsKey = jobsKeyForEmail(sessionUser && sessionUser.email);
        localStorage.removeItem(LS_SESSION_KEY);
        localStorage.removeItem(jobsKey);
        alert('You have been logged out.');
        window.location.href = '/landing';
      }
    }

    function handleDeleteAccount() {
      if (
        confirm(
          'Are you sure you want to delete your account? This will remove your login details and cannot be undone.'
        ) &&
        confirm(
          'Please confirm one last time. This will delete your user record AND all your tracked jobs.'
        )
      ) {
        const sessionUser = JSON.parse(localStorage.getItem(LS_SESSION_KEY));
        const jobsKey = jobsKeyForEmail(sessionUser && sessionUser.email);
        localStorage.removeItem(LS_SESSION_KEY);
        localStorage.removeItem(LS_USER_KEY);
        localStorage.removeItem(jobsKey);
        alert('Your account has been deleted.');
        window.location.href = '/landing';
      }
    }

    checkSession();
    loadProfile();

    const profileForm = $('#profileForm');
    const passwordForm = $('#passwordForm');
    const logoutBtn = $('#logoutBtn');
    const deleteAccountBtn = $('#deleteAccountBtn');

    if (profileForm) profileForm.addEventListener('submit', handleUpdateProfile);
    if (passwordForm) passwordForm.addEventListener('submit', handleChangePassword);
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
    if (deleteAccountBtn) deleteAccountBtn.addEventListener('click', handleDeleteAccount);

    return () => {
      if (profileForm) profileForm.removeEventListener('submit', handleUpdateProfile);
      if (passwordForm) passwordForm.removeEventListener('submit', handleChangePassword);
      if (logoutBtn) logoutBtn.removeEventListener('click', handleLogout);
      if (deleteAccountBtn) deleteAccountBtn.removeEventListener('click', handleDeleteAccount);
    };
  }, []);

  return (
    <div className="profile-page">
      <nav className="nav">
        <div className="nav-inner">
          <a href="/" className="brand">
            <div className="logo-img">
              <img src="/track.png" alt="JobHound Logo" />
            </div>
            <span>JobHound</span>
          </a>
          <div className="actions">
            <a href="/" className="btn btn-ghost">← Back to Tracker</a>
          </div>
        </div>
      </nav>

      <section className="container">
        <h2 style={{ fontFamily: 'Poppins', fontSize: '2.5rem', marginBottom: '20px' }}>Your Profile</h2>
        <div className="grid-2">
          
          <div>
            <div className="panel">
              <h3>Account Details</h3>
              <form id="profileForm" className="grid-1" style={{ marginTop: '15px' }}>
                <label>Name
                  <input id="profileName" className="input" placeholder="Your Name" required />
                </label>
                <label>Email
                  <input id="profileEmail" className="input" type="email" disabled />
                </label>
                <div className="help">Email cannot be changed.</div>
                <button type="submit" id="updateProfileBtn" className="btn btn-primary" style={{ marginTop: '10px' }}>Update Profile</button>
              </form>
            </div>

            <div className="panel" style={{ marginTop: '14px' }}>
              <h3>Change Password</h3>
              <form id="passwordForm" className="grid-1" style={{ marginTop: '15px' }}>
                <label>Current Password
                  <input className="input" type="password" placeholder="••••••••" />
                </label>
                <label>New Password
                  <input className="input" type="password" placeholder="••••••••" />
                </label>
                <button type="submit" className="btn btn-ghost" style={{ marginTop: '10px' }}>Change Password</button>
              </form>
            </div>
          </div>

          <div>
            <div className="panel">
              <h3>Your Stats</h3>
              <div className="stats">
                <div className="stat"><div className="n" id="statTotal">0</div><div className="subtle">Total Apps</div></div>
                <div className="stat"><div className="n" id="statInterviews">0</div><div className="subtle">Interviews</div></div>
                <div className="stat"><div className="n" id="statOffers">0</div><div className="subtle">Offers</div></div>
              </div>
              <a href="/#dashboard" className="btn btn-ghost" style={{ width: '100%' }}>View Full Dashboard</a>
            </div>

            <div className="panel" style={{ marginTop: '14px', borderColor: 'rgba(239,68,68,.4)' }}>
              <h3 style={{ color: 'var(--bad)' }}>Danger Zone</h3>
              <div className="grid-1" style={{ marginTop: '15px' }}>
                <button id="logoutBtn" className="btn btn-ghost" style={{ color: 'var(--warn)', borderColor: 'var(--warn)' }}>Log Out</button>
                <button id="deleteAccountBtn" className="btn btn-ghost" style={{ color: 'var(--bad)', borderColor: 'var(--bad)' }}>Delete Account</button>
                <div className="help">Deleting your account will permanently erase your signup data (email/password). Your job application data will remain in this browser.</div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
