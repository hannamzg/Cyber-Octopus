import React, { useState } from 'react';
import { cyberData, categoryMeta } from '../data/db';
import { ChevronRight, ChevronDown, Layers, Box, Zap, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function buildTree() {
  const nodeMap = {};
  cyberData.nodes.forEach(n => { nodeMap[n.id] = { ...n, children: [] }; });
  cyberData.links.forEach(l => {
    const srcId = typeof l.source === 'object' ? l.source.id : l.source;
    const tgtId = typeof l.target === 'object' ? l.target.id : l.target;
    if (nodeMap[srcId] && nodeMap[tgtId]) nodeMap[srcId].children.push(nodeMap[tgtId]);
  });
  return nodeMap['root'];
}

function GroupIcon({ group }) {
  if (group === 'category') return <Layers className="w-3.5 h-3.5 text-cyan-400 shrink-0" />;
  if (group === 'sub')      return <Box className="w-3.5 h-3.5 text-blue-400 shrink-0" />;
  return <Zap className="w-3.5 h-3.5 text-green-400 shrink-0" />;
}

function TreeNode({ node, onSelectTool, onSelectCategory, depth = 0 }) {
  const [open, setOpen] = useState(false);
  const isTool = node.group === 'tool';
  const isCategory = node.group === 'category';
  const hasChildren = node.children && node.children.length > 0;
  const recCount = isCategory && categoryMeta[node.id] ? categoryMeta[node.id].recommended.length : 0;

  return (
    <div>
      <button
        onClick={() => {
          if (isTool) {
            onSelectTool(node.toolId);
          } else if (isCategory) {
            onSelectCategory(node.id);
            setOpen(o => !o);
          } else {
            setOpen(o => !o);
          }
        }}
        className={`w-full flex items-center gap-2 rounded-lg text-sm py-1.5 px-2 transition-all group
          ${isTool
            ? (node.recommended
                ? 'hover:bg-yellow-500/10 text-yellow-300/80 hover:text-yellow-300'
                : 'hover:bg-green-500/10 text-slate-400 hover:text-green-300')
            : 'hover:bg-slate-800/60 text-slate-300 hover:text-white font-medium'}
        `}
        style={{ paddingLeft: `${8 + depth * 14}px` }}
      >
        {!isTool && hasChildren && (
          <span className="text-slate-600 group-hover:text-slate-400 shrink-0">
            {open ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          </span>
        )}
        {!hasChildren && !isTool && <span className="w-3 shrink-0" />}

        {isTool && node.recommended
          ? <Star className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
          : <GroupIcon group={node.group} />
        }

        <span className="truncate">{node.name}</span>

        {isCategory && recCount > 0 && (
          <span className="ml-auto flex items-center gap-1 text-xs text-yellow-400/70 bg-yellow-500/10 border border-yellow-500/20 px-1.5 py-0.5 rounded-full shrink-0">
            <Star className="w-2.5 h-2.5" />{recCount}
          </span>
        )}
        {!isTool && hasChildren && !isCategory && (
          <span className="ml-auto text-xs text-slate-600 bg-slate-800 px-1.5 py-0.5 rounded-full shrink-0">
            {node.children.length}
          </span>
        )}
      </button>

      <AnimatePresence initial={false}>
        {open && hasChildren && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            {node.children.map(child => (
              <TreeNode
                key={child.id}
                node={child}
                depth={depth + 1}
                onSelectTool={onSelectTool}
                onSelectCategory={onSelectCategory}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CategorySidebar({ onSelectTool, onSelectCategory }) {
  const tree = buildTree();
  if (!tree) return null;
  const totalTools = cyberData.nodes.filter(n => n.group === 'tool').length;
  const totalRec = cyberData.nodes.filter(n => n.recommended).length;

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-slate-800 space-y-1">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Browse Categories</p>
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <Star className="w-3 h-3 text-yellow-500" />
          <span>{totalRec} recommended tools</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
        {tree.children.map(cat => (
          <TreeNode
            key={cat.id}
            node={cat}
            onSelectTool={onSelectTool}
            onSelectCategory={onSelectCategory}
            depth={0}
          />
        ))}
      </div>
      <div className="px-4 py-3 border-t border-slate-800">
        <p className="text-xs text-slate-600 text-center">{totalTools} tools indexed</p>
      </div>
    </div>
  );
}
