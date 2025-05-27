import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

const Reports = () => {
  const { 
    expenses, 
    income, 
    formatCurrency,
    getExpensesByCategory 
  } = useFinance();
  
  const [reportType, setReportType] = useState('monthly');
  
  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];
  
  // Monthly spending data - in a real app, this would be calculated from actual data
  const monthlyData = [
    { name: 'Jan', income: 3500, expenses: 2800 },
    { name: 'Feb', income: 3200, expenses: 2600 },
    { name: 'Mar', income: 3800, expenses: 2900 },
    { name: 'Apr', income: 3600, expenses: 3100 },
    { name: 'May', income: 4000, expenses: 3000 },
    { name: 'Jun', income: 3900, expenses: 3300 },
  ];
  
  // Calculate savings for each month
  const monthlySavings = monthlyData.map(month => ({
    name: month.name,
    savings: month.income - month.expenses
  }));
  
  // Category data
  const categoryData = getExpensesByCategory();
  
  // Custom tooltip formatter
  const tooltipFormatter = (value) => formatCurrency(value);
  
  return (
    <div className="space-y-6">
      {/* Report Type Selector */}
      <div className="card">
        <h2 className="mb-4 text-xl font-semibold">Financial Reports</h2>
        <div className="mb-6 flex flex-wrap space-x-2">
          <button
            className={`btn ${
              reportType === 'monthly' ? 'btn-primary' : 'btn-secondary'
            }`}
            onClick={() => setReportType('monthly')}
          >
            Monthly Overview
          </button>
          <button
            className={`btn ${
              reportType === 'categories' ? 'btn-primary' : 'btn-secondary'
            }`}
            onClick={() => setReportType('categories')}
          >
            Spending by Category
          </button>
          <button
            className={`btn ${
              reportType === 'savings' ? 'btn-primary' : 'btn-secondary'
            }`}
            onClick={() => setReportType('savings')}
          >
            Savings Rate
          </button>
        </div>
        
        {/* Monthly Overview */}
        {reportType === 'monthly' && (
          <div className="h-96">
            <h3 className="mb-4 text-lg font-medium">Monthly Income vs Expenses</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={tooltipFormatter} />
                <Legend />
                <Bar dataKey="income" name="Income" fill="#22C55E" />
                <Bar dataKey="expenses" name="Expenses" fill="#EF4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
        
        {/* Categories Report */}
        {reportType === 'categories' && (
          <div className="h-96">
            <h3 className="mb-4 text-lg font-medium">Spending by Category</h3>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={tooltipFormatter} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-gray-500">No data available for this report</p>
              </div>
            )}
          </div>
        )}
        
        {/* Savings Rate */}
        {reportType === 'savings' && (
          <div className="h-96">
            <h3 className="mb-4 text-lg font-medium">Monthly Savings</h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlySavings}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={tooltipFormatter} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="savings"
                  name="Savings"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
      
      {/* Financial Insights */}
      <div className="card">
        <h2 className="mb-4 text-lg font-semibold">Financial Insights</h2>
        <div className="space-y-4">
          <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/30">
            <h3 className="mb-2 font-medium text-blue-800 dark:text-blue-300">Spending Trend</h3>
            <p className="text-sm text-blue-700 dark:text-blue-200">
              Your spending has decreased by 8% compared to last month. Keep up the good work!
            </p>
          </div>
          
          <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/30">
            <h3 className="mb-2 font-medium text-green-800 dark:text-green-300">Savings Opportunity</h3>
            <p className="text-sm text-green-700 dark:text-green-200">
              You've spent 20% more on Entertainment this month. Consider reducing this category to increase your savings rate.
            </p>
          </div>
          
          <div className="rounded-lg bg-purple-50 p-4 dark:bg-purple-900/30">
            <h3 className="mb-2 font-medium text-purple-800 dark:text-purple-300">Budget Performance</h3>
            <p className="text-sm text-purple-700 dark:text-purple-200">
              You've stayed under budget in 6 out of 8 categories this month. This is better than 75% of users!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;