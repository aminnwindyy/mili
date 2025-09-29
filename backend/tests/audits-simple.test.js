const request = require('supertest');
const express = require('express');

// In-memory store
let auditLogs = [];

// Mock auth
const auth = (req, res, next) => { req.user = { id: '507f1f77bcf86cd799439012', role: 'admin' }; next(); };
const authorize = (...roles) => (req, res, next) => roles.includes(req.user.role) ? next() : res.status(403).json({ success: false });

// Simple routes
const app = express();
app.use(express.json());

app.get('/api/audits', auth, authorize('admin', 'manager'), (req, res) => {
  res.json({ success: true, data: auditLogs, pagination: { current_page: 1, total_pages: 1, total_items: auditLogs.length, items_per_page: auditLogs.length } });
});

app.get('/api/audits/stats', auth, authorize('admin', 'manager'), (req, res) => {
  const byAction = {}; const byStatus = {};
  auditLogs.forEach(l => { byAction[l.action] = (byAction[l.action] || 0) + 1; byStatus[l.status] = (byStatus[l.status] || 0) + 1; });
  res.json({ success: true, data: { byAction, byStatus, total: auditLogs.length } });
});

app.get('/api/audits/:id', auth, authorize('admin', 'manager'), (req, res) => {
  const log = auditLogs.find(l => l._id === req.params.id);
  if (!log) return res.status(404).json({ success: false, message: 'لاگ یافت نشد' });
  res.json({ success: true, data: log });
});

app.post('/api/audits', auth, authorize('admin', 'manager', 'analyst'), (req, res) => {
  const { action, resource } = req.body;
  if (!action || !resource) return res.status(400).json({ success: false, message: 'action و resource الزامی هستند' });
  const log = { _id: Date.now().toString(), user_id: req.user.id, action, resource, status: 'success', created_at: new Date() };
  auditLogs.unshift(log);
  res.status(201).json({ success: true, data: log });
});

app.delete('/api/audits/:id', auth, authorize('admin'), (req, res) => {
  const idx = auditLogs.findIndex(l => l._id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'لاگ یافت نشد' });
  auditLogs.splice(idx, 1);
  res.json({ success: true, message: 'لاگ حذف شد' });
});

describe('Audits API (Simple Mock)', () => {
  beforeEach(() => {
    auditLogs = [
      { _id: '1', user_id: 'u1', action: 'login', resource: 'auth', status: 'success', created_at: new Date() },
      { _id: '2', user_id: 'u2', action: 'create', resource: 'property', status: 'success', created_at: new Date() }
    ];
  });

  test('Should list audits', async () => {
    const res = await request(app).get('/api/audits');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('Should get audit stats', async () => {
    const res = await request(app).get('/api/audits/stats');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.total).toBeGreaterThan(0);
  });

  test('Should get single audit by id', async () => {
    const res = await request(app).get('/api/audits/1');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('Should create audit', async () => {
    const res = await request(app).post('/api/audits').send({ action: 'view', resource: 'investment' });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  test('Should delete audit', async () => {
    const res = await request(app).delete('/api/audits/2');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});



