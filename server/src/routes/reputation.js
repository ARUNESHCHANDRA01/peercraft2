import express from 'express';
import { validatePeerReview } from '../middleware/validation.js';
import { store } from '../services/store.js';

const router = express.Router();

// GET student reputation and peer reviews
router.get('/:studentId', (req, res) => {
  const reputation = store.getReputation(req.params.studentId);
  if (!reputation) {
    return res.status(404).json({ success: false, error: 'Student profile not found' });
  }

  res.json({
    success: true,
    data: reputation,
  });
});

// POST submit a verified peer review
router.post('/review', validatePeerReview, (req, res, next) => {
  try {
    const { reviewerId, recipientId, projectTitle, rating, comment, verifiedMilestone } = req.body;

    const review = store.submitPeerReview({
      reviewerId,
      recipientId,
      projectTitle,
      rating,
      comment,
      verifiedMilestone,
    });

    const updatedReputation = store.getReputation(recipientId);

    res.status(201).json({
      success: true,
      data: review,
      recipientReputation: updatedReputation,
      notice: 'Verified peer review published! +25 Campus Credits awarded to the recipient for successful collaboration.',
    });
  } catch (error) {
    if (error.message.includes('Self-awarded peer reviews are forbidden')) {
      return res.status(403).json({ success: false, error: error.message });
    }
    next(error);
  }
});

export default router;
