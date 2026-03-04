'use strict';

/**
 * Role-Based Access Control (RBAC) Middleware
 * Usage: authorize('Audit Team', 'HoD')
 */
function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Forbidden: Requires role(s) — ${allowedRoles.join(', ')}`,
      });
    }
    next();
  };
}

/**
 * Observation-level access guard.
 * Responsible Persons can only access their assigned action items.
 */
function canAccessObservation(req, res, next) {
  const { user } = req;
  if (user.role === 'Audit Team' || user.role === 'HoD') return next();

  const { observations } = require('../data/mockData');
  const obs = observations.find((o) => o.id === req.params.id || o.observationId === req.params.id);
  if (!obs) return res.status(404).json({ message: 'Observation not found' });

  const hasAccess = obs.actionItems.some((ai) => ai.responsiblePersonId === user.id);
  if (!hasAccess) {
    return res.status(403).json({ message: 'Forbidden: Not assigned to this observation' });
  }
  req.observation = obs;
  next();
}

module.exports = { authorize, canAccessObservation };
