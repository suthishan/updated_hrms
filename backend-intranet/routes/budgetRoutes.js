const express = require('express');
const { body } = require('express-validator');
const BudgetController = require('../controllers/budgetController');
// const { authenticate } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
// router.use(authenticate);

router.post(
    '/',
    [
        body('year').isInt({ min: 2000, max: 2100 }).withMessage('Valid year required (2000-2100)'),
        body('name').optional().isString().trim(),
    ],
    BudgetController.create
);

router.get('/', BudgetController.getAll);
router.get('/:year', BudgetController.getByYear);
router.get('/:year/monthly', BudgetController.getMonthlyData);
router.get('/:year/summaries', BudgetController.getAnnualSummaries);

module.exports = router;
