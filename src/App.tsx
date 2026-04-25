import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Sparkles, ChefHat, Clock, ChevronRight, GraduationCap, Heart, Filter as FilterIcon, RotateCcw } from 'lucide-react';
import IngredientInput from './components/IngredientInput';
import { generateRecipes } from './services/geminiService';
import { Recipe, View, Filter } from './types';

export default function App() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [activeView, setActiveView] = useState<View>('discover');
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [activeFilter, setActiveFilter] = useState<Filter>('all');
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const handleDiscover = async (ingredients: string[]) => {
    setActiveView('discover');
    setLoading(true);
    setError(null);
    try {
      const data = await generateRecipes(ingredients);
      setRecipes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const toggleSaveRecipe = (recipe: Recipe) => {
    if (savedRecipes.find(r => r.id === recipe.id)) {
      setSavedRecipes(savedRecipes.filter(r => r.id !== recipe.id));
    } else {
      setSavedRecipes([...savedRecipes, recipe]);
    }
  };

  const filteredRecipes = (activeView === 'discover' ? recipes : savedRecipes).filter(r => 
    activeFilter === 'all' || r.difficulty === activeFilter
  );

  const uniqueConcepts: Recipe['cookingConcept'][] = Array.from(
    new Map<string, Recipe['cookingConcept']>(savedRecipes.map(r => [r.cookingConcept.title, r.cookingConcept])).values()
  );

  return (
    <div className="min-h-screen bg-natural-bg text-natural-text font-sans selection:bg-terracotta/20 flex flex-col">
      <header className="flex flex-col sm:flex-row justify-between items-center px-6 md:px-12 pt-6 md:pt-10 pb-6 flex-shrink-0 gap-4">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveView('discover')}>
          <div className="w-10 h-10 bg-sage rounded-full flex items-center justify-center">
             <ChefHat className="text-white w-5 h-5" />
          </div>
          <span className="text-2xl font-serif italic font-bold tracking-tight text-natural-heading">PantryChef</span>
        </div>
        <nav className="flex gap-4 sm:gap-10 text-[10px] font-bold uppercase tracking-widest text-natural-muted">
          <button 
            onClick={() => setActiveView('discover')}
            className={`${activeView === 'discover' ? 'text-sage border-b-2 border-sage pb-1' : 'hover:text-sage transition-colors'}`}
          >
            Discover
          </button>
          <button 
            onClick={() => setActiveView('kitchen')}
            className={`${activeView === 'kitchen' ? 'text-sage border-b-2 border-sage pb-1' : 'hover:text-sage transition-colors'}`}
          >
            Kitchen ({savedRecipes.length})
          </button>
          <button 
            onClick={() => setActiveView('library')}
            className={`${activeView === 'library' ? 'text-sage border-b-2 border-sage pb-1' : 'hover:text-sage transition-colors'}`}
          >
            Library
          </button>
        </nav>
        <div className="hidden sm:flex w-10 h-10 rounded-full border border-border-soft items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-terracotta"></div>
        </div>
      </header>

      <main className="flex-1 flex flex-col md:flex-row px-6 md:px-12 pb-12 gap-8 md:gap-10">
        {/* Left Side: Pantry Panel */}
        <section className="w-full md:w-[320px] flex flex-col flex-shrink-0">
          <div className="bg-pantry rounded-[2rem] md:rounded-[40px] p-6 md:p-8 h-full flex flex-col shadow-sm border border-border-soft/50 shadow-natural-text/5">
            <IngredientInput onIngredientsChange={handleDiscover} isLoading={loading} />
            
            <div className="mt-8 p-4 bg-terracotta/10 rounded-2xl border border-terracotta/20">
              <p className="text-[10px] text-terracotta uppercase font-bold tracking-wider mb-1">Challenge Note</p>
              <p className="text-sm text-natural-text italic leading-snug">The 2nd Innings Challenge: Mastering concepts through intentional cooking.</p>
            </div>
          </div>
        </section>

        {/* Right Side: Results */}
        <section className="flex-1 flex flex-col min-h-[400px]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 flex-shrink-0 gap-4">
            <div>
              <p className="text-natural-muted text-xs uppercase tracking-widest font-bold mb-2">
                {activeView === 'discover' ? 'Suggestions for you' : activeView === 'kitchen' ? 'Your Stashed Flavors' : 'The Knowledge Base'}
              </p>
              <h1 className="text-3xl md:text-4xl font-serif leading-tight text-natural-heading">
                {activeView === 'library' ? (
                  <>Technique <span className="italic font-normal">Dictionary</span></>
                ) : filteredRecipes.length > 0 ? (
                  <>{activeView === 'discover' ? 'Discovered' : 'Saved'} <span className="italic font-normal">{filteredRecipes.length} Recipes</span></>
                ) : (
                  <>Ready to <span className="italic font-normal">Begin?</span></>
                )}
              </h1>
            </div>
            {(activeView !== 'library') && (
               <div className="flex w-full sm:w-auto gap-4 relative">
                  <div className="relative flex-1 sm:flex-none">
                    <button 
                      onClick={() => setShowFilterMenu(!showFilterMenu)}
                      className={`w-full sm:w-auto px-6 py-3 rounded-full border border-border-soft text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 ${activeFilter !== 'all' ? 'bg-sage text-white' : 'hover:bg-white'}`}
                    >
                      <FilterIcon size={12} />
                      {activeFilter === 'all' ? 'Filter' : activeFilter}
                    </button>
                    
                    <AnimatePresence>
                      {showFilterMenu && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-border-soft overflow-hidden z-20"
                        >
                          {(['all', 'Beginner', 'Intermediate', 'Advanced'] as Filter[]).map(f => (
                            <button
                              key={f}
                              onClick={() => { setActiveFilter(f); setShowFilterMenu(false); }}
                              className={`w-full px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest hover:bg-pantry transition-colors ${activeFilter === f ? 'text-sage' : 'text-natural-muted'}`}
                            >
                              {f}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  {activeView === 'discover' && (
                    <button 
                      onClick={() => { setRecipes([]); setActiveFilter('all'); }}
                      className="px-6 py-3 rounded-full bg-sage text-white text-[10px] font-bold uppercase tracking-widest hover:brightness-110 transition-colors shadow-lg shadow-sage/20 flex items-center gap-2"
                    >
                      <RotateCcw size={12} />
                      Reset Pantry
                    </button>
                  )}
               </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <AnimatePresence mode="wait">
              {activeView === 'library' ? (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-8 pb-8"
                >
                  {uniqueConcepts.length > 0 ? uniqueConcepts.map((concept, idx) => (
                    <motion.div 
                      key={concept.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-white rounded-[32px] p-8 border border-border-soft shadow-sm hover:shadow-md transition-shadow flex flex-col space-y-4"
                    >
                      <div className="w-12 h-12 bg-pantry rounded-2xl flex items-center justify-center text-sage">
                        <GraduationCap size={24} />
                      </div>
                      <h3 className="text-xl font-serif font-bold text-natural-heading">{concept.title}</h3>
                      <p className="text-natural-muted text-sm leading-relaxed">{concept.description}</p>
                      <div className="pt-4 border-t border-border-soft">
                        <p className="text-[10px] font-bold text-terracotta uppercase tracking-[0.2em] mb-1">Mastery Impact</p>
                        <p className="text-xs text-natural-text italic">{concept.whyItMatters}</p>
                      </div>
                    </motion.div>
                  )) : (
                    <div className="col-span-2 h-64 flex flex-col items-center justify-center text-center space-y-4 bg-white rounded-[40px] border border-border-soft/50">
                      <BookOpen className="text-border-soft w-12 h-12" />
                      <p className="text-natural-muted max-w-xs italic">Explore recipes and save them to build your personal technique library.</p>
                    </div>
                  )}
                </motion.div>
              ) : loading ? (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center space-y-4"
                >
                  <div className="w-16 h-1 bg-border-soft rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-sage" 
                      animate={{ x: [-64, 64] }} 
                      transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    />
                  </div>
                  <p className="text-natural-muted italic font-serif">Curating professional techniques...</p>
                </motion.div>
              ) : filteredRecipes.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-8 pb-8"
                >
                  {filteredRecipes.map((recipe, idx) => (
                    <RecipeCard 
                      key={recipe.id} 
                      recipe={recipe} 
                      index={idx}
                      onClick={() => setSelectedRecipe(recipe)}
                    />
                  ))}
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-white rounded-[40px] border border-border-soft/50 space-y-4">
                  <ChefHat className="text-border-soft w-16 h-16" />
                  <div className="space-y-1">
                    <h3 className="text-2xl font-serif italic text-natural-heading">
                      {activeView === 'discover' ? 'Your Kitchen is Silent' : 'Stash is Empty'}
                    </h3>
                    <p className="text-natural-muted max-w-xs mx-auto text-sm">
                      {activeView === 'discover' ? 'Add ingredients to discover how to master them.' : 'Save recipes to your kitchen to access them later.'}
                    </p>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </main>

      {/* Decorative Footer bar as per theme */}
      <div className="h-4 w-full bg-pantry flex-shrink-0"></div>

      {/* Recipe Modal */}
      <AnimatePresence>
        {selectedRecipe && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRecipe(null)}
              className="absolute inset-0 bg-natural-heading/60 backdrop-blur-sm"
            />
            <motion.div
              layoutId={`card-${selectedRecipe.id}`}
              className="relative w-full max-w-5xl max-h-[90vh] bg-natural-bg rounded-[40px] overflow-hidden shadow-[0_32px_64px_-16px_rgba(45,42,38,0.3)] flex flex-col lg:flex-row"
            >
              <div className="w-full lg:w-[40%] bg-pantry flex flex-col border-b lg:border-b-0 lg:border-r border-border-soft">
                <div className="h-64 lg:h-72 w-full relative bg-stone-200">
                  <div className="absolute inset-0 bg-sage/5 animate-pulse" />
                  <ImageWithFallback 
                    src={`https://source.unsplash.com/featured/1200x800?food,${encodeURIComponent(selectedRecipe.imageKeyword?.split(',')[0] || 'dish')}`}
                    alt={selectedRecipe.title}
                    className="w-full h-full object-cover relative z-10"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-pantry via-transparent to-transparent z-20"></div>
                </div>
                <div className="p-8 lg:p-12 space-y-8 overflow-y-auto flex-1">
                  <div className="flex items-center gap-2 text-terracotta font-bold text-[10px] uppercase tracking-[0.2em]">
                    <GraduationCap size={18} />
                    Mastery Concept
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-3xl font-serif italic font-bold text-natural-heading leading-tight">{selectedRecipe.cookingConcept.title}</h3>
                    <p className="text-natural-text/80 leading-relaxed text-sm lg:text-base">{selectedRecipe.cookingConcept.description}</p>
                  </div>
                  <div className="p-6 bg-white rounded-3xl border border-border-soft shadow-sm">
                    <p className="text-[10px] font-bold text-terracotta uppercase tracking-wider mb-2">Why it matters</p>
                    <p className="text-sm text-natural-text italic leading-relaxed">{selectedRecipe.cookingConcept.whyItMatters}</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 p-8 lg:p-14 overflow-y-auto space-y-10">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <h2 className="text-4xl font-serif font-bold tracking-tight text-natural-heading">{selectedRecipe.title}</h2>
                    <div className="flex items-center gap-4 text-[10px] text-natural-muted font-bold tracking-widest uppercase">
                      <span className="flex items-center gap-1.5"><Clock size={14} className="text-sage" /> {selectedRecipe.timeEstimate}</span>
                      <span className="px-2 py-0.5 rounded-md bg-sage/10 text-sage">{selectedRecipe.difficulty}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedRecipe(null)}
                    className="p-3 hover:bg-pantry rounded-full transition-colors text-natural-muted"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.25em] text-natural-muted pb-2 border-b border-border-soft">The Essentials</h4>
                    <ul className="space-y-3">
                      {selectedRecipe.ingredients.map((ing, i) => (
                        <li key={i} className="flex items-center gap-3 text-natural-text text-sm group">
                          <div className="w-1.5 h-1.5 bg-terracotta rounded-full group-hover:scale-150 transition-transform" />
                          {ing}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-6">
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.25em] text-natural-muted pb-2 border-b border-border-soft">Method</h4>
                    <div className="space-y-6">
                      {selectedRecipe.instructions.map((step, i) => (
                        <div key={i} className="flex gap-4 group">
                          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-pantry flex items-center justify-center text-[10px] font-bold text-natural-muted group-hover:bg-sage group-hover:text-white transition-all">
                            {i + 1}
                          </span>
                          <p className="text-natural-text text-sm leading-relaxed pt-1">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-8 flex justify-center gap-4">
                  <button 
                    onClick={() => toggleSaveRecipe(selectedRecipe)}
                    className={`flex-1 max-w-[200px] py-4 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all flex items-center justify-center gap-2 ${savedRecipes.find(r => r.id === selectedRecipe.id) ? 'bg-terracotta text-white border-terracotta' : 'bg-white text-natural-heading border-border-soft'}`}
                  >
                    <Heart size={14} fill={savedRecipes.find(r => r.id === selectedRecipe.id) ? 'white' : 'none'} />
                    {savedRecipes.find(r => r.id === selectedRecipe.id) ? 'Saved to Kitchen' : 'Save Recipe'}
                  </button>
                  <button 
                    onClick={() => setSelectedRecipe(null)}
                    className="flex-1 max-w-[200px] py-4 bg-sage text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-xl shadow-sage/20 hover:brightness-110 transition-all"
                  >
                    Close & Start Cooking
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface RecipeCardProps {
  key?: React.Key;
  recipe: Recipe;
  index: number;
  onClick: () => void;
}

function RecipeCard({ recipe, index, onClick }: RecipeCardProps) {
  const imageUrl = `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop&sig=${recipe.id}`; // Fallback or better logic
  // Using a more dynamic source for the card too
  const dishImage = `https://source.unsplash.com/featured/800x600?food,${encodeURIComponent(recipe.imageKeyword?.split(',')[0] || 'chef')}`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -6 }}
      onClick={onClick}
      className="group cursor-pointer bg-white rounded-[32px] p-6 border border-border-soft shadow-sm hover:shadow-xl hover:shadow-natural-heading/5 transition-all flex flex-col h-[420px]"
    >
      <div className="w-full h-44 bg-pantry rounded-[24px] mb-6 flex items-center justify-center relative overflow-hidden group-hover:brightness-105 transition-all">
        <div className="absolute inset-0 bg-sage/5 animate-pulse" />
        <ImageWithFallback 
          src={dishImage} 
          alt={recipe.title}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-natural-heading/70 via-natural-heading/20 to-transparent"></div>
        <div className="relative z-10 flex flex-col items-center justify-end h-full w-full p-4">
          <span className="text-white font-serif italic text-xs font-medium drop-shadow-md">{recipe.timeEstimate}</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
             <div className="flex items-center gap-2 text-terracotta font-bold text-[9px] uppercase tracking-widest">
               <BookOpen size={12} />
               {recipe.cookingConcept.title}
             </div>
             <h3 className="text-xl font-serif font-bold text-natural-heading leading-tight group-hover:text-sage transition-colors">
               {recipe.title}
             </h3>
          </div>
          <span className="text-sage text-xs font-bold whitespace-nowrap bg-sage/5 px-2 py-0.5 rounded-md">{recipe.difficulty}</span>
        </div>
        
        <p className="text-natural-muted text-xs line-clamp-3 leading-relaxed">
          {recipe.description}
        </p>

        <div className="mt-auto pt-6 flex items-center justify-between">
          <div className="flex gap-2">
            <span className="text-[9px] uppercase font-bold text-terracotta bg-terracotta/10 px-3 py-1.5 rounded-lg">Pantry Hero</span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-sage border-b border-sage/30 group-hover:border-sage leading-none transition-all">
            View Recipe
          </span>
        </div>
      </div>
    </motion.div>
  );
}


function X({ size, className }: { size: number; className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M18 6 6 18" /><path d="m6 6 12 12" />
    </svg>
  );
}

function ImageWithFallback({ src, alt, className }: { src: string; alt: string; className: string }) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // High-reliability static Unsplash food photos
  const fallback = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop";
  
  return (
    <img 
      src={error ? fallback : src} 
      alt={alt} 
      className={`${className} ${loading ? 'opacity-0' : 'opacity-100'}`}
      onLoad={() => setLoading(false)}
      onError={() => {
        if (!error) setError(true);
        setLoading(false);
      }}
      referrerPolicy="no-referrer"
    />
  );
}
