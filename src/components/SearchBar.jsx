import React, { useState, useMemo } from 'react';
import { cyberData, toolsDetails } from '../data/db';
import { Search, X, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SearchBar({ onSelectTool }) {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);

  const results = useMemo(() => {
    if (!query.trim() || query.length < 2) return [];
    const q = query.toLowerCase();
    return Object.values(toolsDetails)
      .filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [query]);

  const handleSelect = (tool) => {
    onSelectTool(tool.id);
    setQuery('');
    setFocused(false);
  };

  return (
    <div className="relative w-full max-w-xl">
      <div className={`flex items-center gap-3 bg-slate-800/70 backdrop-blur-md border rounded-xl px-4 py-2.5 transition-all duration-300 ${focused ? 'border-cyan-500/60 shadow-lg shadow-cyan-500/10' : 'border-slate-700/50'}`}>
        <Search className={`w-4 h-4 shrink-0 transition-colors ${focused ? 'text-cyan-400' : 'text-slate-500'}`} />
        <input
          type="text"
          placeholder="Search 1000+ tools..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          className="flex-1 bg-transparent text-slate-200 placeholder-slate-500 text-sm outline-none"
        />
        {query && (
          <button onClick={() => setQuery('')} className="text-slate-500 hover:text-slate-300">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {focused && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 4 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 z-50 bg-slate-900 border border-slate-700/70 rounded-xl shadow-2xl shadow-black/50 overflow-hidden"
          >
            {results.map(tool => (
              <button
                key={tool.id}
                onClick={() => handleSelect(tool)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-800/80 transition-colors border-b border-slate-800 last:border-0 group"
              >
                <div className="w-7 h-7 rounded-lg bg-green-500/10 border border-green-500/30 flex items-center justify-center shrink-0">
                  <Zap className="w-3.5 h-3.5 text-green-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-200 group-hover:text-white truncate">{tool.title}</p>
                  <p className="text-xs text-slate-500 truncate">{tool.category}</p>
                </div>
              </button>
            ))}
          </motion.div>
        )}
        {focused && query.length >= 2 && results.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 4 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute top-full left-0 right-0 z-50 bg-slate-900 border border-slate-700/70 rounded-xl shadow-2xl p-4 text-center text-slate-500 text-sm"
          >
            No tools found for "{query}"
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
