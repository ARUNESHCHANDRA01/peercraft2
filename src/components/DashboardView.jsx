import React, { useEffect, useState } from 'react';
import { 
  Sparkles, 
  Coins, 
  Star, 
  Users, 
  BookOpen, 
  ArrowRight, 
  Clock, 
  CheckCircle,
  AlertCircle
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
        <div style={{ width: '36px', height: '36px', border: '3px solid var(--border-subtle)', borderTopColor: 'var(--color-primary)', borderRadius: '50%' }} className="animate-spin" />
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Loading your student collaboration dashboard...</p>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="card" style={{ padding: '2.5rem', textAlign: 'center', margin: '2rem 0' }}>
        <AlertCircle size={36} color="var(--color-rose)" style={{ margin: '0 auto 1rem auto' }} />
        <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Unable to load dashboard data</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>{error || 'An unexpected connection error occurred.'}</p>
        <button className="btn btn-secondary" onClick={loadDashboard}>Retry</button>
      </div>
    );
  }

  const { profile, credits, reputation, recommendedTeammates, recentResources } = dashboardData;

  // Check for missing profile items to offer genuine guidance
  const isProfileIncomplete = !profile.github || !profile.portfolio || !profile.bio;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Welcome Banner */}
      <div className="card" style={{
        padding: '2rem',
        background: 'var(--bg-surface)',
        borderLeft: '4px solid var(--color-primary)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <img
              src={profile.avatar}
              alt={profile.name}
              style={{
                width: '68px',
                height: '68px',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-subtle)',
                objectFit: 'cover',
              }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: '1.65rem', fontWeight: 800 }}>
                  Welcome back, {profile.name}!
                </h1>
                <span className="badge badge-primary">{profile.year}</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem', fontSize: '0.92rem', maxWidth: '640px' }}>
                Your campus hub to discover compatible teammates, share verified study resources, and build projects together.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <span>🏫 {profile.university}</span>
                <span>•</span>
                <span>🎓 {profile.major}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
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

      {/* Helpful Profile Tip if missing details */}
      {isProfileIncomplete && (
        <div className="card" style={{
          padding: '1rem 1.25rem',
          background: 'var(--color-primary-subtle)',
          borderColor: 'var(--color-primary-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <CheckCircle size={18} color="var(--color-primary)" />
            <span style={{ fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: 500 }}>
              Tip: Add your portfolio and GitHub links so the AI team finder can accurately match you with project creators.
            </span>
          </div>
          <button 
            className="btn btn-secondary btn-sm" 
            onClick={() => setActiveTab('profiles')}
            style={{ fontWeight: 600 }}
          >
            Update Profile
          </button>
        </div>
      )}

      {/* Verified Metrics Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1rem',
      }}>
        {/* Campus Credits */}
        <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Campus Credits
            </span>
            <div style={{ padding: '0.4rem', borderRadius: '8px', background: 'var(--color-emerald-subtle)', color: 'var(--color-emerald)' }}>
              <Coins size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--color-emerald)' }}>
            {credits.balance} <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>CC</span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Authoritative ledger balance. Earn by sharing study notes or completing milestones.
          </p>
        </div>

        {/* Reputation Score */}
        <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Peer Reputation
            </span>
            <div style={{ padding: '0.4rem', borderRadius: '8px', background: 'var(--color-amber-subtle)', color: 'var(--color-amber)' }}>
              <Star size={18} fill="currentColor" />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--color-amber)' }}>
            {reputation.score} <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>/ 5.0</span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Based on {reputation.reviewsCount} peer reviews from verified campus hackathons & projects.
          </p>
        </div>

        {/* Collaborations Completed */}
        <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Completed Projects
            </span>
            <div style={{ padding: '0.4rem', borderRadius: '8px', background: 'var(--color-primary-subtle)', color: 'var(--color-primary)' }}>
              <Users size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {reputation.collaborationsCompleted}
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Successful project milestones completed with campus peers.
          </p>
        </div>
      </div>

      {/* Two Column Layout: Recommended Teammates & Recent Resources */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        {/* Recommended Teammates Column */}
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} color="var(--color-primary)" />
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Recommended Teammates</h2>
            </div>
            <button
              onClick={() => setActiveTab('team-finder')}
              className="btn btn-ghost btn-sm"
              style={{ color: 'var(--color-primary)', fontWeight: 600, padding: '0.25rem 0.5rem' }}
            >
              Run AI Match <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {recommendedTeammates.map((student) => (
              <div
                key={student.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  gap: '0.75rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <img
                    src={student.avatar}
                    alt={student.name}
                    style={{ width: '44px', height: '44px', borderRadius: '12px', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{student.name}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-amber)', display: 'flex', alignItems: 'center', gap: '0.15rem' }}>
                        <Star size={11} fill="currentColor" /> {student.reputationScore}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {student.major} • {student.year}
                    </div>
                    <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.35rem', flexWrap: 'wrap' }}>
                      {student.skills.slice(0, 3).map((sk) => (
                        <span key={sk} className="badge badge-primary" style={{ fontSize: '0.65rem' }}>
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setSelectedStudentForDetail(student);
                    setActiveTab('profiles');
                  }}
                >
                  View Profile
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Learning Resources Column */}
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BookOpen size={18} color="var(--color-secondary)" />
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Recent Campus Resources</h2>
            </div>
            <button
              onClick={() => setActiveTab('resources')}
              className="btn btn-ghost btn-sm"
              style={{ color: 'var(--color-secondary)', fontWeight: 600, padding: '0.25rem 0.5rem' }}
            >
              Browse Library <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {recentResources.map((res) => (
              <div
                key={res.id}
                style={{
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="badge badge-primary" style={{ fontSize: '0.68rem' }}>{res.category}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-emerald)', fontWeight: 700 }}>
                    +{res.creditsReward} CC Reward
                  </span>
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{res.title}</div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {res.description}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  <span>Contributed by {res.authorName}</span>
                  <span>👍 {res.upvotes} Upvotes</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Ledger Activity */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={18} color="var(--color-primary)" />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Recent Campus Credit Ledger Activity</h2>
          </div>
          <button
            onClick={() => setActiveTab('credits')}
            className="btn btn-ghost btn-sm"
            style={{ color: 'var(--color-primary)', fontWeight: 600, padding: '0.25rem 0.5rem' }}
          >
            Full Ledger Audit <ArrowRight size={14} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {credits.recentTransactions.map((tx) => (
            <div
              key={tx.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <span style={{
                  padding: '0.25rem 0.55rem',
                  borderRadius: '6px',
                  fontWeight: 700,
                  fontSize: '0.72rem',
                  background: tx.type === 'EARN' ? 'var(--color-emerald-subtle)' : 'var(--color-rose-subtle)',
                  color: tx.type === 'EARN' ? 'var(--color-emerald)' : 'var(--color-rose)',
                  border: `1px solid ${tx.type === 'EARN' ? 'var(--color-emerald-border)' : 'var(--color-rose-border)'}`,
                }}>
                  {tx.type}
                </span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{tx.description}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {tx.category} • {new Date(tx.timestamp).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div style={{
                fontWeight: 800,
                fontSize: '0.95rem',
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
