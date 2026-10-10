import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import DashboardView from './components/DashboardView.jsx';
import TeamFinderView from './components/TeamFinderView.jsx';
import ProfilesView from './components/ProfilesView.jsx';
import ResourcesView from './components/ResourcesView.jsx';
import CreditsLedgerView from './components/CreditsLedgerView.jsx';
import HealthModal from './components/HealthModal.jsx';
import { api } from './api.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentStudent, setCurrentStudent] = useState(null);
  const [selectedStudentForDetail, setSelectedStudentForDetail] = useState(null);
  const [isHealthModalOpen, setIsHealthModalOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    loadCurrentStudent();
  }, []);

  async function loadCurrentStudent() {
    try {
      const res = await api.getCurrentProfile();
      if (res.success) {
        setCurrentStudent(res.data);
      }
    } catch (err) {
      console.warn('Could not load current student:', err.message);
    }
  }

  function toggleTheme() {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }

  function showToast(msg) {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  }

  return (
    <div className="app-container">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentStudent={currentStudent}
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenHealth={() => setIsHealthModalOpen(true)}
      />

      {/* Main View Container */}
      <main className="main-content">
        {activeTab === 'dashboard' && (
          <DashboardView
            studentId={currentStudent ? currentStudent.id : 'stu-101'}
            setActiveTab={setActiveTab}
            setSelectedStudentForDetail={setSelectedStudentForDetail}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'team-finder' && (
          <TeamFinderView
            onShowToast={showToast}
            onSelectStudent={(student) => {
              setSelectedStudentForDetail(student);
              setActiveTab('profiles');
            }}
          />
        )}

        {activeTab === 'profiles' && (
          <ProfilesView
            currentStudent={currentStudent}
            selectedStudentForDetail={selectedStudentForDetail}
            setSelectedStudentForDetail={setSelectedStudentForDetail}
            onProfileUpdated={(updated) => {
              setCurrentStudent(updated);
            }}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'resources' && (
          <ResourcesView
            currentStudent={currentStudent}
            onShowToast={showToast}
            onCreditsUpdated={loadCurrentStudent}
          />
        )}

        {activeTab === 'credits' && (
          <CreditsLedgerView
            studentId={currentStudent ? currentStudent.id : 'stu-101'}
            onShowToast={showToast}
            onCreditsUpdated={loadCurrentStudent}
          />
        )}
      </main>

      {/* System Health Diagnostics Modal */}
      <HealthModal
        isOpen={isHealthModalOpen}
        onClose={() => setIsHealthModalOpen(false)}
      />

      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="toast-container">
          <div className="toast">
            <span>✨</span>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{
        marginTop: 'auto',
        borderTop: '1px solid var(--border-subtle)',
        padding: '2rem 1.5rem',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.82rem',
        background: 'var(--bg-canvas)',
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
          <div style={{ fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
            PeerCraft — AI-Powered Campus Student Collaboration Platform
          </div>
          <div>FIND PEOPLE · SHARE RESOURCES · BUILD TOGETHER</div>
          <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>
            Built with React 19, Vite, Express, Dify AI Workflows & Campus Credit Ledger
          </div>
        </div>
      </footer>
    </div>
  );
}
