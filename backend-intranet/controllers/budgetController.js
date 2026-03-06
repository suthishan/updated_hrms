const { validationResult } = require('express-validator');
const BudgetModel = require('../models/budgetModel');
const { apiResponse, getMonthName } = require('../utils/helpers');
const logger = require('../utils/logger');

const BudgetController = {
    /**
     * POST /api/budgets
     * Create a new budget for a year
     */
    create: async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return apiResponse(res, 400, false, 'Validation failed', errors.array());
            }

            const { year, name } = req.body;
            const userId = req.user.id;

            // Check if budget already exists for this year
            const existing = await BudgetModel.findByUserAndYear(userId, year);
            if (existing) {
                return apiResponse(res, 409, false, `Budget for year ${year} already exists.`);
            }

            const budget = await BudgetModel.create(userId, year, name);
            logger.info(`Budget created for user ${userId}, year ${year}`);

            return apiResponse(res, 201, true, 'Budget created with default categories.', budget);
        } catch (error) {
            next(error);
        }
    },

    /**
     * GET /api/budgets
     * Get all budgets for the authenticated user
     */
    getAll: async (req, res, next) => {
        try {
            const budgets = await BudgetModel.findAllByUser(req.user.id);
            return apiResponse(res, 200, true, 'Budgets retrieved.', budgets);
        } catch (error) {
            next(error);
        }
    },

    /**
     * GET /api/budgets/:year
     * Get budget for a specific year
     */
    getByYear: async (req, res, next) => {
        try {
            const year = parseInt(req.params.year, 10);
            if (isNaN(year)) {
                return apiResponse(res, 400, false, 'Invalid year parameter.');
            }

            const budget = await BudgetModel.findByUserAndYear(req.user.id, year);
            if (!budget) {
                return apiResponse(res, 404, false, `No budget found for year ${year}.`);
            }

            return apiResponse(res, 200, true, 'Budget retrieved.', budget);
        } catch (error) {
            next(error);
        }
    },

    /**
     * GET /api/budgets/:year/monthly?months=9,10,11
     * Get detailed monthly budget data for specific months
     * This is the MAIN endpoint that powers the budget grid UI
     */
    getMonthlyData: async (req, res, next) => {
        try {
            const year = parseInt(req.params.year, 10);
            if (isNaN(year)) {
                return apiResponse(res, 400, false, 'Invalid year parameter.');
            }

            // Parse months from query string (e.g., ?months=9,10,11)
            const monthsParam = req.query.months;
            let months;
            if (monthsParam) {
                months = monthsParam.split(',').map((m) => parseInt(m.trim(), 10));
                const invalid = months.some((m) => isNaN(m) || m < 1 || m > 12);
                if (invalid) {
                    return apiResponse(res, 400, false, 'Invalid month values. Must be 1-12.');
                }
            } else {
                // Default: current month and next 2
                const currentMonth = new Date().getMonth() + 1;
                months = [currentMonth, currentMonth + 1, currentMonth + 2].map(
                    (m) => ((m - 1) % 12) + 1
                );
            }

            const budget = await BudgetModel.findByUserAndYear(req.user.id, year);
            if (!budget) {
                return apiResponse(res, 404, false, `No budget found for year ${year}.`);
            }

            const rawData = await BudgetModel.getMonthlyData(budget.id, year, months);

            // Transform raw data into structured response
            const categoryGroupsMap = new Map();

            for (const row of rawData.structure) {
                if (!categoryGroupsMap.has(row.group_id)) {
                    categoryGroupsMap.set(row.group_id, {
                        id: row.group_id,
                        name: row.group_name,
                        sortOrder: row.group_sort,
                        categories: [],
                    });
                }
                if (row.category_id) {
                    categoryGroupsMap.get(row.group_id).categories.push({
                        id: row.category_id,
                        name: row.category_name,
                        sortOrder: row.category_sort,
                        note: row.category_note,
                        months: {},
                    });
                }
            }

            // Map budget entries to categories
            const entriesMap = new Map();
            for (const entry of rawData.entries) {
                const key = `${entry.category_id}_${entry.month}`;
                entriesMap.set(key, parseFloat(entry.budgeted));
            }

            // Map outflows to categories
            const outflowsMap = new Map();
            for (const outflow of rawData.outflows) {
                const key = `${outflow.category_id}_${outflow.month}`;
                outflowsMap.set(key, parseFloat(outflow.outflows));
            }

            // Map income by month
            const incomeMap = new Map();
            for (const inc of rawData.income) {
                incomeMap.set(inc.month, parseFloat(inc.income));
            }

            // Build month data for each category
            for (const group of categoryGroupsMap.values()) {
                for (const category of group.categories) {
                    for (const month of months) {
                        const entryKey = `${category.id}_${month}`;
                        const budgeted = entriesMap.get(entryKey) || 0;
                        const outflows = outflowsMap.get(entryKey) || 0;
                        const balance = budgeted - outflows;

                        category.months[month] = {
                            budgeted,
                            outflows,
                            balance,
                        };
                    }
                }
            }

            // Build month summaries
            const monthSummaries = {};
            for (const month of months) {
                let totalBudgeted = 0;
                let totalOutflows = 0;

                for (const group of categoryGroupsMap.values()) {
                    for (const category of group.categories) {
                        const data = category.months[month];
                        if (data) {
                            totalBudgeted += data.budgeted;
                            totalOutflows += data.outflows;
                        }
                    }
                }

                const income = incomeMap.get(month) || 0;
                const totalBalance = totalBudgeted - totalOutflows;

                monthSummaries[month] = {
                    month,
                    monthName: getMonthName(month),
                    year,
                    income,
                    budgeted: totalBudgeted,
                    outflows: totalOutflows,
                    balance: totalBalance,
                    overbudgeted: income - totalBudgeted,
                };
            }

            const responseData = {
                budgetId: budget.id,
                year,
                months,
                monthSummaries,
                categoryGroups: Array.from(categoryGroupsMap.values()),
            };

            return apiResponse(res, 200, true, 'Monthly budget data retrieved.', responseData);
        } catch (error) {
            next(error);
        }
    },

    /**
     * GET /api/budgets/:year/summaries
     * Get annual summary data for all 12 months
     */
    getAnnualSummaries: async (req, res, next) => {
        try {
            const year = parseInt(req.params.year, 10);
            if (isNaN(year)) {
                return apiResponse(res, 400, false, 'Invalid year parameter.');
            }

            const budget = await BudgetModel.findByUserAndYear(req.user.id, year);
            if (!budget) {
                return apiResponse(res, 404, false, `No budget found for year ${year}.`);
            }

            const summaries = await BudgetModel.getMonthlySummaries(budget.id, year);

            // Calculate rolling balance
            let rollingBalance = 0;
            const enrichedSummaries = summaries.map((s) => {
                const budgeted = parseFloat(s.budgeted);
                const outflows = parseFloat(s.outflows);
                const income = parseFloat(s.income);
                const overbudgeted = income - budgeted + rollingBalance;
                const overspent = Math.min(0, budgeted - outflows);

                rollingBalance = overbudgeted;

                return {
                    month: s.month,
                    monthName: getMonthName(s.month),
                    budgeted,
                    outflows,
                    income,
                    overbudgeted,
                    overspent,
                    balance: budgeted - outflows,
                };
            });

            return apiResponse(res, 200, true, 'Annual summaries retrieved.', {
                year,
                summaries: enrichedSummaries,
            });
        } catch (error) {
            next(error);
        }
    },
};

module.exports = BudgetController;
