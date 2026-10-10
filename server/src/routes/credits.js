import express from 'express';
import { validateCreditTransaction } from '../middleware/validation.js';
import { store } from '../services/store.js';

const router = express.Router();

// Transparent campus credit economy rules
const CREDIT_RULES = {
  earningRules: [
    { action: 'Welcome Community Bonus', amount: 50, note: 'One-time reward upon joining PeerCraft' },
    { action: 'Resource Contribution', amount: 15, note: 'Awarded when sharing notes, cheat sheets, or templates' },
    { action: 'Verified Collaboration Milestone', amount: 25, note: 'Awarded when teammates submit a verified 5-star review' },
    { action: 'Peer Code Review / Mentorship', amount: 20, note: 'Awarded for mentoring junior students' },
  ],
  spendingRules: [
    { action: 'Premium Resource Access', amount: 10, note: 'Unlock curated project archives or exclusive exam guides' },
    { action: 'Featured Teammate Spotlight', amount: 30, note: 'Highlight your profile at the top of candidate searches for 7 days' },
    { action: 'Priority Project Team Match', amount: 25, note: 'Boost your project in teammate recommendation feeds' },
  ],
};

// GET earning and spending rules
router.get('/rules', (req, res) => {
  res.json({
    success: true,
    data: CREDIT_RULES,
  });
});

// GET authoritative credit balance
router.get('/balance/:studentId', (req, res) => {
  const balance = store.getCreditBalance(req.params.studentId);
  if (!balance) {
    return res.status(404).json({ success: false, error: 'Student record not found' });
  }

  res.json({
    success: true,
    data: balance,
  });
});

// GET auditable credit transaction ledger
router.get('/ledger/:studentId', (req, res) => {
  const student = store.getStudentById(req.params.studentId);
  if (!student) {
    return res.status(404).json({ success: false, error: 'Student record not found' });
  }

  const transactions = store.getCreditLedger(req.params.studentId);

  res.json({
    success: true,
    data: {
      studentId: student.id,
      studentName: student.name,
      currentBalance: student.campusCredits,
      totalTransactions: transactions.length,
      transactions,
    },
  });
});

// POST process authoritative credit transaction
router.post('/transaction', validateCreditTransaction, (req, res, next) => {
  try {
    const { studentId, amount, type, category, description, idempotencyKey } = req.body;

    const result = store.recordCreditTransaction({
      studentId,
      amount: parseInt(amount, 10),
      type,
      category: category || 'MANUAL_TRANSACTION',
      description: description || `${type} transaction of ${amount} credits`,
      idempotencyKey,
    });

    res.status(result.duplicate ? 200 : 201).json({
      success: true,
      data: result.transaction,
      isDuplicate: result.duplicate,
      newBalance: result.newBalance,
    });
  } catch (error) {
    if (error.message.includes('Insufficient campus credits balance')) {
      return res.status(422).json({ success: false, error: error.message });
    }
    next(error);
  }
});

export default router;
