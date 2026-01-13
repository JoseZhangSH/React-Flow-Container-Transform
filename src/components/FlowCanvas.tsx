import ReactFlow, { 
  Background, 
  Controls, 
  type Node, 
  type Edge,
  type OnNodeClick,
  type ReactFlowInstance
} from 'reactflow';
import 'reactflow/dist/style.css';

interface FlowCanvasProps {
  nodes: Node[];
  edges: Edge[];
  onNodeClick?: OnNodeClick;
  fitViewOnInit?: boolean;
}

export function FlowCanvas({ nodes, edges, onNodeClick, fitViewOnInit = false }: FlowCanvasProps) {
  // Only execute fitView on initial load
  const onInit = (instance: ReactFlowInstance) => {
    if (fitViewOnInit) {
      setTimeout(() => instance.fitView(), 50);
    }
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodeClick={onNodeClick}
        onInit={onInit}
        fitView={false} // Disable auto fitView to preserve user transformations
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
