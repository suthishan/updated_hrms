const express = require('express');
const { body } = require('express-validator');
const TransactionController = require('../controllers/transactionController');
// const { authenticate } = require('../middleware/auth');

const router = express.Router();

// router.use(authenticate);

router.post(
    '/',
    [
        body('accountId').isUUID().withMessage('Valid account ID required'),
        body('amount').isFloat().withMessage('Amount is required'),
        body('transactionDate').isISO8601().withMessage('Valid date required'),
        body('categoryId').optional().isUUID(),
        body('payee').optional().isString().trim(),
        body('memo').optional().isString().trim(),
        body('isIncome').optional().isBoolean(),
    ],
    TransactionController.create
);

router.put('/:id', TransactionController.update);
router.delete('/:id', TransactionController.delete);
router.get('/account/:accountId', TransactionController.getByAccount);
router.get('/category/:categoryId', TransactionController.getByCategory);

module.exports = router;
