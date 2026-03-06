const express = require('express');
const { body } = require('express-validator');
const AccountController = require('../controllers/accountController');
// const { authenticate } = require('../middleware/auth');

const router = express.Router();

// router.use(authenticate);

router.post(
    '/',
    [
        body('name').trim().notEmpty().withMessage('Account name is required'),
        body('accountType').optional().isIn(['checking', 'savings', 'credit_card', 'cash', 'investment']),
        body('balance').optional().isFloat(),
        body('isOnBudget').optional().isBoolean(),
    ],
    AccountController.create
);

router.get('/', AccountController.getAll);
router.put('/:id', AccountController.update);

module.exports = router;
