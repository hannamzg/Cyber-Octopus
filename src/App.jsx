import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Network, Menu, X, Shield, Star } from 'lucide-react';
import CyberMap from './components/CyberMap';
import ToolDetails from './components/ToolDetails';
import CategoryDetails from './components/CategoryDetails';
import CategorySidebar from './components/CategorySidebar';
import SearchBar from './components/SearchBar';
import { cyberData } from './data/db';

const totalTools = cyberData.nodes.filter(n => n.group === 'tool').length;
const totalRec = cyberData.nodes.filter(n => n.recommended).length;

function App() {
  const [selectedToolId, setSelectedToolId]       = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [sidebarOpen, setSidebarOpen]             = useState(true);

  const handleSelectTool = (id) => {
    setSelectedCategoryId(null);
    setSelectedToolId(id);
  };

  const handleSelectCategory = (id) => {
    setSelectedToolId(null);
    setSelectedCategoryId(id);
  };

  const closeAll = () => {
    setSelectedToolId(null);
    setSelectedCategoryId(null);
  };

  return (
    <div className="flex flex-col w-screen h-screen bg-slate-950 text-slate-100 overflow-hidden">

      {/* ── TOP BAR ── */}
      <header className="shrink-0 flex items-center gap-3 px-4 h-14 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 z-20">
        <button
          onClick={() => setSidebarOpen(o => !o)}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-900/40">
            <Network className="w-4 h-4 text-white" />
          </div>
          <div className="hidden sm:block">
            <p className="font-bold text-white text-sm leading-none">Cyber Octopus</p>
            <p className="text-slate-500 text-xs leading-none mt-0.5">{totalTools} tools</p>
          </div>
        </div>

        <div className="w-px h-5 bg-slate-800 mx-1 hidden sm:block" />

        <div className="flex-1 max-w-2xl">
          <SearchBar onSelectTool={handleSelectTool} />
        </div>

        <div className="hidden md:flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-3 py-1">
            <Star className="w-3 h-3 text-yellow-400" />
            <span className="text-yellow-400 text-xs font-medium">{totalRec} recommended</span>
          </div>
          <div className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 rounded-full px-3 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 text-xs font-medium">Offline</span>
          </div>
        </div>
      </header>

      {/* ── BODY ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left Sidebar */}
        <AnimatePresence initial={false}>
          {sidebarOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 260, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="shrink-0 overflow-hidden border-r border-slate-800/80 bg-slate-900/50"
            >
              <div className="w-[260px] h-full">
                <CategorySidebar
                  onSelectTool={handleSelectTool}
                  onSelectCategory={handleSelectCategory}
                />
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Mind Map */}
        <main className="flex-1 relative overflow-hidden">
          <CyberMap
            onNodeClick={handleSelectTool}
            onCategoryClick={handleSelectCategory}
            highlightToolId={selectedToolId}
          />

          {!selectedToolId && !selectedCategoryId && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none">
              <div className="bg-slate-900/70 backdrop-blur-sm border border-slate-700/50 px-4 py-2 rounded-full text-xs text-slate-400 flex items-center gap-2 shadow-lg whitespace-nowrap">
                <Shield className="w-3.5 h-3.5 text-cyan-500" />
                Click <span className="text-cyan-400 font-semibold">categories</span> for overview &bull; Click <span className="text-green-400 font-semibold">green/gold nodes</span> for tool details
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ── RIGHT PANELS (mutually exclusive) ── */}
      <ToolDetails
        toolId={selectedToolId}
        onClose={closeAll}
      />
      <CategoryDetails
        categoryId={selectedCategoryId}
        onSelectTool={handleSelectTool}
        onClose={closeAll}
      />
    </div>
  );
}

export default App;
