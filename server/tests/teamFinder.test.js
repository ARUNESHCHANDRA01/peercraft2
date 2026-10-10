import test from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/app.js';

test('POST /api/team-finder should reject empty or short project ideas', async () => {
  const server = app.listen(0);
  const port = server.address().port;

  try {
    const res = await fetch(`http://127.0.0.1:${port}/api/team-finder`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectIdea: 'abc' }),
    });

    assert.equal(res.status, 400);
    const json = await res.json();
    assert.equal(json.success, false);
    assert.ok(json.error.includes('at least 5 characters'));
  } finally {
    server.close();
  }
});

test('POST /api/team-finder should return ranked teammate matches with transparent scoring', async () => {
  const server = app.listen(0);
  const port = server.address().port;

  try {
    const res = await fetch(`http://127.0.0.1:${port}/api/team-finder`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectIdea: 'A full-stack collaborative learning portal using React and Node.js with high reliability.',
        requiredSkills: ['React', 'Node.js', 'PostgreSQL'],
        preferredRoles: ['Full-stack Developer'],
        availability: 'Weekends',
      }),
    });

    assert.equal(res.status, 200);
    const json = await res.json();
    assert.equal(json.success, true);
    assert.ok(json.data.projectSummary);
    assert.ok(Array.isArray(json.data.matches));
    assert.ok(json.data.matches.length > 0);

    const firstMatch = json.data.matches[0];
    assert.ok(firstMatch.studentId);
    assert.ok(firstMatch.name);
    assert.ok(typeof firstMatch.matchScore === 'number');
    assert.ok(firstMatch.matchScore > 50);
    assert.ok(Array.isArray(firstMatch.reasons));
    assert.ok(firstMatch.reasons.length > 0);
    assert.ok(json.data.meta);
    assert.ok(json.data.meta.source);
  } finally {
    server.close();
  }
});
