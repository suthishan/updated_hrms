const { validationResult } = require('express-validator');
const TransactionModel = require('../models/transactionModel');
const AccountModel = require('../models/accountModel');
const { apiResponse } = require('../utils/helpers');
const logger = require('../utils/logger');

const TransactionController = {
    /**
     * POST /api/transactions
     */
    create: async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return apiResponse(res, 400, false, 'Validation failed', errors.array());
            }

            const { accountId, categoryId, payee, memo, amount, transactionDate, isIncome } = req.body;

            // Verify account ownership
            const owns = await AccountModel.verifyOwnership(accountId, req.user.id);
            if (!owns) {
                return apiResponse(res, 403, false, 'Account does not belong to this user.');
            }

            const transaction = await TransactionModel.create({
                accountId,
                categoryId,
                payee,
                memo,
                amount: isIncome ? Math.abs(amount) : -Math.abs(amount),
                transactionDate,
                isIncome,
            });

            // Update account balance
            const balanceChange = isIncome ? Math.abs(amount) : -Math.abs(amount);
            await AccountModel.updateBalance(accountId, balanceChange);

            logger.info(`Transaction created: ${transaction.id}`);
            return apiResponse(res, 201, true, 'Transaction created.', transaction);
        } catch (error) {
            next(error);
        }
    },

    /**
     * PUT /api/transactions/:id
     */
    update: async (req, res, next) => {
        try {
            const { id } = req.params;
            const existing = await TransactionModel.findById(id);
            if (!existing) {
                return apiResponse(res, 404, false, 'Transaction not found.');
            }

            const owns = await AccountModel.verifyOwnership(existing.account_id, req.user.id);
            if (!owns) {
                return apiResponse(res, 403, false, 'Not authorized to modify this transaction.');
            }

            const transaction = await TransactionModel.update(id, req.body);
            return apiResponse(res, 200, true, 'Transaction updated.', transaction);
        } catch (error) {
            next(error);
        }
    },

    /**
     * DELETE /api/transactions/:id
     */
    delete: async (req, res, next) => {
        try {
            const { id } = req.params;
            const existing = await TransactionModel.findById(id);
            if (!existing) {
                return apiResponse(res, 404, false, 'Transaction not found.');
            }

            const owns = await AccountModel.verifyOwnership(existing.account_id, req.user.id);
            if (!owns) {
                return apiResponse(res, 403, false, 'Not authorized to delete this transaction.');
            }

            // Reverse balance change
            const reversal = existing.is_income ? -Math.abs(existing.amount) : Math.abs(existing.amount);
            await AccountModel.updateBalance(existing.account_id, reversal);

            await TransactionModel.delete(id);
            logger.info(`Transaction deleted: ${id}`);
            return apiResponse(res, 200, true, 'Transaction deleted.');
        } catch (error) {
            next(error);
        }
    },

    /**
     * GET /api/transactions/account/:accountId
     */
    getByAccount: async (req, res, next) => {
        try {
            const { accountId } = req.params;
            const owns = await AccountModel.verifyOwnership(accountId, req.user.id);
            if (!owns) {
                return apiResponse(res, 403, false, 'Account does not belong to this user.');
            }

            const { limit, offset, startDate, endDate } = req.query;
            const transactions = await TransactionModel.getByAccount(accountId, {
                limit: parseInt(limit, 10) || 50,
                offset: parseInt(offset, 10) || 0,
                startDate,
                endDate,
            });

            return apiResponse(res, 200, true, 'Transactions retrieved.', transactions);
        } catch (error) {
            next(error);
        }
    },

    /**
     * GET /api/transactions/category/:categoryId?month=9&year=2025
     */
    getByCategory: async (req, res, next) => {
        try {
            const { categoryId } = req.params;
            const month = parseInt(req.query.month, 10);
            const year = parseInt(req.query.year, 10);

            if (!month || !year) {
                return apiResponse(res, 400, false, 'month and year query parameters required.');
            }

            const transactions = await TransactionModel.getByCategory(categoryId, month, year);
            return apiResponse(res, 200, true, 'Transactions retrieved.', transactions);
        } catch (error) {
            next(error);
        }
    },
};

module.exports = TransactionController;
