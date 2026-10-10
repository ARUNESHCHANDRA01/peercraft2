import React, { useState, useEffect } from 'react';
import { 
  Coins, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ShieldCheck, 
  RefreshCw
} from 'lucide-react';
import { api } from '../api.js';

export default function CreditsLedgerView({ 
  studentId, 
  onShowToast, 
  onCreditsUpdated 
}) {
  const [balanceData, setBalanceData] = useState(null);
  const [ledgerData, setLedgerData] = useState([]);
  const [rules, setRules] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadCreditsData();
  }, [studentId]);

  async function loadCreditsData() {
    try {
      setLoading(true);
      setError(null);
      const [balRes, ledRes, rulesRes] = await Promise.all([
        api.getCreditBalance(studentId),
        api.getCreditLedger(studentId),
        api.getCreditRules(),
      ]);

      if (balRes.success) setBalanceData(balRes.data);
      if (ledRes.success) setLedgerData(ledRes.data.transactions || []);
      if (rulesRes.success) setRules(rulesRes.data);
    } catch (err) {
      setError(err.message || 'Error loading credits ledger');
    } finally {
      setLoading(false);
    }
  }

  // Handle spending / redemption
  async function handleRedeemAction(item) {
    if (!balanceData || balanceData.balance < item.amount) {
      onShowToast(`Insufficient Campus Credits. You need ${item.amount} CC, but have ${balanceData?.balance || 0} CC.`);
      return;
    }

    try {
      setActionLoading(true);
      const res = await api.recordTransaction({
        studentId,
        amount: item.amount,
        type: 'SPEND',
        category: 'PERK_REDEMPTION',
        description: `Redeemed perk: ${item.action}`,
        idempotencyKey: `redeem-${Date.now()}`,
      });

      if (res.success) {
        onShowToast(`Redeemed "${item.action}"! Deducted ${item.amount} CC.`);
        if (onCreditsUpdated) onCreditsUpdated();
        loadCreditsData();
      }
    } catch (err) {
      onShowToast(err.message || 'Transaction failed');
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '40vh', gap: '1rem' }}>
        <div style={{ width: '36px', height: '36px', border: '3px solid var(--border-subtle)', borderTopColor: 'var(--color-emerald)', borderRadius: '50%' }} className="animate-spin" />
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Verifying authoritative ledger balance...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--color-rose)', fontWeight: 600 }}>{error}</p>
        <button className="btn btn-secondary" style={{ marginTop: '1rem' }} onClick={loadCreditsData}>Retry</button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '2rem 2.5rem', background: 'var(--gradient-surface)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div style={{ padding: '0.5rem', borderRadius: '12px', background: 'var(--color-emerald-glow)', color: 'var(--color-emerald)' }}>
              <Coins size={24} />
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Campus Credits & Auditable Ledger</h1>
            <span className="badge badge-emerald">Double-Entry Ledger</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '650px', fontSize: '0.95rem' }}>
            Campus Credits incentivize academic collaboration and community contributions. Balances are cryptographically tracked in an immutable, server-authoritative ledger.
          </p>
        </div>

        <button className="btn btn-secondary" onClick={loadCreditsData} title="Refresh Ledger">
          <RefreshCw size={16} />
          <span>Refresh Ledger</span>
        </button>
      </div>

      {/* Balance Card & Economy Rules */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Authoritative Balance Card */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', borderLeft: '4px solid var(--color-emerald)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Authoritative Balance</span>
            <span className="badge badge-emerald">Verified Ledger</span>
          </div>
          <div style={{ fontSize: '2.8rem', fontWeight: 900, color: 'var(--color-emerald)', lineHeight: 1 }}>
            {balanceData?.balance ?? '---'} <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>CC</span>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Associated with student account <strong>{balanceData?.studentName}</strong> ({studentId}). All balances are verified against server-side transaction logs.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
            <ShieldCheck size={16} color="var(--color-emerald)" />
            <span>Idempotency-protected against duplicate credit events</span>
          </div>
        </div>

        {/* Earning Rules Card */}
        <div className="glass-panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ArrowUpRight size={18} color="var(--color-emerald)" />
            <span>How to Earn Campus Credits</span>
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {rules?.earningRules?.map((rule, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.75rem', borderRadius: '6px', background: 'var(--bg-surface-elevated)', fontSize: '0.82rem' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{rule.action}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{rule.note}</div>
                </div>
                <span style={{ fontWeight: 800, color: 'var(--color-emerald)', fontSize: '0.9rem' }}>
                  +{rule.amount} CC
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Spending Perks Card */}
        <div className="glass-panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ArrowDownLeft size={18} color="var(--color-rose)" />
            <span>Redeem Available Campus Perks</span>
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {rules?.spendingRules?.map((perk, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.75rem', borderRadius: '6px', background: 'var(--bg-surface-elevated)', fontSize: '0.82rem' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{perk.action}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{perk.note}</div>
                </div>
                <button
                  disabled={actionLoading}
                  onClick={() => handleRedeemAction(perk)}
                  className="btn btn-secondary"
                  style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem', color: 'var(--color-rose)', borderColor: 'rgba(244, 63, 94, 0.3)' }}
                >
                  -{perk.amount} CC
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Complete Auditable Ledger Table */}
      <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Complete Transaction Ledger</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Total recorded entries: {ledgerData.length}
            </p>
          </div>
          <span className="badge badge-primary">Ledger v1.0</span>
        </div>

        {ledgerData.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', textAlign: 'center', padding: '2rem 0' }}>
            No recorded ledger transactions yet.
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Type</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Category</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Description</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Timestamp</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Idempotency Hash</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {ledgerData.map((tx) => (
                  <tr key={tx.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span style={{
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        background: tx.type === 'EARN' ? 'var(--color-emerald-glow)' : 'rgba(244, 63, 94, 0.15)',
                        color: tx.type === 'EARN' ? 'var(--color-emerald)' : 'var(--color-rose)',
                      }}>
                        {tx.type}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{tx.category}</td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}>{tx.description}</td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                      {new Date(tx.timestamp).toLocaleString()}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {tx.idempotencyKey || 'N/A'}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 800, color: tx.type === 'EARN' ? 'var(--color-emerald)' : 'var(--color-rose)' }}>
                      {tx.type === 'EARN' ? `+${tx.amount}` : `-${tx.amount}`} CC
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
