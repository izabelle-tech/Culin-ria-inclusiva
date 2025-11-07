
import React, { useState } from 'react';
import Header from './components/Header';
import Tabs from './components/Tabs';
import RecipeGenerator from './components/RecipeGenerator';
import RecipeCard from './components/RecipeCard';
import Spinner from './components/Spinner';
import { generateRecipes } from './services/geminiService';
import type { Recipe } from './types';
import { LeafIcon, UtensilsCrossedIcon } from './components/Icons';

type Tab = 'inclusive' | 'all';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('inclusive');
  const [inclusiveRecipes, setInclusiveRecipes] = useState<Recipe[]>([]);
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (prompt: string) => {
    setLoading(true);
    setError(null);
    try {
      const isInclusive = activeTab === 'inclusive';
      const newRecipes = await generateRecipes(prompt, isInclusive);
      
      if (isInclusive) {
        setInclusiveRecipes(prev => [...newRecipes, ...prev]);
      } else {
        setAllRecipes(prev => [...newRecipes, ...prev]);
      }
    } catch (err) {
      setError('Falha ao gerar receitas. Por favor, tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const currentRecipes = activeTab === 'inclusive' ? inclusiveRecipes : allRecipes;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="mt-8 p-6 bg-gray-800 rounded-xl shadow-lg">
          <RecipeGenerator onGenerate={handleGenerate} loading={loading} />
          {error && <p className="mt-4 text-center text-red-400">{error}</p>}
        </div>
        
        <div className="mt-12">
          {loading && currentRecipes.length === 0 ? (
            <div className="flex justify-center items-center py-16">
              <Spinner />
            </div>
          ) : currentRecipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentRecipes.map((recipe, index) => (
                <RecipeCard key={`${recipe.name}-${index}`} recipe={recipe} />
              ))}
            </div>
          ) : (
             <div className="text-center py-16 px-6 bg-gray-800/50 rounded-lg">
                {activeTab === 'inclusive' ? (
                    <>
                        <LeafIcon className="mx-auto h-12 w-12 text-green-400" />
                        <h3 className="mt-4 text-xl font-semibold text-white">Receitas Inclusivas</h3>
                        <p className="mt-2 text-gray-400">Gere receitas deliciosas sem glúten e sem lactose. Digite o que você deseja cozinhar acima!</p>
                    </>
                ) : (
                    <>
                        <UtensilsCrossedIcon className="mx-auto h-12 w-12 text-blue-400" />
                        <h3 className="mt-4 text-xl font-semibold text-white">Todas as Receitas</h3>
                        <p className="mt-2 text-gray-400">Explore um mundo de sabores sem restrições. Peça qualquer tipo de receita no campo acima.</p>
                    </>
                )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
