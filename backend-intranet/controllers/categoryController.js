const { validationResult } = require('express-validator');
const CategoryModel = require('../models/categoryModel');
const BudgetModel = require('../models/budgetModel');
const { apiResponse } = require('../utils/helpers');
const logger = require('../utils/logger');

const CategoryController = {
    // ==================== CATEGORY GROUPS ====================

    /**
     * POST /api/budgets/:year/groups
     */
    createGroup: async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return apiResponse(res, 400, false, 'Validation failed', errors.array());
            }

            const year = parseInt(req.params.year, 10);
            const budget = await BudgetModel.findByUserAndYear(req.user.id, year);
            if (!budget) {
                return apiResponse(res, 404, false, `No budget found for year ${year}.`);
            }

            const { name, sortOrder } = req.body;
            const group = await CategoryModel.createGroup(budget.id, name, sortOrder);

            logger.info(`Category group created: ${name} in budget ${budget.id}`);
            return apiResponse(res, 201, true, 'Category group created.', group);
        } catch (error) {
            next(error);
        }
    },

    /**
     * PUT /api/budgets/:year/groups/:groupId
     */
    updateGroup: async (req, res, next) => {
        try {
            const { groupId } = req.params;
            const year = parseInt(req.params.year, 10);
            const budget = await BudgetModel.findByUserAndYear(req.user.id, year);
            if (!budget) {
                return apiResponse(res, 404, false, `No budget found for year ${year}.`);
            }

            const owns = await CategoryModel.verifyGroupOwnership(groupId, budget.id);
            if (!owns) {
                return apiResponse(res, 403, false, 'Category group does not belong to this budget.');
            }

            const group = await CategoryModel.updateGroup(groupId, req.body);
            return apiResponse(res, 200, true, 'Category group updated.', group);
        } catch (error) {
            next(error);
        }
    },

    /**
     * DELETE /api/budgets/:year/groups/:groupId
     */
    deleteGroup: async (req, res, next) => {
        try {
            const { groupId } = req.params;
            const year = parseInt(req.params.year, 10);
            const budget = await BudgetModel.findByUserAndYear(req.user.id, year);
            if (!budget) {
                return apiResponse(res, 404, false, `No budget found for year ${year}.`);
            }

            const owns = await CategoryModel.verifyGroupOwnership(groupId, budget.id);
            if (!owns) {
                return apiResponse(res, 403, false, 'Category group does not belong to this budget.');
            }

            await CategoryModel.deleteGroup(groupId);
            logger.info(`Category group deleted: ${groupId}`);
            return apiResponse(res, 200, true, 'Category group deleted.');
        } catch (error) {
            next(error);
        }
    },

    /**
     * PUT /api/budgets/:year/groups/reorder
     */
    reorderGroups: async (req, res, next) => {
        try {
            const { orderedIds } = req.body;
            if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
                return apiResponse(res, 400, false, 'orderedIds must be a non-empty array.');
            }
            await CategoryModel.reorderGroups(orderedIds);
            return apiResponse(res, 200, true, 'Category groups reordered.');
        } catch (error) {
            next(error);
        }
    },

    // ==================== CATEGORIES ====================

    /**
     * POST /api/budgets/:year/groups/:groupId/categories
     */
    createCategory: async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return apiResponse(res, 400, false, 'Validation failed', errors.array());
            }

            const { groupId } = req.params;
            const year = parseInt(req.params.year, 10);
            const budget = await BudgetModel.findByUserAndYear(req.user.id, year);
            if (!budget) {
                return apiResponse(res, 404, false, `No budget found for year ${year}.`);
            }

            const owns = await CategoryModel.verifyGroupOwnership(groupId, budget.id);
            if (!owns) {
                return apiResponse(res, 403, false, 'Category group does not belong to this budget.');
            }

            const { name, sortOrder } = req.body;
            const category = await CategoryModel.createCategory(groupId, name, sortOrder);

            logger.info(`Category created: ${name} in group ${groupId}`);
            return apiResponse(res, 201, true, 'Category created.', category);
        } catch (error) {
            next(error);
        }
    },

    /**
     * PUT /api/budgets/:year/categories/:categoryId
     */
    updateCategory: async (req, res, next) => {
        try {
            const { categoryId } = req.params;
            const year = parseInt(req.params.year, 10);
            const budget = await BudgetModel.findByUserAndYear(req.user.id, year);
            if (!budget) {
                return apiResponse(res, 404, false, `No budget found for year ${year}.`);
            }

            const owns = await CategoryModel.verifyCategoryOwnership(categoryId, budget.id);
            if (!owns) {
                return apiResponse(res, 403, false, 'Category does not belong to this budget.');
            }

            const category = await CategoryModel.updateCategory(categoryId, req.body);
            return apiResponse(res, 200, true, 'Category updated.', category);
        } catch (error) {
            next(error);
        }
    },

    /**
     * DELETE /api/budgets/:year/categories/:categoryId
     */
    deleteCategory: async (req, res, next) => {
        try {
            const { categoryId } = req.params;
            const year = parseInt(req.params.year, 10);
            const budget = await BudgetModel.findByUserAndYear(req.user.id, year);
            if (!budget) {
                return apiResponse(res, 404, false, `No budget found for year ${year}.`);
            }

            const owns = await CategoryModel.verifyCategoryOwnership(categoryId, budget.id);
            if (!owns) {
                return apiResponse(res, 403, false, 'Category does not belong to this budget.');
            }

            await CategoryModel.deleteCategory(categoryId);
            logger.info(`Category deleted: ${categoryId}`);
            return apiResponse(res, 200, true, 'Category deleted.');
        } catch (error) {
            next(error);
        }
    },

    // ==================== BUDGET ENTRIES ====================

    /**
     * PUT /api/budgets/:year/categories/:categoryId/budget
     * Set budget amount for a category in a specific month
     */
    setBudgetEntry: async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return apiResponse(res, 400, false, 'Validation failed', errors.array());
            }

            const { categoryId } = req.params;
            const year = parseInt(req.params.year, 10);
            const { month, budgeted } = req.body;

            const budget = await BudgetModel.findByUserAndYear(req.user.id, year);
            if (!budget) {
                return apiResponse(res, 404, false, `No budget found for year ${year}.`);
            }

            const owns = await CategoryModel.verifyCategoryOwnership(categoryId, budget.id);
            if (!owns) {
                return apiResponse(res, 403, false, 'Category does not belong to this budget.');
            }

            const entry = await CategoryModel.setBudgetEntry(categoryId, month, year, budgeted);
            return apiResponse(res, 200, true, 'Budget entry updated.', entry);
        } catch (error) {
            next(error);
        }
    },

    /**
     * PUT /api/budgets/:year/entries/bulk
     * Bulk update budget entries
     */
    bulkSetBudgetEntries: async (req, res, next) => {
        try {
            const { entries } = req.body;
            if (!Array.isArray(entries) || entries.length === 0) {
                return apiResponse(res, 400, false, 'entries must be a non-empty array.');
            }

            const results = await CategoryModel.bulkSetBudgetEntries(entries);
            return apiResponse(res, 200, true, `${results.length} budget entries updated.`, results);
        } catch (error) {
            next(error);
        }
    },
};

module.exports = CategoryController;
