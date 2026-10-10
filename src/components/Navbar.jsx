import React from 'react';
import { 
  Users, 
  Sparkles, 
  BookOpen, 
  Coins, 
  LayoutDashboard, 
  Activity, 
  Sun, 
  Moon, 
  Star 
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  currentStudent, 
  theme, 
  toggleTheme, 
  onOpenHealth 
}) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'team-finder', label: 'AI Team Finder', icon: Sparkles, badge: 'AI' },
    { id: 'profiles', label: 'Student Profiles', icon: Users },
    { id: 'resources', label: 'Resource Exchange', icon: BookOpen },
    { id: 'credits', label: 'Campus Credits', icon: Coins },
  ];

  return (
    <header className="navbar-container" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'var(--bg-glass)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '0.75rem 1.5rem',
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        {/* Brand & Tagline */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', cursor: 'pointer' }} onClick={() => setActiveTab('dashboard')}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'var(--gradient-brand)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 4px 12px var(--color-primary-glow)',
          }}>
            <Sparkles size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', background: 'var(--gradient-brand)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                PeerCraft
              </span>
              <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>Campus AI</span>
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em' }}>
              FIND PEOPLE · SHARE RESOURCES · BUILD TOGETHER
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', overflowX: 'auto' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.55rem 0.95rem',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  background: isActive ? 'var(--color-primary-glow)' : 'transparent',
                  color: isActive ? 'var(--color-primary-light)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  borderBottom: isActive ? '2px solid var(--color-primary)' : '2px solid transparent',
                  whiteSpace: 'nowrap',
                }}
              >
                <Icon size={16} />
                <span>{item.label}</span>
                {item.badge && (
                  <span style={{
                    fontSize: '0.62rem',
                    background: 'var(--gradient-accent)',
                    color: '#fff',
                    padding: '0.1rem 0.35rem',
                    borderRadius: '4px',
                    fontWeight: 800,
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Actions & Student Profile Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Health Monitor Trigger */}
          <button
            onClick={onOpenHealth}
            title="System & AI Health Status"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.45rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: 600,
            }}
          >
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#10b981',
              boxShadow: '0 0 8px #10b981',
              display: 'inline-block',
            }} />
            <Activity size={14} />
            <span>Status</span>
          </button>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            style={{
              padding: '0.45rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Student Status Pill */}
          {currentStudent && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              padding: '0.35rem 0.75rem 0.35rem 0.45rem',
              borderRadius: '9999px',
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
            }}>
              <img
                src={currentStudent.avatar}
                alt={currentStudent.name}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
              />
              <div style={{ fontSize: '0.82rem' }}>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{currentStudent.name}</span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.2rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--color-emerald)',
                background: 'var(--color-emerald-glow)',
                padding: '0.15rem 0.45rem',
                borderRadius: '9999px',
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
        </div>
      </div>
    </header>
  );
}
