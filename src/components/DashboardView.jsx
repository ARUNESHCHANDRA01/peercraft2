import React, { useEffect, useState } from 'react';
import { 
  Sparkles, 
  Coins, 
  Star, 
  Users, 
  BookOpen, 
  ArrowRight, 
  Clock, 
  Award
} from 'lucide-react';
import { api } from '../api.js';

export default function DashboardView({ 
  studentId, 
  setActiveTab, 
  setSelectedStudentForDetail
}) {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, [studentId]);

  async function loadDashboard() {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getDashboard(studentId);
      if (res.success) {
        setDashboardData(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load campus dashboard data');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', gap: '1rem' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid var(--border-subtle)', borderTopColor: 'var(--color-primary)', borderRadius: '50%' }} className="animate-spin" />
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Loading campus collaboration dashboard...</p>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center', margin: '2rem 0' }}>
        <p style={{ color: 'var(--color-rose)', fontWeight: 600, marginBottom: '1rem' }}>{error || 'Unable to load dashboard'}</p>
        <button className="btn btn-secondary" onClick={loadDashboard}>Retry</button>
      </div>
    );
  }

  const { profile, credits, reputation, recommendedTeammates, recentResources } = dashboardData;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Hero Welcome Banner */}
      <div className="glass-panel" style={{
        padding: '2rem 2.5rem',
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--gradient-surface)',
      }}>
        <div style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '240px',
          height: '240px',
          background: 'var(--color-primary-glow)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <img
              src={profile.avatar}
              alt={profile.name}
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '20px',
                border: '2px solid var(--border-active)',
                boxShadow: '0 8px 24px var(--shadow-md)',
                objectFit: 'cover',
              }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
                  Welcome back, {profile.name}!
                </h1>
                <span className="badge badge-primary">{profile.year}</span>
                <span className="badge badge-emerald">Active Contributor</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', marginTop: '0.35rem', maxWidth: '650px', fontSize: '0.95rem' }}>
                {profile.bio}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.75rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                <span>🏫 {profile.university}</span>
                <span>•</span>
                <span>🎯 {profile.major}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-primary" onClick={() => setActiveTab('team-finder')}>
              <Sparkles size={16} />
              <span>Find Teammates</span>
            </button>
            <button className="btn btn-secondary" onClick={() => setActiveTab('resources')}>
              <BookOpen size={16} />
              <span>Share Notes (+15 CC)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.25rem',
      }}>
        {/* Campus Credits Metric */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Campus Credits</span>
            <div style={{ padding: '0.5rem', borderRadius: '10px', background: 'var(--color-emerald-glow)', color: 'var(--color-emerald)' }}>
              <Coins size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-emerald)' }}>
            {credits.balance} <span style={{ fontSize: '1rem', fontWeight: 600 }}>CC</span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            Authoritative ledger balance. Earn more by contributing verified learning materials.
          </p>
        </div>

        {/* Reputation Score Metric */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Peer Reputation</span>
            <div style={{ padding: '0.5rem', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', color: 'var(--color-amber)' }}>
              <Star size={20} fill="currentColor" />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-amber)' }}>
            {reputation.score} <span style={{ fontSize: '1rem', fontWeight: 600 }}>/ 5.0</span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            Based on {reputation.reviewsCount} verified peer reviews across campus hackathons and projects.
          </p>
        </div>

        {/* Collaborations Completed Metric */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Collaborations</span>
            <div style={{ padding: '0.5rem', borderRadius: '10px', background: 'var(--color-primary-glow)', color: 'var(--color-primary-light)' }}>
              <Users size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {reputation.collaborationsCompleted}
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            Milestones verified with campus peers with zero disputed handoffs.
          </p>
        </div>

        {/* Community Trust Badge Metric */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Campus Standing</span>
            <div style={{ padding: '0.5rem', borderRadius: '10px', background: 'rgba(236, 72, 153, 0.15)', color: '#ec4899' }}>
              <Award size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ec4899', marginTop: '0.35rem' }}>
            Tier 3: Pioneer
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            Eligible for priority project matchmaking and curated research spotlights.
          </p>
        </div>
      </div>

      {/* Two Column Layout: Recommended Teammates & Recent Resources */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.5rem' }}>
        {/* Recommended Teammates Column */}
        <div className="glass-panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Sparkles size={20} color="var(--color-primary-light)" />
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Recommended Campus Teammates</h2>
            </div>
            <button
              onClick={() => setActiveTab('team-finder')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-primary-light)',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
              }}
            >
              Run AI Match <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {recommendedTeammates.map((student) => (
              <div
                key={student.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  gap: '1rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <img
                    src={student.avatar}
                    alt={student.name}
                    style={{ width: '48px', height: '48px', borderRadius: '14px', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{student.name}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-amber)', display: 'flex', alignItems: 'center', gap: '0.15rem' }}>
                        <Star size={12} fill="currentColor" /> {student.reputationScore}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      {student.major} • {student.year}
                    </div>
                    <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.35rem', flexWrap: 'wrap' }}>
                      {student.skills.slice(0, 3).map((sk) => (
                        <span key={sk} className="badge badge-primary" style={{ fontSize: '0.65rem' }}>
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  className="btn btn-secondary"
                  style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
                  onClick={() => {
                    setSelectedStudentForDetail(student);
                    setActiveTab('profiles');
                  }}
                >
                  View
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Learning Resources Column */}
        <div className="glass-panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <BookOpen size={20} color="var(--color-secondary)" />
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Recent Campus Resources</h2>
            </div>
            <button
              onClick={() => setActiveTab('resources')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-secondary)',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
              }}
            >
              Browse All <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {recentResources.map((res) => (
              <div
                key={res.id}
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>{res.category}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-emerald)', fontWeight: 600 }}>
                    +{res.creditsReward} CC Reward
                  </span>
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{res.title}</div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {res.description}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  <span>Contributed by {res.authorName}</span>
                  <span>🔥 {res.upvotes} Upvotes</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Ledger Activity */}
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Clock size={20} color="var(--color-primary-light)" />
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Recent Campus Credit Ledger Activity</h2>
          </div>
          <button
            onClick={() => setActiveTab('credits')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-primary-light)',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
            }}
          >
            Full Ledger Audit <ArrowRight size={14} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {credits.recentTransactions.map((tx) => (
            <div
              key={tx.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.85rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{
                  padding: '0.35rem 0.65rem',
                  borderRadius: '6px',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  background: tx.type === 'EARN' ? 'var(--color-emerald-glow)' : 'rgba(244, 63, 94, 0.15)',
                  color: tx.type === 'EARN' ? 'var(--color-emerald)' : 'var(--color-rose)',
                }}>
                  {tx.type}
                </span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{tx.description}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Category: {tx.category} • {new Date(tx.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>

              <div style={{
                fontWeight: 800,
                fontSize: '1rem',
                color: tx.type === 'EARN' ? 'var(--color-emerald)' : 'var(--color-rose)',
              }}>
                {tx.type === 'EARN' ? `+${tx.amount}` : `-${tx.amount}`} CC
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
