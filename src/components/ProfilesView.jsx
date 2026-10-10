import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Star, 
  Globe, 
  Edit3, 
  X,
  AlertCircle
} from 'lucide-react';
import { api } from '../api.js';

function GithubIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  );
}

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
        onShowToast('Your student profile was updated successfully!');
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div className="card" style={{ padding: '1.75rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem', borderLeft: '4px solid var(--color-primary)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
            <div style={{ padding: '0.45rem', borderRadius: '10px', background: 'var(--color-primary-subtle)', color: 'var(--color-primary)' }}>
              <Users size={22} />
            </div>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 800 }}>Student Profiles</h1>
            <span className="badge badge-emerald">Campus Directory</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '650px', fontSize: '0.92rem' }}>
            Explore peers across campus. Review documented skill proficiencies, portfolios, peer ratings, and collaboration history.
          </p>
        </div>

        {currentStudent && (
          <button className="btn btn-primary" onClick={openEditModal}>
            <Edit3 size={15} />
            <span>Edit My Profile</span>
          </button>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div className="card" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.85rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flex: 1, minWidth: '260px' }}>
          <Search size={18} color="var(--text-muted)" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name, major, or skills..."
            className="form-input"
            style={{ border: 'none', background: 'transparent', boxShadow: 'none', minHeight: '36px', padding: 0 }}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="btn btn-ghost btn-sm"
              style={{ padding: '0.2rem', minHeight: 'auto' }}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', overflowX: 'auto' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Filter:</span>
          {['', 'React', 'Python', 'FastAPI', 'Figma', 'Docker'].map((skill) => (
            <button
              key={skill || 'all'}
              onClick={() => setSelectedSkillFilter(skill)}
              className="btn btn-sm"
              style={{
                padding: '0.25rem 0.65rem',
                minHeight: '28px',
                fontSize: '0.78rem',
                background: selectedSkillFilter === skill ? 'var(--color-primary-subtle)' : 'var(--bg-surface-elevated)',
                borderColor: selectedSkillFilter === skill ? 'var(--color-primary-border)' : 'var(--border-subtle)',
                color: selectedSkillFilter === skill ? 'var(--color-primary)' : 'var(--text-secondary)',
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
          <div style={{ width: '36px', height: '36px', border: '3px solid var(--border-subtle)', borderTopColor: 'var(--color-primary)', borderRadius: '50%' }} className="animate-spin" />
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Loading verified student profiles...</p>
        </div>
      ) : error ? (
        <div className="card" style={{ padding: '2.5rem', textAlign: 'center' }}>
          <AlertCircle size={32} color="var(--color-rose)" style={{ margin: '0 auto 0.75rem auto' }} />
          <p style={{ color: 'var(--color-rose)', fontWeight: 600, marginBottom: '1rem' }}>{error}</p>
          <button className="btn btn-secondary" onClick={loadProfiles}>Retry</button>
        </div>
      ) : filteredProfiles.length === 0 ? (
        <div className="card" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>No student profiles match your search criteria.</p>
          <button className="btn btn-secondary btn-sm" onClick={() => { setSearch(''); setSelectedSkillFilter(''); }}>
            Reset Filters
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
          {filteredProfiles.map((student) => {
            const isMe = currentStudent && currentStudent.id === student.id;
            return (
              <div
                key={student.id}
                className="card"
                style={{
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  borderTop: isMe ? '3px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                }}
              >
                {/* Profile Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', gap: '0.85rem' }}>
                    <img
                      src={student.avatar}
                      alt={student.name}
                      style={{ width: '52px', height: '52px', borderRadius: '12px', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <span style={{ fontWeight: 800, fontSize: '1rem' }}>{student.name}</span>
                        {isMe && <span className="badge badge-primary" style={{ fontSize: '0.62rem' }}>You</span>}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {student.major}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {student.year} • {student.university}
                      </div>
                    </div>
                  </div>

                  {/* Reputation Badge */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.2rem',
                    background: 'var(--color-amber-subtle)',
                    border: '1px solid var(--color-amber-border)',
                    color: 'var(--color-amber)',
                    padding: '0.25rem 0.55rem',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                  }}>
                    <Star size={13} fill="currentColor" />
                    <span>{student.reputationScore}</span>
                  </div>
                </div>

                {/* Bio */}
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {student.bio}
                </p>

                {/* Skill Proficiencies */}
                {student.skillProficiencies && Object.keys(student.skillProficiencies).length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Skill Proficiencies:
                    </span>
                    {Object.entries(student.skillProficiencies).slice(0, 3).map(([skillName, level]) => (
                      <div key={skillName} style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{skillName}</span>
                          <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>{level}%</span>
                        </div>
                        <div style={{ width: '100%', height: '5px', background: 'var(--bg-surface-elevated)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${level}%`, height: '100%', background: 'var(--color-primary)', borderRadius: '3px' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Availability & Links */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.85rem', marginTop: 'auto' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-secondary)' }}>
                    ⏰ {student.availability}
                  </div>

                  <div style={{ display: 'flex', gap: '0.45rem' }}>
                    {student.github && (
                      <a
                        href={student.github}
                        target="_blank"
                        rel="noreferrer"
                        title="GitHub Profile"
                        aria-label={`${student.name}'s GitHub`}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '0.3rem 0.5rem', minHeight: '30px' }}
                      >
                        <GithubIcon size={14} />
                      </a>
                    )}
                    {student.portfolio && (
                      <a
                        href={student.portfolio}
                        target="_blank"
                        rel="noreferrer"
                        title="Portfolio Website"
                        aria-label={`${student.name}'s Portfolio`}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '0.3rem 0.5rem', minHeight: '30px' }}
                      >
                        <Globe size={14} />
                      </a>
                    )}
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '0.3rem 0.65rem', minHeight: '30px', fontSize: '0.75rem' }}
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
        <div className="modal-overlay">
          <div className="modal-content" style={{ padding: '1.75rem', gap: '1.25rem' }}>
            <button
              onClick={() => setSelectedStudentForDetail(null)}
              aria-label="Close modal"
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
            <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
              <img
                src={selectedStudentForDetail.avatar}
                alt={selectedStudentForDetail.name}
                style={{ width: '56px', height: '56px', borderRadius: '14px', objectFit: 'cover' }}
              />
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>{selectedStudentForDetail.name}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {selectedStudentForDetail.major} • {selectedStudentForDetail.year}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                  <span className="badge badge-amber">★ {selectedStudentForDetail.reputationScore} Reputation</span>
                  <span className="badge badge-primary">{selectedStudentForDetail.collaborationsCompleted || 0} Collaborations</span>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div>
              <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>About</h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{selectedStudentForDetail.bio}</p>
            </div>

            {/* Verified Reviews Section */}
            <div>
              <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.65rem' }}>
                Verified Peer Reviews
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {selectedStudentForDetail.reputationDetails?.reviews?.length > 0 ? (
                  selectedStudentForDetail.reputationDetails.reviews.map((rev) => (
                    <div
                      key={rev.id}
                      style={{
                        padding: '0.85rem',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-surface-elevated)',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.25rem',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{rev.reviewerName}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.15rem', color: 'var(--color-amber)', fontSize: '0.78rem', fontWeight: 700 }}>
                          <Star size={12} fill="currentColor" /> {rev.rating}
                        </div>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--color-primary)', fontWeight: 600 }}>
                        Project: "{rev.projectTitle}" • {rev.verifiedMilestone}
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic', marginTop: '0.15rem' }}>
                        "{rev.comment}"
                      </p>
                    </div>
                  ))
                ) : (
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    No recorded peer reviews yet for this student.
                  </p>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.35rem' }}>
              <button className="btn btn-secondary btn-sm" onClick={() => setSelectedStudentForDetail(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ padding: '1.75rem', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Edit Student Profile</h3>
              <button onClick={() => setIsEditModalOpen(false)} aria-label="Close" style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div className="form-group">
                <label className="form-label">Bio</label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  rows={3}
                  className="form-textarea"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Skills (comma separated)</label>
                <input
                  type="text"
                  value={editSkills}
                  onChange={(e) => setEditSkills(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Availability Schedule</label>
                <input
                  type="text"
                  value={editAvailability}
                  onChange={(e) => setEditAvailability(e.target.value)}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                <div className="form-group">
                  <label className="form-label">GitHub URL</label>
                  <input
                    type="url"
                    value={editGithub}
                    onChange={(e) => setEditGithub(e.target.value)}
                    placeholder="https://github.com/..."
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Portfolio URL</label>
                  <input
                    type="url"
                    value={editPortfolio}
                    onChange={(e) => setEditPortfolio(e.target.value)}
                    placeholder="https://yourname.dev"
                    className="form-input"
                  />
                </div>
              </div>

              {editError && (
                <div style={{ color: 'var(--color-rose)', fontSize: '0.82rem' }}>{editError}</div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" disabled={savingProfile} className="btn btn-primary btn-sm">
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
