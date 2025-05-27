import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { format } from 'date-fns';

const FinanceContext = createContext();

export const useFinance = () => useContext(FinanceContext);

// Generate sample data for testing
const generateSampleData = () => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  const expenseCategories = [
    'Housing', 'Food', 'Transportation', 'Utilities', 
    'Healthcare', 'Entertainment', 'Shopping', 'Other'
  ];
  
  const incomeCategories = [
    'Salary', 'Freelance', 'Investments', 'Gifts', 'Other'
  ];
  
  const getRandomAmount = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  
  const getRandomDate = (month = currentMonth, year = currentYear) => {
    const day = Math.floor(Math.random() * 28) + 1;
    return new Date(year, month, day);
  };
  
  const expenses = [];
  for (let i = 0; i < 20; i++) {
    const monthOffset = Math.floor(i / 5);
    const date = getRandomDate(currentMonth - monthOffset);
    expenses.push({
      id: `exp-${i}`,
      amount: getRandomAmount(10, 200),
      category: expenseCategories[Math.floor(Math.random() * expenseCategories.length)],
      description: `Sample expense ${i + 1}`,
      date: format(date, 'yyyy-MM-dd'),
    });
  }
  
  const income = [];
  for (let i = 0; i < 8; i++) {
    const monthOffset = Math.floor(i / 2);
    const date = getRandomDate(currentMonth - monthOffset);
    income.push({
      id: `inc-${i}`,
      amount: getRandomAmount(500, 3000),
      category: incomeCategories[Math.floor(Math.random() * incomeCategories.length)],
      description: `Sample income ${i + 1}`,
      date: format(date, 'yyyy-MM-dd'),
    });
  }
  
  const budget = expenseCategories.map(category => ({
    id: `budget-${category}`,
    category,
    amount: getRandomAmount(200, 1000),
    spent: getRandomAmount(50, 500),
  }));
  
  return { expenses, income, budget };
};

const initialState = {
  expenses: [],
  income: [],
  budget: [],
  currency: '$',
  activeMonth: new Date().getMonth(),
  activeYear: new Date().getFullYear(),
};

const financeReducer = (state, action) => {
  switch (action.type) {
    case 'INIT_DATA':
      return {
        ...state,
        expenses: action.payload.expenses,
        income: action.payload.income,
        budget: action.payload.budget,
      };
    case 'ADD_EXPENSE':
      return {
        ...state,
        expenses: [action.payload, ...state.expenses],
      };
    case 'UPDATE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.map(expense => 
          expense.id === action.payload.id ? action.payload : expense
        ),
      };
    case 'DELETE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.filter(expense => expense.id !== action.payload),
      };
    case 'ADD_INCOME':
      return {
        ...state,
        income: [action.payload, ...state.income],
      };
    case 'UPDATE_INCOME':
      return {
        ...state,
        income: state.income.map(item => 
          item.id === action.payload.id ? action.payload : item
        ),
      };
    case 'DELETE_INCOME':
      return {
        ...state,
        income: state.income.filter(item => item.id !== action.payload),
      };
    case 'UPDATE_BUDGET':
      return {
        ...state,
        budget: state.budget.map(item =>
          item.id === action.payload.id ? action.payload : item
        ),
      };
    case 'SET_ACTIVE_MONTH':
      return {
        ...state,
        activeMonth: action.payload,
      };
    case 'SET_ACTIVE_YEAR':
      return {
        ...state,
        activeYear: action.payload,
      };
    default:
      return state;
  }
};

export const FinanceProvider = ({ children }) => {
  const [state, dispatch] = useReducer(financeReducer, initialState);

  useEffect(() => {
    // Initialize with sample data
    const sampleData = generateSampleData();
    dispatch({
      type: 'INIT_DATA',
      payload: sampleData,
    });
  }, []);

  // Filter transactions for the active month/year
  const getFilteredExpenses = () => {
    return state.expenses.filter(expense => {
      const date = new Date(expense.date);
      return date.getMonth() === state.activeMonth && date.getFullYear() === state.activeYear;
    });
  };

  const getFilteredIncome = () => {
    return state.income.filter(income => {
      const date = new Date(income.date);
      return date.getMonth() === state.activeMonth && date.getFullYear() === state.activeYear;
    });
  };

  // Calculate totals
  const calculateTotalExpenses = () => {
    return getFilteredExpenses().reduce((total, expense) => total + expense.amount, 0);
  };

  const calculateTotalIncome = () => {
    return getFilteredIncome().reduce((total, income) => total + income.amount, 0);
  };

  // Get expenses by category
  const getExpensesByCategory = () => {
    const categories = {};
    getFilteredExpenses().forEach(expense => {
      if (categories[expense.category]) {
        categories[expense.category] += expense.amount;
      } else {
        categories[expense.category] = expense.amount;
      }
    });
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `${state.currency}${amount.toFixed(2)}`;
  };

  return (
    <FinanceContext.Provider
      value={{
        ...state,
        dispatch,
        getFilteredExpenses,
        getFilteredIncome,
        calculateTotalExpenses,
        calculateTotalIncome,
        getExpensesByCategory,
        formatCurrency,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};