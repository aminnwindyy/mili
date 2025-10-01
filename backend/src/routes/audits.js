const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const { listAudits, getAuditStats, getAuditById, createAudit, deleteAudit } = require('../controllers/auditController');
const bus = require('../realtime/eventBus');

// Admin/manager can list and see stats
router.get('/', auth, authorize('admin', 'manager'), listAudits);
router.get('/stats', auth, authorize('admin', 'manager'), getAuditStats);
router.get('/:id', auth, authorize('admin', 'manager'), getAuditById);

// Analysts can create audits (or any authenticated action maker)
router.post('/', auth, authorize('admin', 'manager', 'analyst'), createAudit);

// Only admin can delete
router.delete('/:id', auth, authorize('admin'), deleteAudit);

// SSE for audit stream (admin/manager)
router.get('/stream', auth, authorize('admin', 'manager'), (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  const sendEvent = (event) => {
    if (event?.event !== 'audit') return;
    res.write(`data: ${JSON.stringify(event)}\n\n`);
  };

  const handler = (payload) => sendEvent({ event: 'audit', ...payload });
  bus.on('audit', handler);

  req.on('close', () => {
    bus.off('audit', handler);
  });
});

module.exports = router;



