import express from 'express';
import { store } from '../services/store.js';

const router = express.Router();

router.get('/:studentId', (req, res) => {
  const { studentId } = req.params;
  const student = store.getStudentById(studentId);

  if (!student) {
    return res.status(404).json({ success: false, error: 'Student not found' });
  }

  const allStudents = store.getStudents();
  // Recommended teammates (other students matching complementary skills)
  const otherStudents = allStudents
    .filter((s) => s.id !== studentId)
    .slice(0, 3);

  const recentResources = store.getResources().slice(0, 3);
  const recentTransactions = store.getCreditLedger(studentId).slice(0, 4);
  const reputationDetails = store.getReputation(studentId);

  res.json({
    success: true,
    data: {
      profile: student,
      credits: {
        balance: student.campusCredits,
        recentTransactions,
      },
      reputation: {
        score: student.reputationScore,
        collaborationsCompleted: student.collaborationsCompleted,
        reviewsCount: reputationDetails?.totalReviews || 0,
      },
      recommendedTeammates: otherStudents,
      recentResources,
      platformStats: {
        registeredStudents: allStudents.length,
        sharedResources: store.getResources().length,
      },
    },
  });
});

export default router;
