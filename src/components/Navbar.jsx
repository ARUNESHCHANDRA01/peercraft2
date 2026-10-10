import React, { useState } from 'react';
import { 
  Users, 
  Sparkles, 
  BookOpen, 
  Coins, 
  LayoutDashboard, 
  Activity, 
  Sun, 
  Moon, 
  Star,
  Menu,
  X
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  currentStudent, 
  theme, 
  toggleTheme, 
  onOpenHealth 
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'team-finder', label: 'AI Team Finder', icon: Sparkles, badge: 'AI' },
    { id: 'profiles', label: 'Student Profiles', icon: Users },
    { id: 'resources', label: 'Resource Exchange', icon: BookOpen },
    { id: 'credits', label: 'Campus Credits', icon: Coins },
  ];

  function handleNavClick(tabId) {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  }

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border-subtle)',
      boxShadow: 'var(--shadow-xs)',
    }}>
      <div style={{
        maxWidth: '1240px',
        margin: '0 auto',
        padding: '0.65rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
      }}>
        {/* Brand & Tagline */}
        <div 
          onClick={() => handleNavClick('dashboard')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') handleNavClick('dashboard'); }}
          aria-label="PeerCraft Home"
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', userSelect: 'none' }}
        >
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: 'var(--shadow-xs)',
          }}>
            <Sparkles size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                PeerCraft
              </span>
              <span className="badge badge-primary" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>Campus Hub</span>
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.04em' }}>
              FIND PEOPLE · SHARE RESOURCES · BUILD TOGETHER
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav 
          aria-label="Main Navigation"
          style={{ display: 'none', alignItems: 'center', gap: '0.35rem' }}
          className="desktop-nav"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className="btn btn-ghost"
                style={{
                  minHeight: '38px',
                  padding: '0.45rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  background: isActive ? 'var(--color-primary-subtle)' : 'transparent',
                  color: isActive ? 'var(--color-primary)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.875rem',
                  border: isActive ? '1px solid var(--color-primary-border)' : '1px solid transparent',
                  position: 'relative',
                }}
              >
                <Icon size={16} />
                <span>{item.label}</span>
                {item.badge && (
                  <span style={{
                    fontSize: '0.62rem',
                    background: 'var(--color-primary)',
                    color: '#ffffff',
                    padding: '0.05rem 0.35rem',
                    borderRadius: '4px',
                    fontWeight: 700,
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Desktop Actions & Student Profile Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {/* Health Diagnostics Button */}
          <button
            onClick={onOpenHealth}
            title="System & AI Workflow Diagnostics"
            aria-label="System Health"
            className="btn btn-secondary btn-sm"
            style={{
              padding: '0.35rem 0.65rem',
              gap: '0.35rem',
              color: 'var(--text-secondary)',
              fontSize: '0.75rem',
            }}
          >
            <span style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: 'var(--color-emerald)',
              display: 'inline-block',
            }} />
            <Activity size={14} />
            <span style={{ display: 'none' }} className="status-label">Status</span>
          </button>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            aria-label="Toggle visual theme"
            className="btn btn-secondary btn-sm"
            style={{
              padding: '0.45rem',
              width: '36px',
              height: '36px',
              minHeight: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          {/* Student Status Chip */}
          {currentStudent && (
            <div 
              onClick={() => handleNavClick('profiles')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') handleNavClick('profiles'); }}
              title="Click to view and edit your student profile"
              aria-label={`Student Profile for ${currentStudent.name}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.25rem 0.65rem 0.25rem 0.35rem',
                borderRadius: 'var(--radius-full)',
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                cursor: 'pointer',
                transition: 'border-color 0.15s ease',
              }}
            >
              <img
                src={currentStudent.avatar}
                alt={currentStudent.name}
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
              />
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', display: 'none' }} className="student-name">
                {currentStudent.name}
              </span>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.2rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--color-emerald)',
                background: 'var(--color-emerald-subtle)',
                padding: '0.15rem 0.4rem',
                borderRadius: 'var(--radius-full)',
              }}>
                <Coins size={12} />
                <span>{currentStudent.campusCredits} CC</span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.15rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--color-amber)',
              }}>
                <Star size={12} fill="currentColor" />
                <span>{currentStudent.reputationScore}</span>
              </div>
            </div>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            className="btn btn-secondary btn-sm mobile-menu-btn"
            style={{
              padding: '0.45rem',
              width: '38px',
              height: '38px',
              minHeight: '38px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Responsive Styles Injection */}
      <style>{`
        @media (min-width: 860px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
          .status-label, .student-name {
            display: inline !important;
          }
        }
      `}</style>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={{
          borderTop: '1px solid var(--border-subtle)',
          background: 'var(--bg-surface)',
          padding: '0.85rem 1.25rem 1.25rem 1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.45rem',
        }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="btn btn-ghost"
                style={{
                  width: '100%',
                  justifyContent: 'flex-start',
                  padding: '0.65rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: isActive ? 'var(--color-primary-subtle)' : 'transparent',
                  color: isActive ? 'var(--color-primary)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.92rem',
                  border: isActive ? '1px solid var(--color-primary-border)' : '1px solid transparent',
                }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
                {item.badge && (
                  <span style={{
                    marginLeft: 'auto',
                    fontSize: '0.65rem',
                    background: 'var(--color-primary)',
                    color: '#ffffff',
                    padding: '0.1rem 0.4rem',
                    borderRadius: '4px',
                    fontWeight: 700,
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
