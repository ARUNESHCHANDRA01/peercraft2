import test from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/app.js';

test('GET /api/health should return 200 with operational status and services report', async () => {
  // Use http server or direct request simulation
  const server = app.listen(0);
  const port = server.address().port;

  try {
    const res = await fetch(`http://127.0.0.1:${port}/api/health`);
    assert.equal(res.status, 200);

    const data = await res.json();
    assert.equal(data.success, true);
    assert.equal(data.status, 'healthy');
    assert.ok(data.services.application);
    assert.ok(data.services.storage);
    assert.ok(data.services.dify);
    assert.equal(data.services.storage.status, 'operational');
  } finally {
    server.close();
  }
});
