/**
 * Request validation middlewares
 */

export function validateTeamFinder(req, res, next) {
  const { projectIdea } = req.body || {};

  if (!projectIdea || typeof projectIdea !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Invalid request: "projectIdea" string is required',
    });
  }

  if (projectIdea.trim().length < 5) {
    return res.status(400).json({
      success: false,
      error: 'Project idea must be at least 5 characters long',
    });
  }

  next();
}

export function validateResourceCreation(req, res, next) {
  const { title, description, category, authorId } = req.body || {};

  if (!title || typeof title !== 'string' || title.trim().length < 3) {
    return res.status(400).json({
      success: false,
      error: 'Resource title must be at least 3 characters long',
    });
  }

  if (!description || typeof description !== 'string' || description.trim().length < 5) {
    return res.status(400).json({
      success: false,
      error: 'Resource description must be at least 5 characters long',
    });
  }

  if (!category || typeof category !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Category is required',
    });
  }

  if (!authorId || typeof authorId !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Author ID is required',
    });
  }

  next();
}

export function validatePeerReview(req, res, next) {
  const { reviewerId, recipientId, projectTitle, rating } = req.body || {};

  if (!reviewerId || !recipientId) {
    return res.status(400).json({
      success: false,
      error: 'Both reviewerId and recipientId are required',
    });
  }

  if (reviewerId === recipientId) {
    return res.status(400).json({
      success: false,
      error: 'Self-awarded peer reviews are forbidden',
    });
  }

  if (!projectTitle || typeof projectTitle !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Project title is required',
    });
  }

  const numRating = parseFloat(rating);
  if (isNaN(numRating) || numRating < 1 || numRating > 5) {
    return res.status(400).json({
      success: false,
      error: 'Rating must be a numeric value between 1.0 and 5.0',
    });
  }

  next();
}

export function validateCreditTransaction(req, res, next) {
  const { studentId, amount, type, idempotencyKey } = req.body || {};

  if (!studentId || typeof studentId !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Student ID is required',
    });
  }

  const numAmount = parseInt(amount, 10);
  if (isNaN(numAmount) || numAmount <= 0) {
    return res.status(400).json({
      success: false,
      error: 'Transaction amount must be a positive integer',
    });
  }

  if (!['EARN', 'SPEND'].includes(type)) {
    return res.status(400).json({
      success: false,
      error: 'Transaction type must be EARN or SPEND',
    });
  }

  if (!idempotencyKey || typeof idempotencyKey !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Idempotency key is required to prevent duplicate operations',
    });
  }

  next();
}
