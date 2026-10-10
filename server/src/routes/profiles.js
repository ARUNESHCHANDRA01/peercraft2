import express from 'express';
import { store } from '../services/store.js';

const router = express.Router();

function isValidUrl(string) {
  if (!string) return true;
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

// GET all profiles
router.get('/', (req, res) => {
  const { skill } = req.query;
  let students = store.getStudents();

  if (skill) {
    const filter = skill.toLowerCase();
    students = students.filter((s) =>
      s.skills.some((sk) => sk.toLowerCase().includes(filter))
    );
  }

  res.json({
    success: true,
    data: students,
  });
});

// GET current authenticated demo student
router.get('/me', (req, res) => {
  const currentStudent = store.getStudentById('stu-101');
  if (!currentStudent) {
    return res.status(404).json({ success: false, error: 'Current profile not found' });
  }

  res.json({
    success: true,
    data: currentStudent,
  });
});

// GET profile by ID
router.get('/:id', (req, res) => {
  const student = store.getStudentById(req.params.id);
  if (!student) {
    return res.status(404).json({ success: false, error: 'Student profile not found' });
  }

  const reputation = store.getReputation(req.params.id);

  res.json({
    success: true,
    data: {
      ...student,
      reputationDetails: reputation,
    },
  });
});

// PUT update profile
router.put('/:id', (req, res) => {
  const { github, portfolio } = req.body;

  if (github && !isValidUrl(github)) {
    return res.status(400).json({ success: false, error: 'Invalid GitHub URL format' });
  }
  if (portfolio && !isValidUrl(portfolio)) {
    return res.status(400).json({ success: false, error: 'Invalid Portfolio URL format' });
  }

  const updated = store.updateStudent(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Student profile not found' });
  }

  res.json({
    success: true,
    data: updated,
  });
});

export default router;
