import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import SummaryCard from '../ui/SummaryCard';
import TransactionList from '../ui/TransactionList';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Wallet, DollarSign, Landmark, TrendingUp } from 'lucide-react';
import MonthYearPicker from '../ui/MonthYearPicker';

const Dashboard = () => {
  const {
    getFilteredExpenses,
    getFilteredIncome,
    calculateTotalExpenses,
    calculateTotalIncome,
    getExpensesByCategory,
    formatCurrency,
    activeMonth,
    activeYear
  } = useFinance();

  const expenses = getFilteredExpenses();
  const income = getFilteredIncome();
  const totalExpenses = calculateTotalExpenses();
  const totalIncome = calculateTotalIncome();
  const balance = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? Math.round((balance / totalIncome) * 100) : 0;

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#ffc658', '#8dd1e1'];

  const expensesByCategory = getExpensesByCategory();

  // Sample data for the line chart - in a real app, this would be calculated from actual data
  const monthlyData = [
    { name: 'Jan', income: 3500, expenses: 2800 },
    { name: 'Feb', income: 3200, expenses: 2600 },
    { name: 'Mar', income: 3800, expenses: 2900 },
    { name: 'Apr', income: 3600, expenses: 3100 },
    { name: 'May', income: 4000, expenses: 3000 },
    { name: 'Jun', income: 3900, expenses: 3300 },
  ];

  return (
    <div className="space-y-6">
      <MonthYearPicker />
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Income"
          value={formatCurrency(totalIncome)}
          icon={<DollarSign className="h-6 w-6 text-green-500" />}
          trend="+5%"
          trendUp={true}
        />
        <SummaryCard
          title="Expenses"
          value={formatCurrency(totalExpenses)}
          icon={<Wallet className="h-6 w-6 text-red-500" />}
          trend="-2%"
          trendUp={false}
        />
        <SummaryCard
          title="Balance"
          value={formatCurrency(balance)}
          icon={<Landmark className="h-6 w-6 text-blue-500" />}
          trend="+8%"
          trendUp={true}
          important={true}
        />
        <SummaryCard
          title="Savings Rate"
          value={`${savingsRate}%`}
          icon={<TrendingUp className="h-6 w-6 text-purple-500" />}
          trend="+3%"
          trendUp={true}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Expenses by Category */}
        <div className="card h-80">
          <h2 className="mb-4 text-lg font-semibold">Expenses by Category</h2>
          {expensesByCategory.length > 0 ? (
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={expensesByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {expensesByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => formatCurrency(value)} 
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-gray-500">No expense data for this period</p>
            </div>
          )}
        </div>

        {/* Income vs Expenses Trend */}
        <div className="card h-80">
          <h2 className="mb-4 text-lg font-semibold">Income vs Expenses Trend</h2>
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Line
                type="monotone"
                dataKey="income"
                stroke="#22C55E"
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="expenses"
                stroke="#EF4444"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <h2 className="mb-4 text-lg font-semibold">Recent Transactions</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <h3 className="mb-2 text-sm font-medium text-gray-500">Recent Expenses</h3>
            <TransactionList 
              transactions={expenses.slice(0, 5)} 
              type="expense" 
              emptyMessage="No recent expenses" 
            />
          </div>
          <div>
            <h3 className="mb-2 text-sm font-medium text-gray-500">Recent Income</h3>
            <TransactionList 
              transactions={income.slice(0, 5)} 
              type="income" 
              emptyMessage="No recent income" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;