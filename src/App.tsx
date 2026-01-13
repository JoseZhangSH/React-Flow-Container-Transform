import { useState, useCallback, useRef } from 'react';
import { type Node, type Edge, type OnNodeClick } from 'reactflow';
import { FlowCanvas } from './components/FlowCanvas';
import { TransitionLayer } from './components/TransitionLayer';
import type { TransitionState } from './types';
import './App.css';

const initialNodes: Node[] = [
  { id: '1', position: { x: 100, y: 100 }, data: { label: 'Parent Node A (Click to Enter)' }, style: { width: 150, height: 100, background: '#fff', border: '1px solid #ddd', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' } },
  { id: '2', position: { x: 400, y: 100 }, data: { label: 'Parent Node B' }, style: { width: 150, height: 100, background: '#fff', border: '1px solid #ddd', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' } },
];

const subNodes: Node[] = [
  { id: 'sub-1', position: { x: 50, y: 50 }, data: { label: 'Sub Node 1' } },
  { id: 'sub-2', position: { x: 250, y: 150 }, data: { label: 'Sub Node 2' } },
];

const subEdges: Edge[] = [
  { id: 'e-sub-1-2', source: 'sub-1', target: 'sub-2' },
];

function App() {
  const [level, setLevel] = useState<'main' | 'sub'>('main');
  const [transition, setTransition] = useState<TransitionState>({
    fromNodeId: null,
    rect: null,
    isExpanding: false,
    toLevel: null,
  });

  const containerRef = useRef<HTMLDivElement>(null);

  const onNodeClick: OnNodeClick = useCallback((event, node) => {
    if (level === 'main' && node.id === '1') {
      const nodeElement = document.querySelector(`[data-id="${node.id}"]`);
      if (nodeElement) {
        const rect = nodeElement.getBoundingClientRect();
        const containerRect = containerRef.current?.getBoundingClientRect();
        
        if (containerRect) {
          setTransition({
            fromNodeId: node.id,
            rect: {
              left: rect.left - containerRect.left,
              top: rect.top - containerRect.top,
              width: rect.width,
              height: rect.height
            },
            isExpanding: true,
            toLevel: 'sub',
            nodeData: node.data,
          });
          // Note: We don't setLevel('sub') here yet, handleAnimationComplete will do it.
        }
      }
    }
  }, [level]);

  const handleAnimationComplete = () => {
    if (transition.toLevel) {
      setLevel(transition.toLevel as 'main' | 'sub');
    }
    setTransition({
      fromNodeId: null,
      rect: null,
      isExpanding: false,
      toLevel: null,
    });
  };

  const goBack = () => {
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (containerRect) {
      // For shrinking, we switch to 'main' IMMEDIATELY so it's in the background
      setLevel('main');
      
      setTransition({
        fromNodeId: '1',
        rect: { left: 0, top: 0, width: containerRect.width, height: containerRect.height },
        isExpanding: false,
        toLevel: 'main',
        nodeData: { label: 'Parent Node A' }
      });
    }
  };

  return (
    <div className="app-container" ref={containerRef}>
      <div className="canvas-wrapper" style={{ display: level === 'main' ? 'block' : 'none' }}>
        <FlowCanvas nodes={initialNodes} edges={[]} onNodeClick={onNodeClick} />
      </div>

      <div className="canvas-wrapper" style={{ display: level === 'sub' ? 'block' : 'none' }}>
        <div className="sub-canvas-container">
          <button className="back-button" onClick={goBack}>Back to Main</button>
          <FlowCanvas nodes={subNodes} edges={subEdges} onNodeClick={() => {}} />
        </div>
      </div>

      <TransitionLayer 
        transition={transition} 
        onComplete={handleAnimationComplete} 
      />
    </div>
  );
}

export default App;
