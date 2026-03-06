const { validationResult } = require('express-validator');
const AccountModel = require('../models/accountModel');
const { apiResponse } = require('../utils/helpers');

const AccountController = {
    create: async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return apiResponse(res, 400, false, 'Validation failed', errors.array());
            }

            const { name, accountType, balance, isOnBudget } = req.body;
            const account = await AccountModel.create({
                userId: req.user.id,
                name,
                accountType,
                balance,
                isOnBudget,
            });

            return apiResponse(res, 201, true, 'Account created.', account);
        } catch (error) {
            next(error);
        }
    },

    getAll: async (req, res, next) => {
        try {
            const accounts = await AccountModel.getByUser(req.user.id);
            return apiResponse(res, 200, true, 'Accounts retrieved.', accounts);
        } catch (error) {
            next(error);
        }
    },

    update: async (req, res, next) => {
        try {
            const { id } = req.params;
            const owns = await AccountModel.verifyOwnership(id, req.user.id);
            if (!owns) {
                return apiResponse(res, 403, false, 'Account does not belong to this user.');
            }

            const account = await AccountModel.update(id, req.body);
            return apiResponse(res, 200, true, 'Account updated.', account);
        } catch (error) {
            next(error);
        }
    },
};

module.exports = AccountController;
