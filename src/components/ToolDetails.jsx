import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Copy, Check, X, Shield, BookOpen, AlertCircle, ExternalLink } from 'lucide-react';
import { toolsDetails } from '../data/db';

export default function ToolDetails({ toolId, onClose }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tool = toolId ? toolsDetails[toolId] : null;

  return (
    <AnimatePresence>
      {tool && (
        <>
          {/* Backdrop on mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden"
            onClick={onClose}
          />

          <motion.aside
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="fixed right-0 top-0 h-full w-full max-w-md z-40 flex flex-col bg-slate-950 border-l border-slate-800/80 shadow-2xl shadow-black/60"
          >
            {/* Header */}
            <div className="flex items-start justify-between p-5 border-b border-slate-800 shrink-0">
              <div className="flex items-start gap-3 min-w-0">
                <div className="p-2.5 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-xl border border-purple-500/20 shrink-0 mt-0.5">
                  <Shield className="w-5 h-5 text-purple-400" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-xl font-bold text-white truncate">{tool.title}</h2>
                  <span className="text-xs text-cyan-400 font-medium bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20 inline-block mt-1">
                    {tool.category}
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-all shrink-0 ml-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-5 space-y-6">

                {/* Description */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="w-4 h-4 text-cyan-500" />
                    <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Description</h3>
                  </div>
                  <p className="text-slate-400 leading-relaxed text-sm bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                    {tool.description}
                  </p>
                </section>

                {/* CLI Command */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <Terminal className="w-4 h-4 text-cyan-500" />
                    <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Primary Command</h3>
                  </div>

                  <div className="relative group">
                    {/* Glow effect */}
                    <div className="absolute -inset-px bg-gradient-to-r from-cyan-500/30 to-purple-500/30 rounded-xl opacity-0 group-hover:opacity-100 transition duration-500 blur-sm" />
                    <div className="relative flex items-center gap-3 bg-slate-900 border border-slate-700/60 rounded-xl p-4 group-hover:border-slate-600 transition-colors">
                      <div className="flex-1 overflow-x-auto">
                        <code className="text-green-400 text-sm font-mono whitespace-nowrap">
                          {tool.command}
                        </code>
                      </div>
                      <button
                        onClick={() => handleCopy(tool.command)}
                        className={`shrink-0 p-2 rounded-lg transition-all border ${
                          copied
                            ? 'bg-green-500/10 border-green-500/30 text-green-400'
                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:border-slate-600'
                        }`}
                        title="Copy command"
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  {copied && (
                    <p className="text-xs text-green-400 mt-2 text-center animate-pulse">
                      ✓ Copied to clipboard!
                    </p>
                  )}
                </section>

                {/* Flags */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="w-4 h-4 text-cyan-500" />
                    <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Flags & Options</h3>
                  </div>

                  <div className="space-y-2">
                    {tool.flags.map((flagItem, idx) => (
                      <div key={idx} className="flex gap-3 bg-slate-900/60 border border-slate-800 rounded-lg p-3 hover:border-slate-700 transition-colors">
                        <code className="text-purple-400 font-mono text-xs bg-slate-800 px-2 py-1 rounded-md border border-slate-700 h-fit shrink-0 whitespace-nowrap">
                          {flagItem.flag}
                        </code>
                        <span className="text-slate-400 text-sm leading-relaxed">{flagItem.desc}</span>
                      </div>
                    ))}
                  </div>
                </section>

              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-800 shrink-0">
              <button
                onClick={() => handleCopy(tool.command)}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-semibold py-2.5 rounded-xl transition-all shadow-lg shadow-cyan-900/30 text-sm"
              >
                <Copy className="w-4 h-4" />
                {copied ? 'Copied!' : 'Copy Command'}
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
