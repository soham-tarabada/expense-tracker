import React, { useState } from 'react';
import { useFinance } from './context/FinanceContext';
import { useTheme } from './context/ThemeContext';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './components/pages/Dashboard';
import Expenses from './components/pages/Expenses';
import Income from './components/pages/Income';
import Budget from './components/pages/Budget';
import Reports from './components/pages/Reports';
import { Sun, Moon } from 'lucide-react';

const App = () => {
  const [activePage, setActivePage] = useState('dashboard');
  const { isDarkMode, toggleTheme } = useTheme();

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'expenses':
        return <Expenses />;
      case 'income':
        return <Income />;
      case 'budget':
        return <Budget />;
      case 'reports':
        return <Reports />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold md:text-3xl">
            {activePage.charAt(0).toUpperCase() + activePage.slice(1)}
          </h1>
          <button
            onClick={toggleTheme}
            className="rounded-full p-2 text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
        
        <div className="animate-fade-in">
          {renderPage()}
        </div>
      </main>
    </div>
  );
};

export default App;