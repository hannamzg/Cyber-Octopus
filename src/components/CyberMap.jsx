import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { cyberData } from '../data/db';
import { Home, ChevronRight } from 'lucide-react';

// Pre-build a lookup: parentId → childIds
function buildChildMap() {
  const map = {};
  cyberData.links.forEach(l => {
    const src = typeof l.source === 'object' ? l.source.id : l.source;
    const tgt = typeof l.target === 'object' ? l.target.id : l.target;
    if (!map[src]) map[src] = [];
    map[src].push(tgt);
  });
  return map;
}
const CHILD_MAP = buildChildMap();
const NODE_MAP  = Object.fromEntries(cyberData.nodes.map(n => [n.id, n]));

export default function CyberMap({ onNodeClick, onCategoryClick, highlightToolId }) {
  const fgRef        = useRef();
  const containerRef = useRef();
  const [dimensions, setDimensions]       = useState({ width: 100, height: 100 });
  const [hoveredNode, setHoveredNode]     = useState(null);

  // Accordion state: only one category + one sub-category open at a time
  const [activeCategory, setActiveCategory] = useState(null); // category node id
  const [activeSub,      setActiveSub]      = useState(null); // sub-category node id

  // Resize observer
  useEffect(() => {
    const ro = new ResizeObserver(() => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    });
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // Build visible graph from accordion state
  const graphData = useMemo(() => {
    const visible = new Set(['root']);
    // Always show root's direct children (categories)
    (CHILD_MAP['root'] || []).forEach(id => visible.add(id));
    // Show active category's children (sub-categories)
    if (activeCategory) {
      (CHILD_MAP[activeCategory] || []).forEach(id => visible.add(id));
    }
    // Show active sub-category's children (tools)
    if (activeSub) {
      (CHILD_MAP[activeSub] || []).forEach(id => visible.add(id));
    }

    const nodes = cyberData.nodes.filter(n => visible.has(n.id));
    const links = cyberData.links.filter(l => {
      const s = typeof l.source === 'object' ? l.source.id : l.source;
      const t = typeof l.target === 'object' ? l.target.id : l.target;
      return visible.has(s) && visible.has(t);
    });
    return { nodes, links };
  }, [activeCategory, activeSub]);

  // Physics setup
  useEffect(() => {
    if (!fgRef.current) return;
    fgRef.current.d3Force('charge').strength(-2000); // Stronger repulsion for bigger gaps
    fgRef.current.d3Force('link').distance(link => {
      const src = typeof link.source === 'object' ? link.source : (NODE_MAP[link.source] || {});
      if (src.group === 'root')     return 380; // Increased from 220
      if (src.group === 'category') return 280; // Increased from 160
      if (src.group === 'sub')      return 180; // Increased from 90
      return 120; // Increased from 60
    });
  }, []);

  // Auto-zoom to fit whenever visible graph changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fgRef.current?.zoomToFit(600, 80);
    }, 400); // wait for physics to settle a bit
    return () => clearTimeout(timer);
  }, [graphData]);

  // Handle node click with accordion logic
  const handleNodeClick = useCallback((node) => {
    if (node.group === 'tool' && node.toolId) {
      onNodeClick(node.toolId);
      return;
    }
    if (node.group === 'category') {
      const next = activeCategory === node.id ? null : node.id;
      setActiveCategory(next);
      setActiveSub(null); // reset sub when changing category
      if (next) onCategoryClick(node.id);
      return;
    }
    if (node.group === 'sub') {
      const next = activeSub === node.id ? null : node.id;
      setActiveSub(next);
      return;
    }
  }, [activeCategory, activeSub, onNodeClick, onCategoryClick]);

  const handleReset = () => {
    setActiveCategory(null);
    setActiveSub(null);
    setTimeout(() => fgRef.current?.zoomToFit(600, 80), 200);
  };

  // Breadcrumb
  const breadcrumb = useMemo(() => {
    const parts = [{ id: 'root', name: 'Cybersecurity' }];
    if (activeCategory && NODE_MAP[activeCategory]) parts.push(NODE_MAP[activeCategory]);
    if (activeSub && NODE_MAP[activeSub]) parts.push(NODE_MAP[activeSub]);
    return parts;
  }, [activeCategory, activeSub]);

  // Node drawing
  const drawNode = useCallback((node, ctx, globalScale) => {
    const isHovered     = hoveredNode?.id === node.id;
    const isHighlighted = highlightToolId && node.toolId === highlightToolId;
    const isRecommended = node.recommended;
    const isActive      = node.id === activeCategory || node.id === activeSub;

    const label    = node.name;
    const fontSize = Math.max(9, 13 / globalScale);
    ctx.font = `${node.group === 'root' ? 'bold ' : ''}${fontSize}px Cairo, sans-serif`;
    const tw = ctx.measureText(label).width;
    const pH = fontSize * 0.8, pV = fontSize * 0.5;
    const w = tw + pH * 2, h = fontSize + pV * 2;
    const x = node.x - w / 2, y = node.y - h / 2, r = h / 2;

    const baseColor = isHighlighted ? '#facc15'
      : isActive      ? '#f97316'   // orange = currently open
      : isRecommended ? '#facc15'
      : node.color;

    // Shadow / glow
    if (isHovered || isHighlighted || isRecommended || isActive) {
      ctx.shadowColor = baseColor;
      ctx.shadowBlur  = 20 / globalScale;
    }

    // Pill
    ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();

    ctx.fillStyle = isHighlighted
      ? 'rgba(250,204,21,0.18)'
      : isActive
      ? 'rgba(249,115,22,0.15)'
      : isHovered
      ? 'rgba(255,255,255,0.06)'
      : isRecommended
      ? 'rgba(250,204,21,0.08)'
      : 'rgba(15,23,42,0.9)';
    ctx.fill();

    ctx.lineWidth   = (isHighlighted || isActive || isHovered ? 2 : 1) / globalScale;
    ctx.strokeStyle = baseColor;
    ctx.stroke();
    ctx.shadowBlur  = 0;

    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle    = isHighlighted ? '#fef08a'
      : isActive      ? '#fed7aa'
      : isRecommended ? '#fde68a'
      : node.group === 'tool' ? '#86efac' : '#f1f5f9';
    ctx.fillText(label, node.x, node.y);

    node.__bckgDimensions = [w, h];
  }, [hoveredNode, highlightToolId, activeCategory, activeSub]);

  const nodePointerAreaPaint = useCallback((node, color, ctx) => {
    ctx.fillStyle = color;
    const d = node.__bckgDimensions;
    if (d) ctx.fillRect(node.x - d[0] / 2, node.y - d[1] / 2, d[0], d[1]);
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden cursor-crosshair">

      {/* ── Breadcrumb ── */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <div className="flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 px-4 py-2 rounded-full text-xs shadow-lg whitespace-nowrap">
          {breadcrumb.map((part, i) => (
            <React.Fragment key={part.id}>
              {i > 0 && <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />}
              <span className={i === breadcrumb.length - 1 ? 'text-cyan-400 font-semibold' : 'text-slate-400'}>
                {part.name}
              </span>
            </React.Fragment>
          ))}
          {breadcrumb.length === 1 && (
            <span className="text-slate-500 ml-1">— click a category to explore</span>
          )}
        </div>
      </div>

      <ForceGraph2D
        ref={fgRef}
        graphData={graphData}
        width={dimensions.width}
        height={dimensions.height}
        backgroundColor="#020617"
        nodeCanvasObject={drawNode}
        nodePointerAreaPaint={nodePointerAreaPaint}
        onNodeHover={setHoveredNode}
        onNodeClick={handleNodeClick}
        linkColor={(link) => {
          const src = typeof link.source === 'object' ? link.source : {};
          if (src.group === 'root')     return 'rgba(168,85,247,0.35)';
          if (src.group === 'category') return 'rgba(6,182,212,0.35)';
          return 'rgba(59,130,246,0.25)';
        }}
        linkWidth={1.2}
        linkDirectionalParticles={1}
        linkDirectionalParticleWidth={2}
        linkDirectionalParticleColor={(link) => {
          const src = typeof link.source === 'object' ? link.source : {};
          if (src.group === 'root') return '#a855f7';
          return '#06b6d4';
        }}
        linkDirectionalParticleSpeed={0.005}
        cooldownTime={2500}
      />

      {/* Legend */}
      <div className="absolute bottom-14 left-5 bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl p-3 space-y-1.5 text-xs text-slate-400">
        {[
          ['#a855f7', 'Root'],
          ['#06b6d4', 'Category'],
          ['#f97316', 'Active / Open'],
          ['#3b82f6', 'Sub-category'],
          ['#22c55e', 'Tool'],
          ['#facc15', '★ Recommended'],
        ].map(([color, label]) => (
          <div key={label} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: color }} />
            {label}
          </div>
        ))}
      </div>

      {/* Reset */}
      <button
        onClick={handleReset}
        className="absolute bottom-5 left-5 flex items-center gap-2 bg-slate-800/80 backdrop-blur-sm border border-slate-700 hover:border-cyan-500/50 hover:bg-slate-700/80 text-slate-300 hover:text-white rounded-xl px-3 py-2 text-sm transition-all shadow-lg"
      >
        <Home className="w-4 h-4" />
        Reset Map
      </button>
    </div>
  );
}
