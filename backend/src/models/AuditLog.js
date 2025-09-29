const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: { type: String, required: true },
  resource: { type: String, required: true },
  resource_id: { type: String },
  status: { type: String, enum: ['success', 'failed'], default: 'success' },
  message: { type: String },
  metadata: { type: mongoose.Schema.Types.Mixed },
  ip: { type: String },
  user_agent: { type: String }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

auditLogSchema.index({ action: 1, resource: 1, created_at: -1 });

module.exports = mongoose.models.AuditLog || mongoose.model('AuditLog', auditLogSchema);


