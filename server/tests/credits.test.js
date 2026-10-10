import test from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/app.js';

test('GET /api/credits/balance/:studentId returns balance for existing student', async () => {
  const server = app.listen(0);
  const port = server.address().port;

  try {
    const res = await fetch(`http://127.0.0.1:${port}/api/credits/balance/stu-101`);
    assert.equal(res.status, 200);
    const json = await res.json();
    assert.equal(json.success, true);
    assert.ok(typeof json.data.balance === 'number');
  } finally {
    server.close();
  }
});

test('POST /api/credits/transaction rejects overspending and enforces idempotency', async () => {
  const server = app.listen(0);
  const port = server.address().port;

  try {
    // 1. Overspending rejection
    const overspendRes = await fetch(`http://127.0.0.1:${port}/api/credits/transaction`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: 'stu-101',
        amount: 999999,
        type: 'SPEND',
        idempotencyKey: `test-overspend-${Date.now()}`,
      }),
    });
    assert.equal(overspendRes.status, 422);

    // 2. Valid transaction and idempotency duplicate detection
    const uniqueKey = `test-earn-${Date.now()}`;
    const earnRes1 = await fetch(`http://127.0.0.1:${port}/api/credits/transaction`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: 'stu-101',
        amount: 10,
        type: 'EARN',
        category: 'TEST_REWARD',
        description: 'Test automated reward',
        idempotencyKey: uniqueKey,
      }),
    });
    assert.equal(earnRes1.status, 201);
    const json1 = await earnRes1.json();
    assert.equal(json1.isDuplicate, false);

    // Re-sending with the exact same idempotency key must not double-credit
    const earnRes2 = await fetch(`http://127.0.0.1:${port}/api/credits/transaction`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: 'stu-101',
        amount: 10,
        type: 'EARN',
        category: 'TEST_REWARD',
        description: 'Test automated reward',
        idempotencyKey: uniqueKey,
      }),
    });
    assert.equal(earnRes2.status, 200);
    const json2 = await earnRes2.json();
    assert.equal(json2.isDuplicate, true);
  } finally {
    server.close();
  }
});
