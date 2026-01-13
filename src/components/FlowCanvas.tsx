import ReactFlow, { 
  Background, 
  Controls, 
  type Node, 
  type Edge,
  type OnNodeClick
} from 'reactflow';
import 'reactflow/dist/style.css';

interface FlowCanvasProps {
  nodes: Node[];
  edges: Edge[];
  onNodeClick: OnNodeClick;
}

export function FlowCanvas({ nodes, edges, onNodeClick }: FlowCanvasProps) {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodeClick={onNodeClick}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}

