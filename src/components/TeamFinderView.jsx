import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  Star, 
  CheckCircle, 
  AlertCircle, 
  Code, 
  Info, 
  UserPlus
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

      // Micro-animation steps
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '2rem 2.5rem', background: 'var(--gradient-surface)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <div style={{ padding: '0.5rem', borderRadius: '12px', background: 'var(--color-primary-glow)', color: 'var(--color-primary-light)' }}>
            <Sparkles size={24} />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>AI Team Matcher</h1>
          <span className="badge badge-primary">Dify PEERCRAFT Engine</span>
        </div>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '750px', fontSize: '0.95rem' }}>
          Describe your campus project idea, select required competencies, and our multi-stage AI workflow will evaluate project scope, analyze student competencies, and rank compatible teammates.
        </p>
      </div>

      {/* Main Grid: Input Form & Results */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '2rem' }}>
        {/* Form Column */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Code size={18} color="var(--color-primary-light)" />
            <span>Project Scope & Requirements</span>
          </h2>

          <form onSubmit={handleFindTeam} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Project Idea */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                Project Idea / Concept *
              </label>
              <textarea
                value={projectIdea}
                onChange={(e) => setProjectIdea(e.target.value)}
                placeholder="e.g., We are building an intelligent campus resource hub with real-time peer matching, interactive study room booking, and automated notes summarization using LLMs..."
                rows={4}
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                  fontFamily: 'var(--font-sans)',
                  resize: 'vertical',
                }}
              />
            </div>

            {/* Required Skills Selection */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                Required Skills
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginBottom: '0.75rem' }}>
                {POPULAR_SKILLS.map((skill) => {
                  const isSelected = selectedSkills.includes(skill);
                  return (
                    <button
                      type="button"
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      style={{
                        padding: '0.35rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        border: isSelected ? '1px solid var(--color-primary-light)' : '1px solid var(--border-subtle)',
                        background: isSelected ? 'var(--color-primary-glow)' : 'var(--bg-surface-elevated)',
                        color: isSelected ? 'var(--color-primary-light)' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {isSelected ? '✓ ' : '+ '}{skill}
                    </button>
                  );
                })}
              </div>

              {/* Add Custom Skill */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  value={customSkill}
                  onChange={(e) => setCustomSkill(e.target.value)}
                  placeholder="Add custom skill..."
                  style={{
                    flex: 1,
                    padding: '0.45rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '0.82rem',
                  }}
                />
                <button type="button" onClick={addCustomSkill} className="btn btn-secondary" style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}>
                  Add
                </button>
              </div>
            </div>

            {/* Target Roles */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                Target Teammate Roles
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.5rem' }}>
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
                        padding: '0.55rem 0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        background: isSelected ? 'var(--color-primary-glow)' : 'var(--bg-surface-elevated)',
                        border: isSelected ? '1px solid var(--border-active)' : '1px solid var(--border-subtle)',
                        cursor: 'pointer',
                        fontSize: '0.82rem',
                        fontWeight: 500,
                        color: isSelected ? 'var(--color-primary-light)' : 'var(--text-secondary)',
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

            {/* Availability */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                Availability Schedule
              </label>
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.9rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '0.88rem',
                }}
              >
                <option value="Flexible">Flexible (Anytime)</option>
                <option value="Weekends">Weekends Only</option>
                <option value="Evenings">Weekday Evenings</option>
                <option value="15+ hrs/week">Intensive (15+ hrs/week)</option>
              </select>
            </div>

            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)', color: 'var(--color-rose)', fontSize: '0.85rem' }}>
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem' }}
            >
              {loading ? (
                <>
                  <div style={{ width: '16px', height: '16px', border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%' }} className="animate-spin" />
                  <span>Matching Teammates...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>Execute Team Matcher</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Loading Animation States */}
          {loading && (
            <div className="glass-panel" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '380px', gap: '1.5rem', textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }} className="animate-spin">
                <Sparkles size={28} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>AI Workflow Executing</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '0.25rem' }}>
                  {analysisStep === 1 && 'Step 1/3: Parsing project scope and skill requirements...'}
                  {analysisStep === 2 && 'Step 2/3: Searching knowledge base for verified student profiles...'}
                  {analysisStep >= 3 && 'Step 3/3: Evaluating compatibility and calculating match scores...'}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', width: '240px' }}>
                <div style={{ flex: 1, height: '4px', borderRadius: '2px', background: analysisStep >= 1 ? 'var(--color-primary)' : 'var(--border-subtle)' }} />
                <div style={{ flex: 1, height: '4px', borderRadius: '2px', background: analysisStep >= 2 ? 'var(--color-primary)' : 'var(--border-subtle)' }} />
                <div style={{ flex: 1, height: '4px', borderRadius: '2px', background: analysisStep >= 3 ? 'var(--color-primary)' : 'var(--border-subtle)' }} />
              </div>
            </div>
          )}

          {/* Initial Blank State */}
          {!loading && !matchResult && (
            <div className="glass-panel" style={{ padding: '3rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '380px', gap: '1rem' }}>
              <div style={{ padding: '1rem', borderRadius: '50%', background: 'var(--color-primary-glow)', color: 'var(--color-primary-light)' }}>
                <Search size={32} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Ready to Match</h3>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '380px', fontSize: '0.88rem' }}>
                Fill out the project details on the left and trigger the matching engine. We'll find peers with verified proficiencies that complement your goals.
              </p>
            </div>
          )}

          {/* Real Match Results */}
          {!loading && matchResult && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Scope & Engine Metadata Card */}
              <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--color-primary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span className="badge badge-primary">Scope Summary</span>
                  <span className="badge badge-emerald" style={{ fontSize: '0.68rem' }}>
                    {matchResult.meta?.source === 'dify_workflow' ? 'Live Dify AI' : 'Deterministic Engine'}
                  </span>
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
                  {matchResult.projectSummary}
                </p>
                {matchResult.meta?.note && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <Info size={14} />
                    <span>{matchResult.meta.note}</span>
                  </div>
                )}
              </div>

              {/* Candidate Matches */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                    Top Ranked Candidates ({matchResult.matches.length})
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Ranked by skill overlap & schedule fit
                  </span>
                </div>

                {matchResult.matches.map((candidate) => (
                  <div
                    key={candidate.studentId}
                    className="glass-panel"
                    style={{
                      padding: '1.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <img
                          src={candidate.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                          alt={candidate.name}
                          style={{ width: '56px', height: '56px', borderRadius: '16px', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontWeight: 800, fontSize: '1.05rem' }}>{candidate.name}</span>
                            {candidate.reputationScore && (
                              <span style={{ fontSize: '0.8rem', color: 'var(--color-amber)', display: 'flex', alignItems: 'center', gap: '0.15rem' }}>
                                <Star size={13} fill="currentColor" /> {candidate.reputationScore}
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            {candidate.major} • {candidate.year}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--color-secondary)', marginTop: '0.2rem' }}>
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
                        background: 'var(--gradient-brand)',
                        padding: '0.5rem 0.85rem',
                        borderRadius: 'var(--radius-md)',
                        color: '#fff',
                        boxShadow: '0 4px 12px var(--color-primary-glow)',
                      }}>
                        <span style={{ fontSize: '1.25rem', fontWeight: 900, lineHeight: 1 }}>{candidate.matchScore}%</span>
                        <span style={{ fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Match</span>
                      </div>
                    </div>

                    {/* Match Reasons */}
                    <div style={{
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-surface-elevated)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.35rem',
                    }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Why Recommended:</span>
                      {candidate.reasons.map((reason, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                          <CheckCircle size={14} color="var(--color-emerald)" />
                          <span>{reason}</span>
                        </div>
                      ))}
                    </div>

                    {/* Skills Chips */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {candidate.skills.map((sk) => (
                        <span key={sk} className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
                          {sk}
                        </span>
                      ))}
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '0.45rem 0.85rem', fontSize: '0.82rem' }}
                        onClick={() => onSelectStudent(candidate)}
                      >
                        View Full Profile
                      </button>
                      <button
                        className="btn btn-primary"
                        style={{ padding: '0.45rem 1rem', fontSize: '0.82rem' }}
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
          <div className="glass-panel" style={{ maxWidth: '480px', width: '100%', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <img
                src={inviteModalCandidate.avatar}
                alt={inviteModalCandidate.name}
                style={{ width: '48px', height: '48px', borderRadius: '14px', objectFit: 'cover' }}
              />
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Invite {inviteModalCandidate.name}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Send a campus team collaboration invitation</p>
              </div>
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Inviting <strong>{inviteModalCandidate.name}</strong> to collaborate on your project idea. When they accept and you reach a project milestone together, you both earn verified Campus Credits and peer reputation reviews!
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button className="btn btn-secondary" onClick={() => setInviteModalCandidate(null)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleInviteSend}>
                Confirm & Send Invitation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
