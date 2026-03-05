const express = require('express');
const { body } = require('express-validator');
const CategoryController = require('../controllers/categoryController');
// const { authenticate } = require('../middleware/auth');

const router = express.Router();

// router.use(authenticate);

// Category Groups
router.post(
    '/:year/groups',
    [body('name').trim().notEmpty().withMessage('Group name is required')],
    CategoryController.createGroup
);
router.put('/:year/groups/reorder', CategoryController.reorderGroups);
router.put('/:year/groups/:groupId', CategoryController.updateGroup);
router.delete('/:year/groups/:groupId', CategoryController.deleteGroup);

// Categories
router.post(
    '/:year/groups/:groupId/categories',
    [body('name').trim().notEmpty().withMessage('Category name is required')],
    CategoryController.createCategory
);
router.put('/:year/categories/:categoryId', CategoryController.updateCategory);
router.delete('/:year/categories/:categoryId', CategoryController.deleteCategory);

// Budget Entries
router.put(
    '/:year/categories/:categoryId/budget',
    [
        body('month').isInt({ min: 1, max: 12 }).withMessage('Month must be 1-12'),
        body('budgeted').isFloat({ min: 0 }).withMessage('Budgeted amount must be >= 0'),
    ],
    CategoryController.setBudgetEntry
);
router.put('/:year/entries/bulk', CategoryController.bulkSetBudgetEntries);

module.exports = router;
