import test from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/app.js';

test('POST /api/reputation/review rejects self-awarded review', async () => {
  const server = app.listen(0);
  const port = server.address().port;

  try {
    const res = await fetch(`http://127.0.0.1:${port}/api/reputation/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reviewerId: 'stu-101',
        recipientId: 'stu-101',
        projectTitle: 'Self Project',
        rating: 5,
        comment: 'I am great',
      }),
    });

    assert.equal(res.status, 400);
    const json = await res.json();
    assert.equal(json.success, false);
    assert.ok(json.error.includes('Self-awarded peer reviews are forbidden'));
  } finally {
    server.close();
  }
});

test('POST /api/reputation/review successfully creates peer review and awards credits', async () => {
  const server = app.listen(0);
  const port = server.address().port;

  try {
    const res = await fetch(`http://127.0.0.1:${port}/api/reputation/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reviewerId: 'stu-102',
        recipientId: 'stu-103',
        projectTitle: 'Automated Review Test',
        rating: 4.9,
        comment: 'Outstanding UI prototyping work and attention to detail.',
        verifiedMilestone: 'Sprint 1 Verification',
      }),
    });

    assert.equal(res.status, 201);
    const json = await res.json();
    assert.equal(json.success, true);
    assert.equal(json.data.recipientId, 'stu-103');
    assert.ok(json.notice.includes('Campus Credits awarded'));
  } finally {
    server.close();
  }
});
