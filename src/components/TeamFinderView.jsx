import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  Star, 
  CheckCircle, 
  AlertCircle, 
  Code, 
  Info, 
  UserPlus,
  X
} from 'lucide-react';
import { api } from '../api.js';

const POPULAR_SKILLS = [
  'React', 'Node.js', 'Python', 'FastAPI', 'PyTorch', 
  'TypeScript', 'Figma', 'Docker', 'Go', 'Flutter', 'PostgreSQL'
];

const COMMON_ROLES = [
  'Frontend Developer', 'Backend Developer', 'AI/ML Engineer', 
  'UI/UX Designer', 'DevOps Specialist', 'Mobile Developer'
];

export default function TeamFinderView({ 
  onShowToast, 
  onSelectStudent 
}) {
  const [projectIdea, setProjectIdea] = useState('');
  const [selectedSkills, setSelectedSkills] = useState(['React', 'Node.js']);
  const [customSkill, setCustomSkill] = useState('');
  const [selectedRoles, setSelectedRoles] = useState(['Frontend Developer']);
  const [availability, setAvailability] = useState('Flexible');
  
  const [loading, setLoading] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0); // 0: Idle, 1: Scope, 2: Competency, 3: Compatibility
  const [matchResult, setMatchResult] = useState(null);
  const [error, setError] = useState(null);
  const [inviteModalCandidate, setInviteModalCandidate] = useState(null);

  function toggleSkill(skill) {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  }

  function removeSkill(skill) {
    setSelectedSkills(selectedSkills.filter((s) => s !== skill));
  }

  function addCustomSkill(e) {
    e.preventDefault();
    if (customSkill.trim() && !selectedSkills.includes(customSkill.trim())) {
      setSelectedSkills([...selectedSkills, customSkill.trim()]);
      setCustomSkill('');
    }
  }

  function toggleRole(role) {
    if (selectedRoles.includes(role)) {
      setSelectedRoles(selectedRoles.filter((r) => r !== role));
    } else {
      setSelectedRoles([...selectedRoles, role]);
    }
  }

  async function handleFindTeam(e) {
    e.preventDefault();
    if (!projectIdea.trim() || projectIdea.trim().length < 5) {
      setError('Please provide a project description with at least 5 characters.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setMatchResult(null);

      // Guided animation steps
      setAnalysisStep(1);
      const step1 = setTimeout(() => setAnalysisStep(2), 600);
      const step2 = setTimeout(() => setAnalysisStep(3), 1200);

      const res = await api.findTeam({
        projectIdea: projectIdea.trim(),
        requiredSkills: selectedSkills,
        preferredRoles: selectedRoles,
        availability,
      });

      clearTimeout(step1);
      clearTimeout(step2);

      if (res.success) {
        setMatchResult(res.data);
      }
    } catch (err) {
      setError(err.message || 'Error occurred while matching project teammates.');
    } finally {
      setLoading(false);
      setAnalysisStep(0);
    }
  }

  function handleInviteSend() {
    onShowToast(`Team invitation sent to ${inviteModalCandidate.name}! They will be notified.`);
    setInviteModalCandidate(null);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header Banner */}
      <div className="card" style={{ padding: '1.75rem 2rem', borderLeft: '4px solid var(--color-primary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
          <div style={{ padding: '0.45rem', borderRadius: '10px', background: 'var(--color-primary-subtle)', color: 'var(--color-primary)' }}>
            <Sparkles size={22} />
          </div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800 }}>AI Team Finder</h1>
          <span className="badge badge-primary">Guided Matcher</span>
        </div>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '720px', fontSize: '0.92rem' }}>
          Describe your project vision and select required skills. Our campus matching engine evaluates compatibility, student competencies, and schedule availability.
        </p>
      </div>

      {/* Main Grid: Input Form & Results */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
        {/* Form Column */}
        <div className="card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Code size={18} color="var(--color-primary)" />
              <span>Project Requirements</span>
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Follow these simple steps to find compatible student teammates.
            </p>
          </div>

          <form onSubmit={handleFindTeam} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Step 1: Project Idea */}
            <div className="form-group">
              <label className="form-label" htmlFor="project-idea">
                Step 1: What are you building? *
              </label>
              <textarea
                id="project-idea"
                value={projectIdea}
                onChange={(e) => setProjectIdea(e.target.value)}
                placeholder="e.g. I am building a campus marketplace where students can exchange second-hand textbooks and study equipment..."
                rows={4}
                className="form-textarea"
                style={{ resize: 'vertical' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span>Be as specific as you like regarding tech stack or goals.</span>
                <span>{projectIdea.length} characters</span>
              </div>
            </div>

            {/* Step 2: Required Skills */}
            <div className="form-group">
              <label className="form-label">
                Step 2: Required Skills & Competencies
              </label>
              
              {/* Selected Skill Badges */}
              {selectedSkills.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.5rem' }}>
                  {selectedSkills.map((skill) => (
                    <span 
                      key={skill}
                      className="badge badge-primary" 
                      style={{ padding: '0.25rem 0.6rem', fontSize: '0.78rem' }}
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        aria-label={`Remove ${skill}`}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'inherit', display: 'flex', alignItems: 'center' }}
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Popular Skill Toggles */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.5rem' }}>
                {POPULAR_SKILLS.map((skill) => {
                  const isSelected = selectedSkills.includes(skill);
                  return (
                    <button
                      type="button"
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className="btn btn-sm"
                      style={{
                        padding: '0.25rem 0.65rem',
                        minHeight: '28px',
                        fontSize: '0.78rem',
                        background: isSelected ? 'var(--color-primary-subtle)' : 'var(--bg-surface-elevated)',
                        borderColor: isSelected ? 'var(--color-primary-border)' : 'var(--border-subtle)',
                        color: isSelected ? 'var(--color-primary)' : 'var(--text-secondary)',
                      }}
                    >
                      {isSelected ? '✓ ' : '+ '}{skill}
                    </button>
                  );
                })}
              </div>

              {/* Custom Skill Input */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  value={customSkill}
                  onChange={(e) => setCustomSkill(e.target.value)}
                  placeholder="Add custom skill (e.g. Next.js, Rust)..."
                  className="form-input"
                  style={{ minHeight: '36px', fontSize: '0.85rem' }}
                  onKeyDown={(e) => { if (e.key === 'Enter') addCustomSkill(e); }}
                />
                <button 
                  type="button" 
                  onClick={addCustomSkill} 
                  className="btn btn-secondary btn-sm"
                  style={{ minHeight: '36px' }}
                >
                  Add
                </button>
              </div>
            </div>

            {/* Step 3: Roles & Availability */}
            <div className="form-group">
              <label className="form-label">
                Step 3: Target Roles (Optional)
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.45rem' }}>
                {COMMON_ROLES.map((role) => {
                  const isSelected = selectedRoles.includes(role);
                  return (
                    <div
                      key={role}
                      onClick={() => toggleRole(role)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        background: isSelected ? 'var(--color-primary-subtle)' : 'var(--bg-surface-elevated)',
                        border: isSelected ? '1px solid var(--color-primary-border)' : '1px solid var(--border-subtle)',
                        cursor: 'pointer',
                        fontSize: '0.8125rem',
                        fontWeight: 500,
                        color: isSelected ? 'var(--color-primary)' : 'var(--text-secondary)',
                        userSelect: 'none',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        style={{ cursor: 'pointer' }}
                      />
                      <span>{role}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="availability-schedule">
                Step 4: Availability Schedule
              </label>
              <select
                id="availability-schedule"
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="form-select"
              >
                <option value="Flexible">Flexible Schedule</option>
                <option value="Weekends">Weekends Only</option>
                <option value="Evenings">Weekday Evenings</option>
                <option value="15+ hrs/week">Dedicated (15+ hrs/week)</option>
              </select>
            </div>

            {error && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-rose-subtle)',
                border: '1px solid var(--color-rose-border)',
                color: 'var(--color-rose)',
                fontSize: '0.85rem',
              }}>
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '0.5rem' }}
            >
              {loading ? (
                <>
                  <div style={{ width: '16px', height: '16px', border: '2px solid #ffffff', borderTopColor: 'transparent', borderRadius: '50%' }} className="animate-spin" />
                  <span>Matching Teammates...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>Find Compatible Teammates</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Loading Animation States */}
          {loading && (
            <div className="card" style={{ padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '360px', gap: '1.25rem', textAlign: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--color-primary-subtle)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="animate-spin">
                <Sparkles size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>AI Matching in Progress</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem', maxWidth: '340px' }}>
                  {analysisStep === 1 && 'Step 1/3: Parsing project scope and required competencies...'}
                  {analysisStep === 2 && 'Step 2/3: Searching knowledge base for verified student profiles...'}
                  {analysisStep >= 3 && 'Step 3/3: Evaluating compatibility and calculating match scores...'}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', width: '220px' }}>
                <div style={{ flex: 1, height: '4px', borderRadius: '2px', background: analysisStep >= 1 ? 'var(--color-primary)' : 'var(--border-subtle)' }} />
                <div style={{ flex: 1, height: '4px', borderRadius: '2px', background: analysisStep >= 2 ? 'var(--color-primary)' : 'var(--border-subtle)' }} />
                <div style={{ flex: 1, height: '4px', borderRadius: '2px', background: analysisStep >= 3 ? 'var(--color-primary)' : 'var(--border-subtle)' }} />
              </div>
            </div>
          )}

          {/* Initial Blank State */}
          {!loading && !matchResult && (
            <div className="card" style={{ padding: '3rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '360px', gap: '0.85rem' }}>
              <div style={{ padding: '0.85rem', borderRadius: '50%', background: 'var(--bg-surface-elevated)', color: 'var(--text-muted)' }}>
                <Search size={28} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Ready to Match</h3>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '360px', fontSize: '0.875rem' }}>
                Provide your project idea on the left and trigger the matching engine. We'll search verified student profiles to find peers with complementary skills.
              </p>
            </div>
          )}

          {/* Real Match Results */}
          {!loading && matchResult && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Scope & Engine Metadata Card */}
              <div className="card" style={{ padding: '1.25rem 1.5rem', borderLeft: '4px solid var(--color-primary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span className="badge badge-primary">Project Analysis</span>
                  <span className="badge badge-emerald">
                    {matchResult.meta?.source === 'dify_workflow' ? 'Live Dify AI' : 'Deterministic Engine'}
                  </span>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                  {matchResult.projectSummary}
                </p>
                {matchResult.meta?.note && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <Info size={13} />
                    <span>{matchResult.meta.note}</span>
                  </div>
                )}
              </div>

              {/* Candidate Matches */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>
                    Matched Teammates ({matchResult.matches.length})
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Ranked by skill overlap & schedule fit
                  </span>
                </div>

                {matchResult.matches.map((candidate) => (
                  <div
                    key={candidate.studentId}
                    className="card"
                    style={{
                      padding: '1.25rem 1.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.85rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                      <div style={{ display: 'flex', gap: '0.85rem' }}>
                        <img
                          src={candidate.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                          alt={candidate.name}
                          style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                            <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>{candidate.name}</span>
                            {candidate.reputationScore && (
                              <span style={{ fontSize: '0.78rem', color: 'var(--color-amber)', display: 'flex', alignItems: 'center', gap: '0.15rem' }}>
                                <Star size={12} fill="currentColor" /> {candidate.reputationScore}
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            {candidate.major} • {candidate.year}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-secondary)', marginTop: '0.15rem' }}>
                            ⏰ {candidate.availability}
                          </div>
                        </div>
                      </div>

                      {/* Match Score Badge */}
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'var(--color-primary-subtle)',
                        border: '1px solid var(--color-primary-border)',
                        padding: '0.35rem 0.65rem',
                        borderRadius: 'var(--radius-md)',
                        color: 'var(--color-primary)',
                      }}>
                        <span style={{ fontSize: '1.15rem', fontWeight: 800, lineHeight: 1 }}>{candidate.matchScore}%</span>
                        <span style={{ fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase' }}>Match</span>
                      </div>
                    </div>

                    {/* Match Reasons */}
                    <div style={{
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-surface-elevated)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.25rem',
                    }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Match Rationale:</span>
                      {candidate.reasons.map((reason, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          <CheckCircle size={13} color="var(--color-emerald)" />
                          <span>{reason}</span>
                        </div>
                      ))}
                    </div>

                    {/* Skills Chips */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                      {candidate.skills.map((sk) => (
                        <span key={sk} className="badge badge-neutral" style={{ fontSize: '0.68rem' }}>
                          {sk}
                        </span>
                      ))}
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.25rem' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => onSelectStudent(candidate)}
                      >
                        Inspect Profile
                      </button>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => setInviteModalCandidate(candidate)}
                      >
                        <UserPlus size={14} />
                        <span>Invite to Team</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Team Invite Modal */}
      {inviteModalCandidate && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ padding: '1.75rem', gap: '1rem', maxWidth: '440px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <img
                src={inviteModalCandidate.avatar}
                alt={inviteModalCandidate.name}
                style={{ width: '44px', height: '44px', borderRadius: '12px', objectFit: 'cover' }}
              />
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Invite {inviteModalCandidate.name}</h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Send a campus team collaboration invite</p>
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Inviting <strong>{inviteModalCandidate.name}</strong> to join your project. Upon accepting and completing a milestone together, you both earn verified Campus Credits and peer reviews.
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button className="btn btn-secondary btn-sm" onClick={() => setInviteModalCandidate(null)}>
                Cancel
              </button>
              <button className="btn btn-primary btn-sm" onClick={handleInviteSend}>
                Send Invitation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
