import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const TransactionList = ({ transactions, type, onEdit, emptyMessage }) => {
  const { formatCurrency, dispatch } = useFinance();

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      dispatch({
        type: type === 'expense' ? 'DELETE_EXPENSE' : 'DELETE_INCOME',
        payload: id,
      });
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      // Expense categories
      'Housing': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'Food': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'Transportation': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'Utilities': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'Healthcare': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      'Entertainment': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
      'Shopping': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
      
      // Income categories
      'Salary': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
      'Freelance': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
      'Investments': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
      'Gifts': 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300',
      
      // Default
      'Other': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    };
    
    return colors[category] || colors['Other'];
  };

  if (transactions.length === 0) {
    return (
      <div className="py-6 text-center text-gray-500 dark:text-gray-400">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {transactions.map(transaction => (
        <div 
          key={transaction.id}
          className="flex items-center justify-between rounded-lg border border-gray-100 bg-white p-4 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-750"
        >
          <div className="flex flex-1 items-center">
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-gray-900 dark:text-white">
                {transaction.description}
              </p>
              <div className="mt-1 flex items-center">
                <span className={`badge mr-2 ${getCategoryColor(transaction.category)}`}>
                  {transaction.category}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {format(new Date(transaction.date), 'MMM dd, yyyy')}
                </span>
              </div>
            </div>
          </div>
          <div className="ml-4 flex items-center space-x-4">
            <div className={`text-right font-medium ${type === 'expense' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
              {type === 'expense' ? '-' : '+'}{formatCurrency(transaction.amount)}
            </div>
            <div className="flex space-x-1">
              {onEdit && (
                <button
                  onClick={() => onEdit(transaction)}
                  className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-blue-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-blue-400"
                  aria-label="Edit"
                >
                  <Edit size={16} />
                </button>
              )}
              <button
                onClick={() => handleDelete(transaction.id)}
                className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-red-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-red-400"
                aria-label="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionList;