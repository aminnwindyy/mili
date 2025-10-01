// Request audit hook (lightweight)
const { createAudit } = require('../controllers/auditController');

// Wrap createAudit to use as middleware but without response writing
const auditRequest = (action, resource) => {
  return async (req, res, next) => {
    try {
      // Only log minimal info; do not alter response
      const body = {
        action,
        resource,
        resource_id: req.params?.id || null,
        status: 'success',
        message: `${action} ${resource}`,
        metadata: { path: req.path, method: req.method }
      };

      // Create audit entry via controller helper (simulate call)
      req.body = { ...req.body, ...body };
      // call createAudit but ignore its response writing by catching res methods
      const originalJson = res.json.bind(res);
      const originalStatus = res.status.bind(res);
      const originalSend = res.send.bind(res);
      // shadow response to no-op for this internal call
      res.json = () => res; // no-op
      res.status = () => res; // no-op
      res.send = () => res; // no-op
      await createAudit(req, res);
      // restore
      res.json = originalJson;
      res.status = originalStatus;
      res.send = originalSend;
    } catch (e) {
      // ignore audit failures
    } finally {
      next();
    }
  };
};

module.exports = { auditRequest };



