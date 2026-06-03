import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Layers, ChevronRight, Info } from 'lucide-react';
import { categoryMeta, toolsDetails } from '../data/db';

export default function CategoryDetails({ categoryId, onSelectTool, onClose }) {
  const meta = categoryId ? categoryMeta[categoryId] : null;

  const recommendedTools = meta
    ? meta.recommended.map(id => toolsDetails[id]).filter(Boolean)
    : [];

  return (
    <AnimatePresence>
      {meta && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 md:hidden"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="fixed right-0 top-0 h-full w-full max-w-sm z-40 flex flex-col bg-slate-950 border-l border-slate-800/80 shadow-2xl shadow-black/60"
          >
            {/* Header */}
            <div className="flex items-start justify-between p-5 border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/20 rounded-xl shrink-0">
                  <Layers className="w-5 h-5 text-cyan-400" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg font-bold text-white">{meta.name}</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Category Overview</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-all shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="p-5 space-y-6">

                {/* Description */}
                <div className="flex gap-3 bg-slate-900/60 border border-slate-800 rounded-xl p-4">
                  <Info className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                  <p className="text-slate-400 text-sm leading-relaxed">{meta.desc}</p>
                </div>

                {/* Recommended Tools */}
                {recommendedTools.length > 0 && (
                  <section>
                    <div className="flex items-center gap-2 mb-3">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
                        Recommended Tools
                      </h3>
                      <span className="ml-auto text-xs bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-2 py-0.5 rounded-full">
                        {recommendedTools.length} tools
                      </span>
                    </div>

                    <div className="space-y-2">
                      {recommendedTools.map(tool => (
                        <button
                          key={tool.id}
                          onClick={() => { onSelectTool(tool.id); onClose(); }}
                          className="w-full flex items-center gap-3 bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-yellow-500/30 rounded-xl p-3 text-left transition-all group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center shrink-0">
                            <Star className="w-4 h-4 text-yellow-400" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-slate-200 group-hover:text-white truncate">
                              {tool.title}
                            </p>
                            <p className="text-xs text-slate-500 truncate mt-0.5">{tool.category}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-yellow-400 shrink-0 transition-colors" />
                        </button>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
