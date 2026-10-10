import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Search, 
  Plus, 
  Download, 
  ThumbsUp, 
  Coins, 
  X 
} from 'lucide-react';
import { api } from '../api.js';

const CATEGORIES = ['All', 'Course Notes', 'Cheat Sheets', 'Exam Prep', 'Code Templates', 'Design Systems'];

export default function ResourcesView({ 
  currentStudent, 
  onShowToast, 
  onCreditsUpdated 
}) {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // New Resource Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategory, setNewCategory] = useState('Course Notes');
  const [newTags, setNewTags] = useState('');
  const [newFileType, setNewFileType] = useState('PDF Document');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    loadResources();
  }, [selectedCategory]);

  async function loadResources() {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getResources({ category: selectedCategory, search });
      if (res.success) {
        setResources(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load resources');
    } finally {
      setLoading(false);
    }
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    loadResources();
  }

  async function handleUpvote(id) {
    try {
      const res = await api.upvoteResource(id);
      if (res.success) {
        setResources(resources.map((r) => (r.id === id ? res.data : r)));
        onShowToast('Resource upvoted!');
      }
    } catch (err) {
      onShowToast(err.message || 'Error upvoting resource');
    }
  }

  async function handleDownload(id, title) {
    try {
      const res = await api.downloadResource(id);
      if (res.success) {
        setResources(resources.map((r) => (r.id === id ? res.data : r)));
        onShowToast(`Downloaded "${title}". Happy learning!`);
      }
    } catch (err) {
      onShowToast(err.message || 'Download error');
    }
  }

  async function handleCreateResource(e) {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) {
      setFormError('Title and description are required.');
      return;
    }

    try {
      setSubmitting(true);
      setFormError(null);

      const parsedTags = newTags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const res = await api.createResource({
        title: newTitle.trim(),
        description: newDescription.trim(),
        category: newCategory,
        tags: parsedTags.length > 0 ? parsedTags : ['General'],
        authorId: currentStudent ? currentStudent.id : 'stu-101',
        authorName: currentStudent ? currentStudent.name : 'Campus Contributor',
        fileType: newFileType,
      });

      if (res.success) {
        setIsModalOpen(false);
        setNewTitle('');
        setNewDescription('');
        setNewTags('');
        onShowToast('Resource published! +15 Campus Credits awarded to your ledger.');
        if (onCreditsUpdated) onCreditsUpdated();
        loadResources();
      }
    } catch (err) {
      setFormError(err.message || 'Failed to publish resource');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '2rem 2.5rem', background: 'var(--gradient-surface)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div style={{ padding: '0.5rem', borderRadius: '12px', background: 'var(--color-primary-glow)', color: 'var(--color-secondary)' }}>
              <BookOpen size={24} />
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Resource Exchange</h1>
            <span className="badge badge-emerald">+15 Credits / Upload</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '650px', fontSize: '0.95rem' }}>
            Share verified course notes, exam study guides, and development templates with college peers. Contributing resources awards real Campus Credits!
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} />
          <span>Contribute Resource</span>
        </button>
      </div>

      {/* Category Pills & Search */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Search size={18} color="var(--text-muted)" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search resources by keywords, topics, or course tags..."
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: '0.92rem',
              fontFamily: 'var(--font-sans)',
            }}
          />
          <button type="submit" className="btn btn-secondary" style={{ padding: '0.45rem 1rem', fontSize: '0.82rem' }}>
            Search
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflowX: 'auto', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '0.35rem 0.85rem',
                borderRadius: '9999px',
                fontSize: '0.8rem',
                fontWeight: 600,
                border: selectedCategory === cat ? '1px solid var(--color-primary-light)' : '1px solid var(--border-subtle)',
                background: selectedCategory === cat ? 'var(--color-primary-glow)' : 'var(--bg-surface-elevated)',
                color: selectedCategory === cat ? 'var(--color-primary-light)' : 'var(--text-secondary)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Resource Cards Grid */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', gap: '1rem' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid var(--border-subtle)', borderTopColor: 'var(--color-secondary)', borderRadius: '50%' }} className="animate-spin" />
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Fetching campus resources...</p>
        </div>
      ) : error ? (
        <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--color-rose)', fontWeight: 600 }}>{error}</p>
          <button className="btn btn-secondary" style={{ marginTop: '1rem' }} onClick={loadResources}>Retry</button>
        </div>
      ) : resources.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)' }}>No learning resources found in this category.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.5rem' }}>
          {resources.map((item) => (
            <div
              key={item.id}
              className="glass-panel"
              style={{
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                position: 'relative',
              }}
            >
              {/* Category & Reward Badge */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="badge badge-primary">{item.category}</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--color-emerald)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  <Coins size={13} /> +{item.creditsReward} CC Reward
                </span>
              </div>

              {/* Title & Description */}
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.35rem' }}>{item.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {item.description}
                </p>
              </div>

              {/* Tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {item.tags.map((tag) => (
                  <span key={tag} style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'var(--bg-surface-elevated)', color: 'var(--text-muted)' }}>
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Meta Attribution & Action Bar */}
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span>Contributed by {item.authorName}</span>
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <button
                      onClick={() => handleUpvote(item.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--color-primary-light)',
                        cursor: 'pointer',
                        fontWeight: 600,
                      }}
                    >
                      <ThumbsUp size={14} />
                      <span>{item.upvotes}</span>
                    </button>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Download size={14} />
                      <span>{item.downloads}</span>
                    </span>
                  </div>

                  <button
                    className="btn btn-secondary"
                    style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
                    onClick={() => handleDownload(item.id, item.title)}
                  >
                    <Download size={13} />
                    <span>Access Resource</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Contribute Resource Modal */}
      {isModalOpen && (
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
          <div className="glass-panel" style={{ maxWidth: '540px', width: '100%', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Contribute Learning Resource</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-emerald)', fontWeight: 600 }}>Earns +15 Campus Credits upon publication</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateResource} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
                  Resource Title *
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Operating Systems Memory Management Revision Notes"
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', fontSize: '0.88rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
                  Category *
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', fontSize: '0.88rem' }}
                >
                  {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
                  Description *
                </label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Describe the topics covered, helpful formulas, or templates included..."
                  rows={3}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', fontSize: '0.88rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="e.g. OS, Paging, Virtual Memory"
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', fontSize: '0.88rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
                  Document Format
                </label>
                <select
                  value={newFileType}
                  onChange={(e) => setNewFileType(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', fontSize: '0.88rem' }}
                >
                  <option value="PDF Document">PDF Document</option>
                  <option value="Markdown Guide">Markdown Guide</option>
                  <option value="Code Archive (ZIP)">Code Archive (ZIP)</option>
                  <option value="JSON Template">JSON Template</option>
                </select>
              </div>

              {formError && (
                <div style={{ color: 'var(--color-rose)', fontSize: '0.82rem' }}>{formError}</div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn btn-primary">
                  {submitting ? 'Publishing...' : 'Publish & Earn +15 CC'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
