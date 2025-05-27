import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import TransactionList from '../ui/TransactionList';
import TransactionForm from '../ui/TransactionForm';
import { Plus, Filter } from 'lucide-react';
import MonthYearPicker from '../ui/MonthYearPicker';

const Expenses = () => {
  const { getFilteredExpenses, calculateTotalExpenses, formatCurrency } = useFinance();
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [filterCategory, setFilterCategory] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const expenses = getFilteredExpenses();
  const totalExpenses = calculateTotalExpenses();

  // Get all unique categories
  const categories = [...new Set(expenses.map(expense => expense.category))];

  const filteredExpenses = filterCategory
    ? expenses.filter(expense => expense.category === filterCategory)
    : expenses;

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setIsAddingExpense(true);
  };

  const handleCloseForm = () => {
    setIsAddingExpense(false);
    setEditingExpense(null);
  };

  return (
    <div className="space-y-6">
      <MonthYearPicker />
      
      <div className="card">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Expenses</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Total: {formatCurrency(totalExpenses)}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary"
            >
              <Filter className="mr-1 h-4 w-4" />
              Filter
            </button>
            <button
              onClick={() => setIsAddingExpense(true)}
              className="btn-primary"
            >
              <Plus className="mr-1 h-4 w-4" />
              Add Expense
            </button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mb-4 animate-slide-down rounded-lg bg-gray-100 p-4 dark:bg-gray-700">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium">Category:</span>
              <button
                onClick={() => setFilterCategory('')}
                className={`badge ${
                  filterCategory === ''
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                    : 'bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-300'
                }`}
              >
                All
              </button>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setFilterCategory(category)}
                  className={`badge ${
                    filterCategory === category
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                      : 'bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Expense List */}
        <TransactionList
          transactions={filteredExpenses}
          type="expense"
          onEdit={handleEditExpense}
          emptyMessage="No expenses found. Add one to get started!"
        />
      </div>

      {/* Add/Edit Expense Form */}
      {isAddingExpense && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md animate-scale-in rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
            <h2 className="mb-4 text-lg font-semibold">
              {editingExpense ? 'Edit Expense' : 'Add New Expense'}
            </h2>
            <TransactionForm
              type="expense"
              transaction={editingExpense}
              onClose={handleCloseForm}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;