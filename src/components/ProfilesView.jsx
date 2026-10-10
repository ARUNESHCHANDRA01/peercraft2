import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Star, 
  Globe, 
  Edit3, 
  X
} from 'lucide-react';

function GithubIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  );
}
import { api } from '../api.js';

export default function ProfilesView({ 
  currentStudent, 
  selectedStudentForDetail, 
  setSelectedStudentForDetail, 
  onProfileUpdated,
  onShowToast 
}) {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedSkillFilter, setSelectedSkillFilter] = useState('');

  // Edit Profile Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editBio, setEditBio] = useState('');
  const [editGithub, setEditGithub] = useState('');
  const [editPortfolio, setEditPortfolio] = useState('');
  const [editAvailability, setEditAvailability] = useState('');
  const [editSkills, setEditSkills] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [editError, setEditError] = useState(null);

  useEffect(() => {
    loadProfiles();
  }, [selectedSkillFilter]);

  async function loadProfiles() {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getProfiles(selectedSkillFilter);
      if (res.success) {
        setProfiles(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load student profiles');
    } finally {
      setLoading(false);
    }
  }

  function openEditModal() {
    if (!currentStudent) return;
    setEditBio(currentStudent.bio || '');
    setEditGithub(currentStudent.github || '');
    setEditPortfolio(currentStudent.portfolio || '');
    setEditAvailability(currentStudent.availability || '');
    setEditSkills((currentStudent.skills || []).join(', '));
    setEditError(null);
    setIsEditModalOpen(true);
  }

  async function handleSaveProfile(e) {
    e.preventDefault();
    try {
      setSavingProfile(true);
      setEditError(null);

      const parsedSkills = editSkills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await api.updateProfile(currentStudent.id, {
        bio: editBio,
        github: editGithub,
        portfolio: editPortfolio,
        availability: editAvailability,
        skills: parsedSkills,
      });

      if (res.success) {
        setIsEditModalOpen(false);
        onProfileUpdated(res.data);
        onShowToast('Profile updated successfully!');
        loadProfiles();
      }
    } catch (err) {
      setEditError(err.message || 'Error updating profile');
    } finally {
      setSavingProfile(false);
    }
  }

  const filteredProfiles = profiles.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.major.toLowerCase().includes(q) ||
      (p.bio && p.bio.toLowerCase().includes(q)) ||
      p.skills.some((sk) => sk.toLowerCase().includes(q))
    );
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '2rem 2.5rem', background: 'var(--gradient-surface)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div style={{ padding: '0.5rem', borderRadius: '12px', background: 'var(--color-primary-glow)', color: 'var(--color-primary-light)' }}>
              <Users size={24} />
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Student Profiles</h1>
            <span className="badge badge-emerald">Verified Campus Directory</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '650px', fontSize: '0.95rem' }}>
            Explore verified student profiles across campus. Review documented skill proficiencies, portfolios, peer ratings, and collaboration history.
          </p>
        </div>

        {currentStudent && (
          <button className="btn btn-primary" onClick={openEditModal}>
            <Edit3 size={16} />
            <span>Edit My Profile</span>
          </button>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '280px' }}>
          <Search size={18} color="var(--text-muted)" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, major, or skill (e.g. Python, React, AI)..."
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: '0.92rem',
              fontFamily: 'var(--font-sans)',
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflowX: 'auto' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Filter:</span>
          {['', 'React', 'Python', 'FastAPI', 'Figma', 'Docker'].map((skill) => (
            <button
              key={skill || 'all'}
              onClick={() => setSelectedSkillFilter(skill)}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.78rem',
                fontWeight: 600,
                border: selectedSkillFilter === skill ? '1px solid var(--color-primary-light)' : '1px solid var(--border-subtle)',
                background: selectedSkillFilter === skill ? 'var(--color-primary-glow)' : 'var(--bg-surface-elevated)',
                color: selectedSkillFilter === skill ? 'var(--color-primary-light)' : 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              {skill || 'All Skills'}
            </button>
          ))}
        </div>
      </div>

      {/* Profiles Grid */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', gap: '1rem' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid var(--border-subtle)', borderTopColor: 'var(--color-primary)', borderRadius: '50%' }} className="animate-spin" />
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Loading profiles...</p>
        </div>
      ) : error ? (
        <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--color-rose)', fontWeight: 600 }}>{error}</p>
          <button className="btn btn-secondary" style={{ marginTop: '1rem' }} onClick={loadProfiles}>Retry</button>
        </div>
      ) : filteredProfiles.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)' }}>No student profiles match your search criteria.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.5rem' }}>
          {filteredProfiles.map((student) => {
            const isMe = currentStudent && currentStudent.id === student.id;
            return (
              <div
                key={student.id}
                className="glass-panel"
                style={{
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem',
                  position: 'relative',
                  borderTop: isMe ? '3px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                }}
              >
                {/* Profile Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <img
                      src={student.avatar}
                      alt={student.name}
                      style={{ width: '56px', height: '56px', borderRadius: '16px', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 800, fontSize: '1.05rem' }}>{student.name}</span>
                        {isMe && <span className="badge badge-primary" style={{ fontSize: '0.62rem' }}>You</span>}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {student.major}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        {student.year} • {student.university}
                      </div>
                    </div>
                  </div>

                  {/* Reputation Badge */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    background: 'rgba(245, 158, 11, 0.12)',
                    color: 'var(--color-amber)',
                    padding: '0.35rem 0.65rem',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                  }}>
                    <Star size={14} fill="currentColor" />
                    <span>{student.reputationScore}</span>
                  </div>
                </div>

                {/* Bio */}
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {student.bio}
                </p>

                {/* Skill Proficiencies */}
                {student.skillProficiencies && Object.keys(student.skillProficiencies).length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Skill Proficiencies:
                    </span>
                    {Object.entries(student.skillProficiencies).slice(0, 3).map(([skillName, level]) => (
                      <div key={skillName} style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{skillName}</span>
                          <span style={{ color: 'var(--color-primary-light)', fontWeight: 700 }}>{level}%</span>
                        </div>
                        <div style={{ width: '100%', height: '5px', background: 'var(--bg-surface-elevated)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${level}%`, height: '100%', background: 'var(--gradient-brand)', borderRadius: '3px' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Availability & Links */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', marginTop: 'auto' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-secondary)' }}>
                    ⏰ {student.availability}
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {student.github && (
                      <a
                        href={student.github}
                        target="_blank"
                        rel="noreferrer"
                        title="GitHub Profile"
                        style={{ padding: '0.35rem', borderRadius: '6px', background: 'var(--bg-surface-elevated)', color: 'var(--text-secondary)' }}
                      >
                        <GithubIcon size={16} />
                      </a>
                    )}
                    {student.portfolio && (
                      <a
                        href={student.portfolio}
                        target="_blank"
                        rel="noreferrer"
                        title="Portfolio"
                        style={{ padding: '0.35rem', borderRadius: '6px', background: 'var(--bg-surface-elevated)', color: 'var(--text-secondary)' }}
                      >
                        <Globe size={16} />
                      </a>
                    )}
                    <button
                      className="btn btn-secondary"
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                      onClick={() => setSelectedStudentForDetail(student)}
                    >
                      Reviews
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Student Detail Modal (Peer Reviews & History) */}
      {selectedStudentForDetail && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1.5rem',
        }}>
          <div className="glass-panel" style={{ maxWidth: '600px', width: '100%', maxHeight: '85vh', overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative' }}>
            <button
              onClick={() => setSelectedStudentForDetail(null)}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
              }}
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <img
                src={selectedStudentForDetail.avatar}
                alt={selectedStudentForDetail.name}
                style={{ width: '64px', height: '64px', borderRadius: '18px', objectFit: 'cover' }}
              />
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{selectedStudentForDetail.name}</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  {selectedStudentForDetail.major} • {selectedStudentForDetail.year}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.35rem' }}>
                  <span className="badge badge-emerald">★ {selectedStudentForDetail.reputationScore} Reputation</span>
                  <span className="badge badge-primary">{selectedStudentForDetail.collaborationsCompleted || 0} Collaborations</span>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Bio</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{selectedStudentForDetail.bio}</p>
            </div>

            {/* Verified Reviews Section */}
            <div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                Verified Peer Reviews
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {selectedStudentForDetail.reputationDetails?.reviews?.length > 0 ? (
                  selectedStudentForDetail.reputationDetails.reviews.map((rev) => (
                    <div
                      key={rev.id}
                      style={{
                        padding: '1rem',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-surface-elevated)',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.35rem',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>{rev.reviewerName}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: 'var(--color-amber)', fontSize: '0.8rem', fontWeight: 700 }}>
                          <Star size={12} fill="currentColor" /> {rev.rating}
                        </div>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-primary-light)', fontWeight: 600 }}>
                        Project: "{rev.projectTitle}" • {rev.verifiedMilestone}
                      </div>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontStyle: 'italic', marginTop: '0.25rem' }}>
                        "{rev.comment}"
                      </p>
                    </div>
                  ))
                ) : (
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    No recorded peer reviews yet for this student.
                  </p>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button className="btn btn-secondary" onClick={() => setSelectedStudentForDetail(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1.5rem',
        }}>
          <div className="glass-panel" style={{ maxWidth: '520px', width: '100%', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Edit Student Profile</h3>
              <button onClick={() => setIsEditModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
                  Bio
                </label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  rows={3}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', fontSize: '0.88rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
                  Skills (comma separated)
                </label>
                <input
                  type="text"
                  value={editSkills}
                  onChange={(e) => setEditSkills(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', fontSize: '0.88rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
                  Availability
                </label>
                <input
                  type="text"
                  value={editAvailability}
                  onChange={(e) => setEditAvailability(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', fontSize: '0.88rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={editGithub}
                    onChange={(e) => setEditGithub(e.target.value)}
                    placeholder="https://github.com/..."
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', fontSize: '0.88rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
                    Portfolio URL
                  </label>
                  <input
                    type="url"
                    value={editPortfolio}
                    onChange={(e) => setEditPortfolio(e.target.value)}
                    placeholder="https://yourname.dev"
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', fontSize: '0.88rem' }}
                  />
                </div>
              </div>

              {editError && (
                <div style={{ color: 'var(--color-rose)', fontSize: '0.82rem' }}>{editError}</div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" disabled={savingProfile} className="btn btn-primary">
                  {savingProfile ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
