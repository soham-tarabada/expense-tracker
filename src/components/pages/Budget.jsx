import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import MonthYearPicker from '../ui/MonthYearPicker';

const Budget = () => {
  const { budget, dispatch, formatCurrency } = useFinance();
  const [editingCategory, setEditingCategory] = useState(null);

  const handleUpdateBudget = (id, newAmount) => {
    const budgetItem = budget.find(item => item.id === id);
    if (budgetItem) {
      dispatch({
        type: 'UPDATE_BUDGET',
        payload: {
          ...budgetItem,
          amount: parseFloat(newAmount)
        }
      });
    }
    setEditingCategory(null);
  };

  return (
    <div className="space-y-6">
      <MonthYearPicker />
      
      <div className="card">
        <h2 className="mb-6 text-xl font-semibold">Monthly Budget</h2>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {budget.map((item) => {
            const percentage = item.amount > 0 ? Math.min(Math.round((item.spent / item.amount) * 100), 100) : 0;
            const isOverBudget = item.spent > item.amount;
            
            let progressColor = '#22C55E'; // success green
            if (percentage > 75 && percentage <= 90) {
              progressColor = '#F59E0B'; // warning amber
            } else if (percentage > 90) {
              progressColor = '#EF4444'; // danger red
            }

            return (
              <div key={item.id} className="rounded-lg bg-gray-50 p-4 shadow-sm dark:bg-gray-700">
                <div className="mb-4 flex justify-between">
                  <h3 className="font-medium">{item.category}</h3>
                  <button
                    onClick={() => setEditingCategory(item.id)}
                    className="text-xs text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Edit
                  </button>
                </div>
                
                {editingCategory === item.id ? (
                  <div className="animate-fade-in">
                    <input
                      type="number"
                      className="form-input mb-2"
                      defaultValue={item.amount}
                      min="0"
                      step="10"
                    />
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setEditingCategory(null)}
                        className="text-xs text-gray-500 hover:text-gray-700"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={(e) => {
                          const input = e.target.closest('div').querySelector('input');
                          handleUpdateBudget(item.id, input.value);
                        }}
                        className="text-xs text-blue-500 hover:text-blue-700"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <div className="mr-4 h-20 w-20">
                      <CircularProgressbarWithChildren
                        value={percentage}
                        strokeWidth={10}
                        styles={buildStyles({
                          strokeLinecap: 'round',
                          pathColor: progressColor,
                          trailColor: '#E5E7EB'
                        })}
                      >
                        <div className="text-center">
                          <div className="text-xl font-bold">{percentage}%</div>
                        </div>
                      </CircularProgressbarWithChildren>
                    </div>
                    <div className="flex-1">
                      <div className="mb-1 text-sm text-gray-500 dark:text-gray-300">
                        Spent: {formatCurrency(item.spent)}
                      </div>
                      <div className="mb-1 text-sm font-medium">
                        Budget: {formatCurrency(item.amount)}
                      </div>
                      <div className="text-sm">
                        {isOverBudget ? (
                          <span className="text-red-500 dark:text-red-400">
                            Over by {formatCurrency(item.spent - item.amount)}
                          </span>
                        ) : (
                          <span className="text-green-500 dark:text-green-400">
                            Remaining: {formatCurrency(item.amount - item.spent)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Budget;