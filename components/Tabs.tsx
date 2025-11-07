
import React from 'react';

type Tab = 'inclusive' | 'all';

interface TabsProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab }) => {
  const commonClasses = "w-1/2 py-3 text-center font-semibold rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400";
  const activeClasses = "bg-indigo-600 text-white shadow-md";
  const inactiveClasses = "bg-gray-700 text-gray-300 hover:bg-gray-600";

  return (
    <div className="flex space-x-2 p-1 bg-gray-800 rounded-lg max-w-md mx-auto">
      <button
        onClick={() => setActiveTab('inclusive')}
        className={`${commonClasses} ${activeTab === 'inclusive' ? activeClasses : inactiveClasses}`}
      >
        Receitas Inclusivas
      </button>
      <button
        onClick={() => setActiveTab('all')}
        className={`${commonClasses} ${activeTab === 'all' ? activeClasses : inactiveClasses}`}
      >
        Todas as Receitas
      </button>
    </div>
  );
};

export default Tabs;
