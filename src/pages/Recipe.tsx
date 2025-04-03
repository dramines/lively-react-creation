
import { useEffect, useState } from 'react';
import { ArrowLeft, Clock, Users, ChefHat, Timer } from 'lucide-react';
import { motion } from 'framer-motion';
import { FEATURED_RECIPES } from '../config/data';
import type { Recipe as RecipeType } from '../types/recipe';
import { useTranslation } from 'react-i18next';

const Recipe = ({ recipeId, onBack }: { recipeId: string; onBack: () => void }) => {
  const [recipe, setRecipe] = useState<RecipeType | null>(null);
  const [activeTab, setActiveTab] = useState<'ingredients' | 'instructions'>('ingredients');
  const { t } = useTranslation();

  useEffect(() => {
    const foundRecipe = FEATURED_RECIPES.find(r => r.id === recipeId);
    if (foundRecipe) {
      const completeRecipe: RecipeType = {
        ...foundRecipe,
        prepTime: '20 min',
        cookTime: foundRecipe.time,
        totalTime: foundRecipe.time,
        author: 'Tazart',
        nutrition: {
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0
        },
        tags: [],
        tips: []
      };
      setRecipe(completeRecipe);
    }
  }, [recipeId]);

  if (!recipe) return null;

  // Get translated recipe information based on recipe ID
  // The correct way to access translations is using recipe id with underscores
  const translationKey = recipe.id.replace(/-/g, '_');
  const translatedTitle = t(`recipes.${translationKey}.title`, recipe.title);
  const translatedDescription = t(`recipes.${translationKey}.description`, recipe.description);
  const translatedDifficulty = t(`recipes.${translationKey}.difficulty`, recipe.difficulty);
  const translatedCategory = t(`recipes.${translationKey}.category`, recipe.category);
  const translatedIngredients = recipe.ingredients.map((ingredient, index) =>
    t(`recipes.${translationKey}.ingredients.${index}`, ingredient)
  );
  const translatedInstructions = recipe.instructions.map((instruction, index) =>
    t(`recipes.${translationKey}.instructions.${index}`, instruction)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 mt-[7%]">
      <div className="container mx-auto px-4 py-10">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>{t('recipes.back_to_recipes')}</span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto"
        >
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="relative h-[50vh] overflow-hidden">
              <motion.img
                src={recipe.image}
                alt={translatedTitle}
                className="w-full h-full object-cover"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>

            <div className="p-8">
              <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{translatedTitle}</h1>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">{translatedDescription}</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                  <div className="flex flex-col items-center space-y-2 p-4 rounded-xl bg-gray-50">
                    <Clock className="w-6 h-6 text-[#96cc39]" />
                    <span className="text-sm text-gray-500">{t('recipes.time')}</span>
                    <span className="font-semibold">{recipe.time}</span>
                  </div>
                  <div className="flex flex-col items-center space-y-2 p-4 rounded-xl bg-gray-50">
                    <Users className="w-6 h-6 text-[#96cc39]" />
                    <span className="text-sm text-gray-500">{t('recipes.servings')}</span>
                    <span className="font-semibold">{recipe.servings} pers.</span>
                  </div>
                  <div className="flex flex-col items-center space-y-2 p-4 rounded-xl bg-gray-50">
                    <ChefHat className="w-6 h-6 text-[#96cc39]" />
                    <span className="text-sm text-gray-500">{t('recipes.difficulty')}</span>
                    <span className="font-semibold">{translatedDifficulty}</span>
                  </div>
                  <div className="flex flex-col items-center space-y-2 p-4 rounded-xl bg-gray-50">
                    <Timer className="w-6 h-6 text-[#96cc39]" />
                    <span className="text-sm text-gray-500">{t('recipes.preparation')}</span>
                    <span className="font-semibold">{recipe.prepTime || '20 min'}</span>
                  </div>
                </div>

                <div className="flex space-x-4 mb-8">
                  <button
                    onClick={() => setActiveTab('ingredients')}
                    className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
                      activeTab === 'ingredients'
                        ? 'bg-[#96cc39] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {t('recipes.ingredients')}
                  </button>
                  <button
                    onClick={() => setActiveTab('instructions')}
                    className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
                      activeTab === 'instructions'
                        ? 'bg-[#96cc39] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {t('recipes.instructions')}
                  </button>
                </div>

                {activeTab === 'ingredients' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <ul className="space-y-4">
                      {translatedIngredients.map((ingredient, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center space-x-4 py-2 border-b border-gray-100"
                        >
                          <div className="w-2 h-2 rounded-full bg-[#96cc39]" />
                          <span className="text-gray-700">{ingredient}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )}

                {activeTab === 'instructions' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <ol className="space-y-6">
                      {translatedInstructions.map((instruction, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex space-x-6"
                        >
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#96cc39]/10 flex items-center justify-center text-[#96cc39] font-semibold">
                            {index + 1}
                          </div>
                          <div className="flex-grow pt-1">
                            <p className="text-gray-700 leading-relaxed">{instruction}</p>
                          </div>
                        </motion.li>
                      ))}
                    </ol>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Recipe;
