import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { X } from 'lucide-react';

const TransactionForm = ({ type, transaction, onClose }) => {
  const { dispatch } = useFinance();
  const isEditing = !!transaction;

  const [formData, setFormData] = useState({
    amount: transaction ? transaction.amount : '',
    category: transaction ? transaction.category : '',
    description: transaction ? transaction.description : '',
    date: transaction ? transaction.date : new Date().toISOString().split('T')[0],
  });

  const [errors, setErrors] = useState({});

  const expenseCategories = [
    'Housing', 'Food', 'Transportation', 'Utilities', 
    'Healthcare', 'Entertainment', 'Shopping', 'Other'
  ];
  
  const incomeCategories = [
    'Salary', 'Freelance', 'Investments', 'Gifts', 'Other'
  ];

  const categories = type === 'expense' ? expenseCategories : incomeCategories;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }
    
    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Please enter a description';
    }
    
    if (!formData.date) {
      newErrors.date = 'Please select a date';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const formattedData = {
      ...formData,
      amount: parseFloat(formData.amount),
      id: transaction ? transaction.id : `${type}-${Date.now()}`,
    };
    
    if (isEditing) {
      dispatch({
        type: type === 'expense' ? 'UPDATE_EXPENSE' : 'UPDATE_INCOME',
        payload: formattedData,
      });
    } else {
      dispatch({
        type: type === 'expense' ? 'ADD_EXPENSE' : 'ADD_INCOME',
        payload: formattedData,
      });
    }
    
    onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4 flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700"
          aria-label="Close"
        >
          <X size={20} />
        </button>
      </div>
      
      <div className="mb-4">
        <label htmlFor="amount" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Amount
        </label>
        <input
          type="number"
          id="amount"
          name="amount"
          step="0.01"
          min="0"
          value={formData.amount}
          onChange={handleChange}
          className={`form-input ${errors.amount ? 'border-red-500' : ''}`}
          placeholder="0.00"
        />
        {errors.amount && <p className="mt-1 text-xs text-red-500">{errors.amount}</p>}
      </div>
      
      <div className="mb-4">
        <label htmlFor="category" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Category
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className={`form-input ${errors.category ? 'border-red-500' : ''}`}
        >
          <option value="">Select a category</option>
          {categories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category}</p>}
      </div>
      
      <div className="mb-4">
        <label htmlFor="description" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Description
        </label>
        <input
          type="text"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className={`form-input ${errors.description ? 'border-red-500' : ''}`}
          placeholder="Enter a description"
        />
        {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
      </div>
      
      <div className="mb-6">
        <label htmlFor="date" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Date
        </label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className={`form-input ${errors.date ? 'border-red-500' : ''}`}
        />
        {errors.date && <p className="mt-1 text-xs text-red-500">{errors.date}</p>}
      </div>
      
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onClose}
          className="btn-secondary"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary"
        >
          {isEditing ? 'Update' : 'Add'} {type === 'expense' ? 'Expense' : 'Income'}
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;