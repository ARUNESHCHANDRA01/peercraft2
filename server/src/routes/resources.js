import express from 'express';
import { validateResourceCreation } from '../middleware/validation.js';
import { store } from '../services/store.js';

const router = express.Router();

// GET all resources with filtering
router.get('/', (req, res) => {
  const { category, search } = req.query;
  const resources = store.getResources({ category, search });

  res.json({
    success: true,
    data: resources,
  });
});

// GET single resource
router.get('/:id', (req, res) => {
  const resource = store.getResourceById(req.params.id);
  if (!resource) {
    return res.status(404).json({ success: false, error: 'Resource not found' });
  }

  res.json({
    success: true,
    data: resource,
  });
});

// POST create resource (awards +15 credits)
router.post('/', validateResourceCreation, (req, res, next) => {
  try {
    const { title, description, category, tags, authorId, authorName, fileType } = req.body;
    const author = store.getStudentById(authorId);
    const resolvedName = author ? author.name : (authorName || 'Campus Contributor');

    const created = store.createResource({
      title,
      description,
      category,
      tags: tags || ['General'],
      authorId,
      authorName: resolvedName,
      fileType,
    });

    res.status(201).json({
      success: true,
      data: created,
      rewardNotice: 'Awarded +15 Campus Credits to your ledger for contributing to the community!',
    });
  } catch (error) {
    next(error);
  }
});

// POST upvote resource
router.post('/:id/upvote', (req, res) => {
  const resource = store.upvoteResource(req.params.id);
  if (!resource) {
    return res.status(404).json({ success: false, error: 'Resource not found' });
  }

  res.json({
    success: true,
    data: resource,
  });
});

// POST download resource
router.post('/:id/download', (req, res) => {
  const resource = store.downloadResource(req.params.id);
  if (!resource) {
    return res.status(404).json({ success: false, error: 'Resource not found' });
  }

  res.json({
    success: true,
    data: resource,
  });
});

export default router;
