import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Search, 
  Plus, 
  Download, 
  ThumbsUp, 
  Coins, 
  X,
  AlertCircle
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
        onShowToast('Resource upvoted! Thanks for helping curate quality notes.');
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
        onShowToast(`Opened "${title}". Happy learning!`);
      }
    } catch (err) {
      onShowToast(err.message || 'Download error');
    }
  }

  async function handleCreateResource(e) {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) {
      setFormError('Both title and description are required.');
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div className="card" style={{ padding: '1.75rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem', borderLeft: '4px solid var(--color-secondary)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
            <div style={{ padding: '0.45rem', borderRadius: '10px', background: 'var(--color-secondary-subtle)', color: 'var(--color-secondary)' }}>
              <BookOpen size={22} />
            </div>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 800 }}>Resource Exchange</h1>
            <span className="badge badge-emerald">+15 Credits per Contribution</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '650px', fontSize: '0.92rem' }}>
            Discover and share verified course notes, exam study guides, and development templates. Contributing verified materials directly awards Campus Credits!
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} />
          <span>Contribute Resource</span>
        </button>
      </div>

      {/* Search Bar & Category Tabs */}
      <div className="card" style={{ padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <Search size={18} color="var(--text-muted)" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search resources by keywords, topics, or course tags..."
            className="form-input"
            style={{ border: 'none', background: 'transparent', boxShadow: 'none', minHeight: '36px', padding: 0 }}
          />
          {search && (
            <button
              type="button"
              onClick={() => { setSearch(''); loadResources(); }}
              className="btn btn-ghost btn-sm"
              style={{ padding: '0.2rem', minHeight: 'auto' }}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
          <button type="submit" className="btn btn-secondary btn-sm">
            Search
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', overflowX: 'auto', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.65rem' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className="btn btn-sm"
              style={{
                padding: '0.25rem 0.75rem',
                minHeight: '30px',
                fontSize: '0.78rem',
                background: selectedCategory === cat ? 'var(--color-primary-subtle)' : 'var(--bg-surface-elevated)',
                borderColor: selectedCategory === cat ? 'var(--color-primary-border)' : 'var(--border-subtle)',
                color: selectedCategory === cat ? 'var(--color-primary)' : 'var(--text-secondary)',
                fontWeight: selectedCategory === cat ? 700 : 500,
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
          <div style={{ width: '36px', height: '36px', border: '3px solid var(--border-subtle)', borderTopColor: 'var(--color-secondary)', borderRadius: '50%' }} className="animate-spin" />
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Fetching campus study resources...</p>
        </div>
      ) : error ? (
        <div className="card" style={{ padding: '2.5rem', textAlign: 'center' }}>
          <AlertCircle size={32} color="var(--color-rose)" style={{ margin: '0 auto 0.75rem auto' }} />
          <p style={{ color: 'var(--color-rose)', fontWeight: 600, marginBottom: '1rem' }}>{error}</p>
          <button className="btn btn-secondary" onClick={loadResources}>Retry</button>
        </div>
      ) : resources.length === 0 ? (
        <div className="card" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
            {search ? `No learning resources match "${search}".` : `No learning resources found in "${selectedCategory}".`}
          </p>
          <button 
            className="btn btn-secondary btn-sm" 
            onClick={() => { setSearch(''); setSelectedCategory('All'); }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
          {resources.map((item) => (
            <div
              key={item.id}
              className="card"
              style={{
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem',
              }}
            >
              {/* Category & Reward Badge */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="badge badge-primary">{item.category}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-emerald)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  <Coins size={12} /> +{item.creditsReward} CC Reward
                </span>
              </div>

              {/* Title & Description */}
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '0.35rem' }}>{item.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {item.description}
                </p>
              </div>

              {/* Tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                {item.tags.map((tag) => (
                  <span key={tag} className="badge badge-neutral" style={{ fontSize: '0.68rem' }}>
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Metadata & Actions */}
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.85rem', marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span>Contributed by {item.authorName}</span>
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <button
                      onClick={() => handleUpvote(item.id)}
                      title="Upvote this resource"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--color-primary)',
                        cursor: 'pointer',
                        fontWeight: 600,
                      }}
                    >
                      <ThumbsUp size={14} />
                      <span>{item.upvotes}</span>
                    </button>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Download size={14} />
                      <span>{item.downloads}</span>
                    </span>
                  </div>

                  <button
                    className="btn btn-secondary btn-sm"
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
        <div className="modal-overlay">
          <div className="modal-content" style={{ padding: '1.75rem', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Contribute Study Resource</h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--color-emerald)', fontWeight: 600 }}>Earns +15 Campus Credits upon publication</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} aria-label="Close" style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateResource} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div className="form-group">
                <label className="form-label">Resource Title *</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Operating Systems Memory Management Revision Notes"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category *</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="form-select"
                >
                  {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Describe the topics covered, helpful formulas, or practice problems included..."
                  rows={3}
                  className="form-textarea"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tags (comma separated)</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="e.g. OS, Paging, Virtual Memory"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Document Format</label>
                <select
                  value={newFileType}
                  onChange={(e) => setNewFileType(e.target.value)}
                  className="form-select"
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

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn btn-primary btn-sm">
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
