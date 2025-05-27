import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MonthYearPicker = () => {
  const { activeMonth, activeYear, dispatch } = useFinance();

  const months = [
    'January', 'February', 'March', 'April', 
    'May', 'June', 'July', 'August', 
    'September', 'October', 'November', 'December'
  ];

  const handlePreviousMonth = () => {
    let newMonth = activeMonth - 1;
    let newYear = activeYear;
    
    if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    }
    
    dispatch({ type: 'SET_ACTIVE_MONTH', payload: newMonth });
    dispatch({ type: 'SET_ACTIVE_YEAR', payload: newYear });
  };

  const handleNextMonth = () => {
    let newMonth = activeMonth + 1;
    let newYear = activeYear;
    
    if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    }
    
    dispatch({ type: 'SET_ACTIVE_MONTH', payload: newMonth });
    dispatch({ type: 'SET_ACTIVE_YEAR', payload: newYear });
  };

  const handleMonthChange = (e) => {
    dispatch({ type: 'SET_ACTIVE_MONTH', payload: parseInt(e.target.value) });
  };

  const handleYearChange = (e) => {
    dispatch({ type: 'SET_ACTIVE_YEAR', payload: parseInt(e.target.value) });
  };

  // Generate array of years (5 years back, 5 years forward)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  return (
    <div className="card mb-6 flex items-center justify-between">
      <button
        onClick={handlePreviousMonth}
        className="btn-secondary"
        aria-label="Previous month"
      >
        <ChevronLeft size={18} />
      </button>
      
      <div className="flex items-center space-x-2">
        <select
          value={activeMonth}
          onChange={handleMonthChange}
          className="form-input py-1 pr-8"
          aria-label="Select month"
        >
          {months.map((month, index) => (
            <option key={month} value={index}>
              {month}
            </option>
          ))}
        </select>
        
        <select
          value={activeYear}
          onChange={handleYearChange}
          className="form-input py-1 pr-8"
          aria-label="Select year"
        >
          {yearOptions.map(year => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      
      <button
        onClick={handleNextMonth}
        className="btn-secondary"
        aria-label="Next month"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
};

export default MonthYearPicker;