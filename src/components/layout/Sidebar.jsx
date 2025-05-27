import React from 'react';
import { 
  LayoutDashboard, 
  Wallet, 
  DollarSign, 
  PieChart, 
  BarChart4, 
  Menu, 
  X 
} from 'lucide-react';

const Sidebar = ({ activePage, setActivePage }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'expenses', label: 'Expenses', icon: Wallet },
    { id: 'income', label: 'Income', icon: DollarSign },
    { id: 'budget', label: 'Budget', icon: PieChart },
    { id: 'reports', label: 'Reports', icon: BarChart4 },
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleNavClick = (pageId) => {
    setActivePage(pageId);
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="fixed left-4 top-4 z-20 block rounded-md bg-blue-500 p-2 text-white md:hidden"
        onClick={toggleSidebar}
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-10 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out dark:bg-gray-800 md:relative md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-center border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">Finance Tracker</h1>
          </div>
          
          <nav className="mt-6 flex-grow px-4">
            <ul className="space-y-1">
              {navItems.map(item => (
                <li key={item.id}>
                  <button
                    className={`flex w-full items-center rounded-lg px-4 py-3 text-left text-sm font-medium transition-colors duration-200 ease-in-out ${
                      activePage === item.id
                        ? 'bg-blue-50 text-blue-600 dark:bg-gray-700 dark:text-blue-400'
                        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => handleNavClick(item.id)}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="mb-6 border-t border-gray-200 px-4 pt-4 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              &copy; {new Date().getFullYear()} Finance Tracker
            </div>
          </div>
        </div>
      </div>
      
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-0 bg-black/50 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default Sidebar;