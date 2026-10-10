import React, { useState, useEffect } from 'react';
import { 
  Coins, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ShieldCheck, 
  RefreshCw,
  AlertCircle
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

  // Calculate real totals from actual ledger entries
  const totalEarned = ledgerData
    .filter((tx) => tx.type === 'EARN')
    .reduce((acc, curr) => acc + (curr.amount || 0), 0);

  const totalSpent = ledgerData
    .filter((tx) => tx.type === 'SPEND')
    .reduce((acc, curr) => acc + (curr.amount || 0), 0);

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
      <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
        <AlertCircle size={32} color="var(--color-rose)" style={{ margin: '0 auto 0.75rem auto' }} />
        <p style={{ color: 'var(--color-rose)', fontWeight: 600, marginBottom: '1rem' }}>{error}</p>
        <button className="btn btn-secondary" onClick={loadCreditsData}>Retry</button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div className="card" style={{ padding: '1.75rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem', borderLeft: '4px solid var(--color-emerald)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
            <div style={{ padding: '0.45rem', borderRadius: '10px', background: 'var(--color-emerald-subtle)', color: 'var(--color-emerald)' }}>
              <Coins size={22} />
            </div>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 800 }}>Campus Credits & Auditable Ledger</h1>
            <span className="badge badge-emerald">Double-Entry Ledger</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '650px', fontSize: '0.92rem' }}>
            Campus Credits incentivize academic collaboration and community contributions. All balances are verified against server-side transaction logs with idempotency safeguards.
          </p>
        </div>

        <button className="btn btn-secondary" onClick={loadCreditsData} title="Refresh Ledger">
          <RefreshCw size={15} />
          <span>Refresh Ledger</span>
        </button>
      </div>

      {/* Credit Summary Cards: Available, Earned, Spent */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
        {/* Available Balance */}
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', borderLeft: '4px solid var(--color-emerald)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
              Available Balance
            </span>
            <span className="badge badge-emerald">Authoritative</span>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--color-emerald)', lineHeight: 1.1 }}>
            {balanceData?.balance ?? 0} <span style={{ fontSize: '1rem', fontWeight: 700 }}>CC</span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Associated with <strong>{balanceData?.studentName}</strong> ({studentId})
          </p>
        </div>

        {/* Total Earned */}
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
              Total Earned
            </span>
            <span className="badge badge-primary">Cumulative</span>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--color-primary)', lineHeight: 1.1 }}>
            +{totalEarned} <span style={{ fontSize: '1rem', fontWeight: 700 }}>CC</span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            From shared resources, welcome bonus & verified milestones
          </p>
        </div>

        {/* Total Spent */}
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
              Total Redeemed
            </span>
            <span className="badge badge-neutral">Spent</span>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1.1 }}>
            -{totalSpent} <span style={{ fontSize: '1rem', fontWeight: 700 }}>CC</span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Redeemed for project spotlights & study materials
          </p>
        </div>
      </div>

      {/* Rules & Spending Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
        {/* Earning Rules */}
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ArrowUpRight size={18} color="var(--color-emerald)" />
            <span>How to Earn Campus Credits</span>
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
            {rules?.earningRules?.map((rule, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-surface-elevated)', fontSize: '0.82rem' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{rule.action}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{rule.note}</div>
                </div>
                <span style={{ fontWeight: 800, color: 'var(--color-emerald)', fontSize: '0.88rem' }}>
                  +{rule.amount} CC
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Spending Perks */}
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ArrowDownLeft size={18} color="var(--color-rose)" />
            <span>Redeem Available Campus Perks</span>
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
            {rules?.spendingRules?.map((perk, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-surface-elevated)', fontSize: '0.82rem' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{perk.action}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{perk.note}</div>
                </div>
                <button
                  disabled={actionLoading}
                  onClick={() => handleRedeemAction(perk)}
                  className="btn btn-secondary btn-sm"
                  style={{ color: 'var(--color-rose)', borderColor: 'var(--color-rose-border)', minHeight: '30px', padding: '0.25rem 0.65rem' }}
                >
                  -{perk.amount} CC
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Complete Auditable Ledger Table */}
      <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Complete Transaction Ledger</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Immutable transaction log ({ledgerData.length} entries recorded)
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--color-emerald)', fontWeight: 600 }}>
            <ShieldCheck size={16} />
            <span>Idempotency Protected</span>
          </div>
        </div>

        {ledgerData.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center', padding: '2rem 0' }}>
            No recorded transactions in your ledger yet.
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.65rem 0.75rem' }}>Type</th>
                  <th style={{ padding: '0.65rem 0.75rem' }}>Category</th>
                  <th style={{ padding: '0.65rem 0.75rem' }}>Description</th>
                  <th style={{ padding: '0.65rem 0.75rem' }}>Timestamp</th>
                  <th style={{ padding: '0.65rem 0.75rem' }}>Idempotency Hash</th>
                  <th style={{ padding: '0.65rem 0.75rem', textAlign: 'right' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {ledgerData.map((tx) => (
                  <tr key={tx.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '0.65rem 0.75rem' }}>
                      <span style={{
                        padding: '0.15rem 0.45rem',
                        borderRadius: '4px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        background: tx.type === 'EARN' ? 'var(--color-emerald-subtle)' : 'var(--color-rose-subtle)',
                        color: tx.type === 'EARN' ? 'var(--color-emerald)' : 'var(--color-rose)',
                        border: `1px solid ${tx.type === 'EARN' ? 'var(--color-emerald-border)' : 'var(--color-rose-border)'}`,
                      }}>
                        {tx.type}
                      </span>
                    </td>
                    <td style={{ padding: '0.65rem 0.75rem', fontWeight: 600 }}>{tx.category}</td>
                    <td style={{ padding: '0.65rem 0.75rem', color: 'var(--text-secondary)' }}>{tx.description}</td>
                    <td style={{ padding: '0.65rem 0.75rem', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                      {new Date(tx.timestamp).toLocaleString()}
                    </td>
                    <td style={{ padding: '0.65rem 0.75rem', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {tx.idempotencyKey || 'N/A'}
                    </td>
                    <td style={{ padding: '0.65rem 0.75rem', textAlign: 'right', fontWeight: 800, color: tx.type === 'EARN' ? 'var(--color-emerald)' : 'var(--color-rose)' }}>
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
