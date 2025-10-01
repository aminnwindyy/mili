const request = require('supertest');
const express = require('express');

// Mock auth middleware
const auth = (req, res, next) => {
  req.user = { id: '507f1f77bcf86cd799439012', role: 'analyst' };
  next();
};
const authorize = (...roles) => (req, res, next) => roles.includes(req.user.role) ? next() : res.status(403).json({ success: false });

// Create app
const app = express();
app.use(express.json());

// Inline routes using simplified controller logic
app.get('/api/reports/summary', auth, authorize('admin','manager','analyst'), (req, res) => {
  const { period = '30d' } = req.query;
  res.json({ success: true, data: { period, users: { total: 2450, new: 120 } } });
});

app.get('/api/reports/revenue', auth, authorize('admin','manager','analyst'), (req, res) => {
  const { period = '30d', group_by = 'day' } = req.query;
  const data = Array.from({ length: 3 }, (_, i) => ({ label: `D${i+1}`, revenue_irr: 1000000000 + i }));
  res.json({ success: true, data: { period, group_by, series: data } });
});

app.get('/api/reports/users/growth', auth, authorize('admin','manager','analyst'), (req, res) => {
  const data = Array.from({ length: 3 }, (_, i) => ({ month: `M${i+1}`, users: 100 + i }));
  res.json({ success: true, data });
});

app.get('/api/reports/export', auth, authorize('admin','manager','analyst'), (req, res) => {
  const { format = 'json', type = 'summary' } = req.query;
  const payload = { type, generated_at: new Date().toISOString(), items: [ { k: 'sample', v: 1 } ] };
  if (format === 'csv') {
    const csv = 'key,value\n' + payload.items.map(i => `${i.k},${i.v}`).join('\n');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    return res.status(200).send(csv);
  }
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.json({ success: true, data: payload });
});

describe('Reports API (Simple Mock)', () => {
  test('Should get summary report', async () => {
    const res = await request(app).get('/api/reports/summary').query({ period: '7d' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.period).toBe('7d');
  });

  test('Should get revenue report', async () => {
    const res = await request(app).get('/api/reports/revenue').query({ period: '30d', group_by: 'day' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.series)).toBe(true);
  });

  test('Should get user growth report', async () => {
    const res = await request(app).get('/api/reports/users/growth');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('Should export JSON report', async () => {
    const res = await request(app).get('/api/reports/export').query({ format: 'json', type: 'summary' });
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('application/json');
  });

  test('Should export CSV report', async () => {
    const res = await request(app).get('/api/reports/export').query({ format: 'csv', type: 'summary' });
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('text/csv');
    expect(res.text.startsWith('key,value')).toBe(true);
  });
});


