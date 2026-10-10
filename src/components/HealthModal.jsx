import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  X, 
  Database, 
  Sparkles, 
  Server, 
  RefreshCw 
} from 'lucide-react';
import { api } from '../api.js';

export default function HealthModal({ isOpen, onClose }) {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadHealth();
    }
  }, [isOpen]);

  async function loadHealth() {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getHealth();
      setHealth(res);
    } catch (err) {
      setError(err.message || 'Failed to reach health endpoint');
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ padding: '1.75rem', gap: '1.25rem', maxWidth: '480px' }}>
        <button
          onClick={onClose}
          aria-label="Close"
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{ padding: '0.45rem', borderRadius: '10px', background: 'var(--color-emerald-subtle)', color: 'var(--color-emerald)' }}>
            <Activity size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Platform Diagnostics</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Live connectivity and service health</p>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{ width: '32px', height: '32px', border: '3px solid var(--border-subtle)', borderTopColor: 'var(--color-emerald)', borderRadius: '50%', margin: '0 auto' }} className="animate-spin" />
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.75rem' }}>Querying /api/health...</p>
          </div>
        ) : error ? (
          <div style={{ padding: '0.85rem', borderRadius: 'var(--radius-md)', background: 'var(--color-rose-subtle)', color: 'var(--color-rose)', fontSize: '0.85rem' }}>
            {error}
          </div>
        ) : health ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {/* Express Server */}
            <div style={{ padding: '0.75rem 0.85rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Server size={18} color="var(--color-primary)" />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Express API Server</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Uptime: {health.uptimeSeconds}s • Env: {health.environment}
                  </div>
                </div>
              </div>
              <span className="badge badge-emerald">Operational</span>
            </div>

            {/* Storage Provider */}
            <div style={{ padding: '0.75rem 0.85rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Database size={18} color="var(--color-secondary)" />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Database & Storage Layer</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {health.services.storage.provider}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.1rem' }}>
                    {health.services.storage.records.students} Students • {health.services.storage.records.resources} Resources
                  </div>
                </div>
              </div>
              <span className="badge badge-emerald">Operational</span>
            </div>

            {/* Dify AI Workflow */}
            <div style={{ padding: '0.75rem 0.85rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Sparkles size={18} color="var(--color-amber)" />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Dify AI Workflow (PEERCRAFT)</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Engine: {health.services.dify.engine}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.1rem' }}>
                    Endpoint: {health.services.dify.baseUrl}
                  </div>
                </div>
              </div>
              <span className={health.services.dify.configured ? 'badge badge-emerald' : 'badge badge-amber'}>
                {health.services.dify.configured ? 'Live Key Set' : 'Fallback Active'}
              </span>
            </div>
          </div>
        ) : null}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.35rem' }}>
          <button className="btn btn-secondary btn-sm" onClick={loadHealth}>
            <RefreshCw size={13} />
            <span>Re-check</span>
          </button>
          <button className="btn btn-primary btn-sm" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
