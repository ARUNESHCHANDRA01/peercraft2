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
      zIndex: 1100,
      padding: '1.5rem',
    }}>
      <div className="glass-panel" style={{ maxWidth: '520px', width: '100%', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative' }}>
        <button
          onClick={onClose}
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ padding: '0.5rem', borderRadius: '12px', background: 'var(--color-emerald-glow)', color: 'var(--color-emerald)' }}>
            <Activity size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>System Health & Diagnostics</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Live platform & external service connectivity</p>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{ width: '32px', height: '32px', border: '3px solid var(--border-subtle)', borderTopColor: 'var(--color-emerald)', borderRadius: '50%', margin: '0 auto' }} className="animate-spin" />
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.75rem' }}>Querying /api/health...</p>
          </div>
        ) : error ? (
          <div style={{ padding: '1rem', borderRadius: 'var(--radius-sm)', background: 'rgba(244, 63, 94, 0.15)', color: 'var(--color-rose)', fontSize: '0.85rem' }}>
            {error}
          </div>
        ) : health ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Express Server */}
            <div style={{ padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Server size={18} color="var(--color-primary-light)" />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Express API Server</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Uptime: {health.uptimeSeconds}s • Env: {health.environment}
                  </div>
                </div>
              </div>
              <span className="badge badge-emerald">Operational</span>
            </div>

            {/* Storage Provider */}
            <div style={{ padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Database size={18} color="var(--color-secondary)" />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Database & Storage Layer</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {health.services.storage.provider}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                    {health.services.storage.records.students} Students • {health.services.storage.records.resources} Resources
                  </div>
                </div>
              </div>
              <span className="badge badge-emerald">Operational</span>
            </div>

            {/* Dify AI Workflow */}
            <div style={{ padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Sparkles size={18} color="var(--color-amber)" />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Dify AI Workflow (PEERCRAFT)</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Engine: {health.services.dify.engine}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
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

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
          <button className="btn btn-secondary" onClick={loadHealth} style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}>
            <RefreshCw size={14} />
            <span>Re-check</span>
          </button>
          <button className="btn btn-primary" onClick={onClose} style={{ fontSize: '0.8rem', padding: '0.45rem 1rem' }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
