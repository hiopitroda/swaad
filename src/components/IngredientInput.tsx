import React, { useState } from 'react';
import { Plus, X, ChefHat } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface IngredientInputProps {
  onIngredientsChange: (ingredients: string[]) => void;
  isLoading: boolean;
}

export default function IngredientInput({ onIngredientsChange, isLoading }: IngredientInputProps) {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState('');

  const staples = ['Olive oil', 'Salt', 'Black pepper', 'Garlic', 'Onion', 'Lemon'];

  const addIngredient = (name: string, e?: React.FormEvent) => {
    e?.preventDefault();
    const cleanName = name.trim();
    if (cleanName && !ingredients.includes(cleanName)) {
      const newIngredients = [...ingredients, cleanName];
      setIngredients(newIngredients);
      setCurrentInput('');
    }
  };

  const removeIngredient = (name: string) => {
    const newIngredients = ingredients.filter(i => i !== name);
    setIngredients(newIngredients);
  };

  return (
    <div className="w-full space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-serif italic text-natural-heading">In Your Pantry</h2>
        <p className="text-natural-muted text-[10px] uppercase tracking-widest font-bold">Add ingredients to start</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <AnimatePresence>
          {ingredients.map((ing) => (
            <motion.span
              key={ing}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="flex items-center gap-2 px-4 py-2 bg-white text-natural-text rounded-full text-xs font-medium border border-border-soft shadow-sm"
            >
              {ing}
              <button 
                onClick={() => removeIngredient(ing)} 
                className="text-natural-muted hover:text-sage transition-colors opacity-40 hover:opacity-100"
              >
                <X size={14} />
              </button>
            </motion.span>
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-4 pt-4 border-t border-border-soft/50 space-y-4">
        <div className="flex flex-wrap gap-1">
          {staples.filter(s => !ingredients.includes(s)).slice(0, 4).map(s => (
            <button 
              key={s} 
              onClick={() => addIngredient(s)}
              className="text-[9px] uppercase tracking-tighter bg-sage/5 text-sage px-2 py-1 rounded-md hover:bg-sage/10 transition-colors"
            >
              + {s}
            </button>
          ))}
        </div>

        <form onSubmit={(e) => addIngredient(currentInput, e)} className="relative">
          <input
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            placeholder="+ Add ingredient"
            className="w-full bg-white border border-border-soft rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-sage focus:border-sage transition-all placeholder:text-natural-muted/50"
          />
        </form>

        <button
          onClick={() => onIngredientsChange(ingredients)}
          disabled={ingredients.length < 1 || isLoading}
          className={`
            w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-bold uppercase tracking-widest transition-all
            ${ingredients.length >= 1 && !isLoading
              ? 'bg-sage text-white shadow-md hover:brightness-110'
              : 'bg-white border border-border-soft text-natural-muted opacity-50 cursor-not-allowed'}
          `}
        >
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
            >
              <ChefHat size={18} />
            </motion.div>
          ) : (
            <ChefHat size={18} />
          )}
          {isLoading ? 'Brewing...' : 'Discover Recipes'}
        </button>

        {ingredients.length > 0 && ingredients.length < 3 && (
          <div className="p-4 bg-terracotta/5 rounded-2xl border border-terracotta/20 animate-pulse">
            <p className="text-[10px] text-terracotta uppercase font-bold tracking-wider mb-1">Pantry Insight</p>
            <p className="text-xs text-natural-text italic leading-relaxed">Add at least 3 items for more complex flavor profiles.</p>
          </div>
        )}
      </div>
    </div>
  );
}
