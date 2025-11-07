
import React from 'react';

const Spinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 border-4 border-t-4 border-gray-600 border-t-indigo-500 rounded-full animate-spin"></div>
        <p className="text-indigo-300 font-semibold">Buscando receitas deliciosas...</p>
    </div>
  );
};

export default Spinner;
