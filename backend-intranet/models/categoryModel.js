const { query, getClient } = require('../db/db');

const CategoryModel = {
    // ==================== CATEGORY GROUPS ====================

    /**
     * Create a new category group
     */
    createGroup: async (budgetId, name, sortOrder = 0) => {
        const sql = `
            INSERT INTO category_groups (budget_id, name, sort_order)
            VALUES ($1, $2, $3)
            RETURNING *`;
        const result = await query(sql, [budgetId, name, sortOrder]);
        return result.rows[0];
    },

    /**
     * Update a category group
     */
    updateGroup: async (groupId, { name, sortOrder, isHidden }) => {
        const sql = `
            UPDATE category_groups
            SET name = COALESCE($2, name),
                sort_order = COALESCE($3, sort_order),
                is_hidden = COALESCE($4, is_hidden)
            WHERE id = $1
            RETURNING *`;
        const result = await query(sql, [groupId, name, sortOrder, isHidden]);
        return result.rows[0];
    },

    /**
     * Delete a category group (cascades to categories and entries)
     */
    deleteGroup: async (groupId) => {
        const sql = `DELETE FROM category_groups WHERE id = $1 RETURNING id`;
        const result = await query(sql, [groupId]);
        return result.rows[0];
    },

    /**
     * Get all groups for a budget
     */
    getGroupsByBudget: async (budgetId) => {
        const sql = `
            SELECT * FROM category_groups
            WHERE budget_id = $1 AND is_hidden = FALSE
            ORDER BY sort_order`;
        const result = await query(sql, [budgetId]);
        return result.rows;
    },

    /**
     * Verify group belongs to budget
     */
    verifyGroupOwnership: async (groupId, budgetId) => {
        const sql = `SELECT id FROM category_groups WHERE id = $1 AND budget_id = $2`;
        const result = await query(sql, [groupId, budgetId]);
        return result.rows.length > 0;
    },

    // ==================== CATEGORIES ====================

    /**
     * Create a new category under a group
     */
    createCategory: async (categoryGroupId, name, sortOrder = 0) => {
        const sql = `
            INSERT INTO categories (category_group_id, name, sort_order)
            VALUES ($1, $2, $3)
            RETURNING *`;
        const result = await query(sql, [categoryGroupId, name, sortOrder]);
        return result.rows[0];
    },

    /**
     * Update a category
     */
    updateCategory: async (categoryId, { name, sortOrder, note, isHidden }) => {
        const sql = `
            UPDATE categories
            SET name = COALESCE($2, name),
                sort_order = COALESCE($3, sort_order),
                note = COALESCE($4, note),
                is_hidden = COALESCE($5, is_hidden)
            WHERE id = $1
            RETURNING *`;
        const result = await query(sql, [categoryId, name, sortOrder, note, isHidden]);
        return result.rows[0];
    },

    /**
     * Delete a category
     */
    deleteCategory: async (categoryId) => {
        const sql = `DELETE FROM categories WHERE id = $1 RETURNING id`;
        const result = await query(sql, [categoryId]);
        return result.rows[0];
    },

    /**
     * Move category to a different group
     */
    moveCategory: async (categoryId, newGroupId) => {
        const sql = `
            UPDATE categories SET category_group_id = $2 WHERE id = $1
            RETURNING *`;
        const result = await query(sql, [categoryId, newGroupId]);
        return result.rows[0];
    },

    /**
     * Get categories by group
     */
    getCategoriesByGroup: async (groupId) => {
        const sql = `
            SELECT * FROM categories
            WHERE category_group_id = $1 AND is_hidden = FALSE
            ORDER BY sort_order`;
        const result = await query(sql, [groupId]);
        return result.rows;
    },

    /**
     * Verify category belongs to a budget (through group)
     */
    verifyCategoryOwnership: async (categoryId, budgetId) => {
        const sql = `
            SELECT c.id FROM categories c
            INNER JOIN category_groups cg ON cg.id = c.category_group_id
            WHERE c.id = $1 AND cg.budget_id = $2`;
        const result = await query(sql, [categoryId, budgetId]);
        return result.rows.length > 0;
    },

    // ==================== BUDGET ENTRIES ====================

    /**
     * Set/update budget amount for a category in a specific month
     * Uses UPSERT (INSERT ON CONFLICT UPDATE)
     */
    setBudgetEntry: async (categoryId, month, year, budgeted) => {
        const sql = `
            INSERT INTO budget_entries (category_id, month, year, budgeted)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (category_id, month, year)
            DO UPDATE SET budgeted = $4
            RETURNING *`;
        const result = await query(sql, [categoryId, month, year, budgeted]);
        return result.rows[0];
    },

    /**
     * Bulk update budget entries
     */
    bulkSetBudgetEntries: async (entries) => {
        const client = await getClient();
        try {
            await client.query('BEGIN');
            const results = [];

            for (const entry of entries) {
                const sql = `
                    INSERT INTO budget_entries (category_id, month, year, budgeted)
                    VALUES ($1, $2, $3, $4)
                    ON CONFLICT (category_id, month, year)
                    DO UPDATE SET budgeted = $4
                    RETURNING *`;
                const result = await client.query(sql, [
                    entry.categoryId,
                    entry.month,
                    entry.year,
                    entry.budgeted,
                ]);
                results.push(result.rows[0]);
            }

            await client.query('COMMIT');
            return results;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    },

    /**
     * Get budget entry for a specific category/month
     */
    getBudgetEntry: async (categoryId, month, year) => {
        const sql = `
            SELECT * FROM budget_entries
            WHERE category_id = $1 AND month = $2 AND year = $3`;
        const result = await query(sql, [categoryId, month, year]);
        return result.rows[0] || null;
    },

    /**
     * Reorder categories within a group
     */
    reorderCategories: async (orderedIds) => {
        const client = await getClient();
        try {
            await client.query('BEGIN');
            for (let i = 0; i < orderedIds.length; i++) {
                await client.query(
                    `UPDATE categories SET sort_order = $1 WHERE id = $2`,
                    [i + 1, orderedIds[i]]
                );
            }
            await client.query('COMMIT');
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    },

    /**
     * Reorder category groups within a budget
     */
    reorderGroups: async (orderedIds) => {
        const client = await getClient();
        try {
            await client.query('BEGIN');
            for (let i = 0; i < orderedIds.length; i++) {
                await client.query(
                    `UPDATE category_groups SET sort_order = $1 WHERE id = $2`,
                    [i + 1, orderedIds[i]]
                );
            }
            await client.query('COMMIT');
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    },
};

module.exports = CategoryModel;
