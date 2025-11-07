import React from 'react';
import type { Recipe } from '../types';
import { BookMarkedIcon, PieChartIcon, CheckIcon, ListOrderedIcon } from './Icons';

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const { name, description, ingredients, preparation, yield: recipeYield, dailyValues, imageUrl } = recipe;

  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-indigo-500/30 transform hover:-translate-y-1 transition-all duration-300 flex flex-col">
      <img 
        src={imageUrl}
        alt={name} 
        className="w-full h-48 object-cover" 
      />
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-2xl font-bold text-white mb-2">{name}</h3>
        <p className="text-gray-400 mb-4 text-sm flex-grow">{description}</p>

        <div className="mb-5">
            <h4 className="flex items-center text-lg font-semibold text-indigo-300 mb-2">
                <BookMarkedIcon className="h-5 w-5 mr-2" />
                Ingredientes
            </h4>
            <ul className="space-y-2">
                {ingredients.map((ingredient, i) => (
                <li key={i} className="flex items-start text-gray-300">
                    <CheckIcon className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                    <span>{ingredient}</span>
                </li>
                ))}
            </ul>
        </div>

        <div className="mb-5">
            <h4 className="flex items-center text-lg font-semibold text-indigo-300 mb-2">
                <ListOrderedIcon className="h-5 w-5 mr-2" />
                Modo de Preparo
            </h4>
            <ol className="space-y-3 list-decimal list-inside text-gray-300">
                {preparation.map((step, i) => (
                    <li key={i}>{step}</li>
                ))}
            </ol>
        </div>

        <div className="mb-5">
            <h4 className="flex items-center text-lg font-semibold text-indigo-300 mb-2">
                <PieChartIcon className="h-5 w-5 mr-2" />
                Valores Diários
            </h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-300">
                <p><strong>Rendimento:</strong> {recipeYield}</p>
                {Object.entries(dailyValues).map(([key, value]) => (
                    <p key={key}>
                        <strong className="capitalize">{key.replace(/([A-Z])/g, ' $1')}:</strong> {value}
                    </p>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
