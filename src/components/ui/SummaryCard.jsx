import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const SummaryCard = ({ title, value, icon, trend, trendUp, important = false }) => {
  return (
    <div className={`card transition-all duration-300 hover:shadow-md ${important ? 'border-2 border-blue-500 dark:border-blue-400' : ''}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className={`mt-1 text-2xl font-bold ${important ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}>
            {value}
          </p>
        </div>
        <div className="rounded-full bg-gray-100 p-3 dark:bg-gray-700">
          {icon}
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center">
          <span
            className={`mr-1 flex items-center text-xs font-medium ${
              trendUp
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            }`}
          >
            {trendUp ? (
              <TrendingUp className="mr-1 h-3 w-3" />
            ) : (
              <TrendingDown className="mr-1 h-3 w-3" />
            )}
            {trend}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">vs last month</span>
        </div>
      )}
    </div>
  );
};

export default SummaryCard;