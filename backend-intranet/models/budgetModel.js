const { query, getClient } = require('../db/db');
const { DEFAULT_BUDGET_TEMPLATE } = require('../utils/helpers');

const BudgetModel = {
    /**
     * Create a new budget with default categories
     */
    create: async (userId, year, name = null) => {
        const client = await getClient();
        try {
            await client.query('BEGIN');

            // Create budget
            const budgetSql = `
                INSERT INTO budgets (user_id, year, name)
                VALUES ($1, $2, $3)
                RETURNING *`;
            const budgetResult = await client.query(budgetSql, [userId, year, name || `Budget ${year}`]);
            const budget = budgetResult.rows[0];

            // Create default category groups and categories
            for (const group of DEFAULT_BUDGET_TEMPLATE) {
                const groupSql = `
                    INSERT INTO category_groups (budget_id, name, sort_order)
                    VALUES ($1, $2, $3)
                    RETURNING id`;
                const groupResult = await client.query(groupSql, [budget.id, group.name, group.sort_order]);
                const groupId = groupResult.rows[0].id;

                for (const cat of group.categories) {
                    const catSql = `
                        INSERT INTO categories (category_group_id, name, sort_order)
                        VALUES ($1, $2, $3)`;
                    await client.query(catSql, [groupId, cat.name, cat.sort_order]);
                }
            }

            await client.query('COMMIT');
            return budget;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    },

    /**
     * Find budget by user and year
     */
    findByUserAndYear: async (userId, year) => {
        const sql = `SELECT * FROM budgets WHERE user_id = $1 AND year = $2 AND is_active = TRUE`;
        const result = await query(sql, [userId, year]);
        return result.rows[0] || null;
    },

    /**
     * Get all budgets for a user
     */
    findAllByUser: async (userId) => {
        const sql = `
            SELECT * FROM budgets
            WHERE user_id = $1 AND is_active = TRUE
            ORDER BY year DESC`;
        const result = await query(sql, [userId]);
        return result.rows;
    },

    /**
     * Get full budget data for a specific month range
     * Returns category groups, categories, budget entries, and computed outflows
     */
    getMonthlyData: async (budgetId, year, months) => {
        // Get category groups with categories
        const structureSql = `
            SELECT
                cg.id AS group_id,
                cg.name AS group_name,
                cg.sort_order AS group_sort,
                cg.is_hidden AS group_hidden,
                c.id AS category_id,
                c.name AS category_name,
                c.sort_order AS category_sort,
                c.note AS category_note
            FROM category_groups cg
            LEFT JOIN categories c ON c.category_group_id = cg.id AND c.is_hidden = FALSE
            WHERE cg.budget_id = $1 AND cg.is_hidden = FALSE
            ORDER BY cg.sort_order, c.sort_order`;
        const structureResult = await query(structureSql, [budgetId]);

        // Get budget entries for the requested months
        const entriesSql = `
            SELECT
                be.category_id,
                be.month,
                be.year,
                be.budgeted
            FROM budget_entries be
            INNER JOIN categories c ON c.id = be.category_id
            INNER JOIN category_groups cg ON cg.id = c.category_group_id
            WHERE cg.budget_id = $1
              AND be.year = $2
              AND be.month = ANY($3)`;
        const entriesResult = await query(entriesSql, [budgetId, year, months]);

        // Get outflows (sum of transactions) per category per month
        const outflowsSql = `
            SELECT
                t.category_id,
                EXTRACT(MONTH FROM t.transaction_date)::INT AS month,
                COALESCE(SUM(ABS(t.amount)), 0) AS outflows
            FROM transactions t
            INNER JOIN categories c ON c.id = t.category_id
            INNER JOIN category_groups cg ON cg.id = c.category_group_id
            WHERE cg.budget_id = $1
              AND EXTRACT(YEAR FROM t.transaction_date) = $2
              AND EXTRACT(MONTH FROM t.transaction_date) = ANY($3)
              AND t.is_income = FALSE
            GROUP BY t.category_id, EXTRACT(MONTH FROM t.transaction_date)`;
        const outflowsResult = await query(outflowsSql, [budgetId, year, months]);

        // Get income per month
        const incomeSql = `
            SELECT
                EXTRACT(MONTH FROM t.transaction_date)::INT AS month,
                COALESCE(SUM(t.amount), 0) AS income
            FROM transactions t
            INNER JOIN accounts a ON a.id = t.account_id
            WHERE a.user_id = (SELECT user_id FROM budgets WHERE id = $1)
              AND EXTRACT(YEAR FROM t.transaction_date) = $2
              AND EXTRACT(MONTH FROM t.transaction_date) = ANY($3)
              AND t.is_income = TRUE
            GROUP BY EXTRACT(MONTH FROM t.transaction_date)`;
        const incomeResult = await query(incomeSql, [budgetId, year, months]);

        return {
            structure: structureResult.rows,
            entries: entriesResult.rows,
            outflows: outflowsResult.rows,
            income: incomeResult.rows,
        };
    },

    /**
     * Get monthly summary (total budgeted, overspent, overbudgeted) across all months
     * Calculates rolling balance from prior months
     */
    getMonthlySummaries: async (budgetId, year) => {
        const sql = `
            WITH monthly_budgeted AS (
                SELECT
                    be.month,
                    COALESCE(SUM(be.budgeted), 0) AS total_budgeted
                FROM budget_entries be
                INNER JOIN categories c ON c.id = be.category_id
                INNER JOIN category_groups cg ON cg.id = c.category_group_id
                WHERE cg.budget_id = $1 AND be.year = $2
                GROUP BY be.month
            ),
            monthly_outflows AS (
                SELECT
                    EXTRACT(MONTH FROM t.transaction_date)::INT AS month,
                    COALESCE(SUM(ABS(t.amount)), 0) AS total_outflows
                FROM transactions t
                INNER JOIN categories c ON c.id = t.category_id
                INNER JOIN category_groups cg ON cg.id = c.category_group_id
                WHERE cg.budget_id = $1
                  AND EXTRACT(YEAR FROM t.transaction_date) = $2
                  AND t.is_income = FALSE
                GROUP BY EXTRACT(MONTH FROM t.transaction_date)
            ),
            monthly_income AS (
                SELECT
                    EXTRACT(MONTH FROM t.transaction_date)::INT AS month,
                    COALESCE(SUM(t.amount), 0) AS total_income
                FROM transactions t
                INNER JOIN accounts a ON a.id = t.account_id
                WHERE a.user_id = (SELECT user_id FROM budgets WHERE id = $1)
                  AND EXTRACT(YEAR FROM t.transaction_date) = $2
                  AND t.is_income = TRUE
                GROUP BY EXTRACT(MONTH FROM t.transaction_date)
            ),
            months AS (
                SELECT generate_series(1, 12) AS month
            )
            SELECT
                m.month,
                COALESCE(mb.total_budgeted, 0) AS budgeted,
                COALESCE(mo.total_outflows, 0) AS outflows,
                COALESCE(mi.total_income, 0) AS income
            FROM months m
            LEFT JOIN monthly_budgeted mb ON mb.month = m.month
            LEFT JOIN monthly_outflows mo ON mo.month = m.month
            LEFT JOIN monthly_income mi ON mi.month = m.month
            ORDER BY m.month`;
        const result = await query(sql, [budgetId, year]);
        return result.rows;
    },
};

module.exports = BudgetModel;
