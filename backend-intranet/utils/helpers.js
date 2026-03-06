/**
 * Standard API response wrapper
 */
const apiResponse = (res, statusCode, success, message, data = null) => {
    const response = { success, message };
    if (data !== null) response.data = data;
    return res.status(statusCode).json(response);
};

/**
 * Month names lookup
 */
const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

/**
 * Get month name from index (1-12)
 */
const getMonthName = (monthIndex) => MONTH_NAMES[monthIndex - 1] || 'Unknown';

/**
 * Default category groups and categories for new budgets
 */
const DEFAULT_BUDGET_TEMPLATE = [
    {
        name: 'Monthly Bills',
        sort_order: 1,
        categories: [
            { name: 'Rent/Mortgage', sort_order: 1 },
            { name: 'Phone', sort_order: 2 },
            { name: 'Internet', sort_order: 3 },
            { name: 'Cable TV', sort_order: 4 },
            { name: 'Electricity', sort_order: 5 },
            { name: 'Water', sort_order: 6 },
        ],
    },
    {
        name: 'Everyday Expenses',
        sort_order: 2,
        categories: [
            { name: 'Spending Money', sort_order: 1 },
            { name: 'Groceries', sort_order: 2 },
            { name: 'Fuel', sort_order: 3 },
            { name: 'Restaurants', sort_order: 4 },
            { name: 'Medical/Dental', sort_order: 5 },
            { name: 'Clothing', sort_order: 6 },
        ],
    },
    {
        name: 'Savings Goals',
        sort_order: 3,
        categories: [
            { name: 'Emergency Fund', sort_order: 1 },
            { name: 'Vacation', sort_order: 2 },
            { name: 'Investments', sort_order: 3 },
        ],
    },
    {
        name: 'Debt Payments',
        sort_order: 4,
        categories: [
            { name: 'Credit Card', sort_order: 1 },
            { name: 'Personal Loan', sort_order: 2 },
        ],
    },
];

module.exports = {
    apiResponse,
    MONTH_NAMES,
    getMonthName,
    DEFAULT_BUDGET_TEMPLATE,
};
