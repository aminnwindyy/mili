// Simple in-memory audit controller (can be swapped with DB later)

let auditLogs = [];
const bus = require('../realtime/eventBus');
const AuditLog = require('../models/AuditLog');
const USE_DB = process.env.AUDIT_USE_DB === 'true';

const listAudits = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      user_id,
      action,
      status,
      resource,
      date_from,
      date_to,
      search
    } = req.query;

    let results;
    if (USE_DB) {
      const query = {};
      if (user_id) query.user_id = user_id;
      if (action) query.action = action;
      if (status) query.status = status;
      if (resource) query.resource = resource;
      if (date_from || date_to) query.created_at = {};
      if (date_from) query.created_at.$gte = new Date(date_from);
      if (date_to) query.created_at.$lte = new Date(date_to);
      if (search) query.$or = [
        { message: { $regex: search, $options: 'i' } },
        { metadata: { $regex: search, $options: 'i' } }
      ];
      const pageNum = parseInt(page);
      const lim = parseInt(limit);
      results = await AuditLog.find(query)
        .sort({ created_at: -1 })
        .skip((pageNum - 1) * lim)
        .limit(lim)
        .lean();
      const total = await AuditLog.countDocuments(query);
      return res.json({ success: true, data: results, pagination: { current_page: pageNum, total_pages: Math.ceil(total / lim), total_items: total, items_per_page: lim } });
    } else {
      results = [...auditLogs];
    }

    if (user_id) results = results.filter(l => l.user_id === user_id);
    if (action) results = results.filter(l => l.action === action);
    if (status) results = results.filter(l => l.status === status);
    if (resource) results = results.filter(l => l.resource === resource);
    if (date_from) results = results.filter(l => new Date(l.created_at) >= new Date(date_from));
    if (date_to) results = results.filter(l => new Date(l.created_at) <= new Date(date_to));
    if (search) results = results.filter(l =>
      (l.message && l.message.includes(search)) ||
      (l.metadata && JSON.stringify(l.metadata).includes(search))
    );

    const total = results.length;
    const start = (parseInt(page) - 1) * parseInt(limit);
    const paged = results.slice(start, start + parseInt(limit));

    res.json({
      success: true,
      data: paged,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(total / parseInt(limit)),
        total_items: total,
        items_per_page: parseInt(limit)
      }
    });
  } catch (e) {
    res.status(500).json({ success: false, message: 'خطا در دریافت لاگ‌ها' });
  }
};

const getAuditStats = async (req, res) => {
  try {
    if (USE_DB) {
      const agg = await AuditLog.aggregate([
        { $group: { _id: null, total: { $sum: 1 } } }
      ]);
      const byActionArr = await AuditLog.aggregate([{ $group: { _id: '$action', count: { $sum: 1 } } }]);
      const byStatusArr = await AuditLog.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);
      const byAction = Object.fromEntries(byActionArr.map(i => [i._id, i.count]));
      const byStatus = Object.fromEntries(byStatusArr.map(i => [i._id, i.count]));
      const total = agg[0]?.total || 0;
      return res.json({ success: true, data: { byAction, byStatus, total } });
    } else {
      const byAction = {};
      const byStatus = {};
      auditLogs.forEach(l => {
        byAction[l.action] = (byAction[l.action] || 0) + 1;
        byStatus[l.status] = (byStatus[l.status] || 0) + 1;
      });
      res.json({ success: true, data: { byAction, byStatus, total: auditLogs.length } });
    }
  } catch (e) {
    res.status(500).json({ success: false, message: 'خطا در آمار لاگ‌ها' });
  }
};

const getAuditById = async (req, res) => {
  try {
    const log = auditLogs.find(l => l._id === req.params.id);
    if (!log) return res.status(404).json({ success: false, message: 'لاگ یافت نشد' });
    res.json({ success: true, data: log });
  } catch (e) {
    res.status(500).json({ success: false, message: 'خطا در دریافت لاگ' });
  }
};

const createAudit = async (req, res) => {
  try {
    const { action, resource, resource_id, status = 'success', message, metadata } = req.body;
    if (!action || !resource) {
      return res.status(400).json({ success: false, message: 'action و resource الزامی هستند' });
    }
    if (USE_DB) {
      const log = await AuditLog.create({
        user_id: req.user?.id || null,
        action,
        resource,
        resource_id: resource_id || null,
        status,
        message: message || '',
        metadata: metadata || {},
        ip: req.ip,
        user_agent: req.headers['user-agent'] || ''
      });
      try { bus.emit('audit', { log }); } catch {}
      return res.status(201).json({ success: true, data: log });
    } else {
      const log = {
        _id: Date.now().toString(),
        user_id: req.user?.id || 'anonymous',
        action,
        resource,
        resource_id: resource_id || null,
        status,
        message: message || '',
        metadata: metadata || {},
        ip: req.ip,
        user_agent: req.headers['user-agent'] || '',
        created_at: new Date()
      };
      auditLogs.unshift(log);
      try { bus.emit('audit', { log }); } catch {}
      return res.status(201).json({ success: true, data: log });
    }
  } catch (e) {
    res.status(500).json({ success: false, message: 'خطا در ایجاد لاگ' });
  }
};

const deleteAudit = async (req, res) => {
  try {
    if (USE_DB) {
      const deleted = await AuditLog.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ success: false, message: 'لاگ یافت نشد' });
      return res.json({ success: true, message: 'لاگ حذف شد' });
    } else {
      const idx = auditLogs.findIndex(l => l._id === req.params.id);
      if (idx === -1) return res.status(404).json({ success: false, message: 'لاگ یافت نشد' });
      auditLogs.splice(idx, 1);
      return res.json({ success: true, message: 'لاگ حذف شد' });
    }
  } catch (e) {
    res.status(500).json({ success: false, message: 'خطا در حذف لاگ' });
  }
};

// For testing convenience
const __resetAuditLogs = (seed = []) => {
  auditLogs.length = 0;
  seed.forEach(s => auditLogs.push(s));
};

module.exports = {
  listAudits,
  getAuditStats,
  getAuditById,
  createAudit,
  deleteAudit,
  __resetAuditLogs
};



