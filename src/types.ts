import { type Node, type Edge } from 'reactflow';

export interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface LevelData {
  nodes: Node[];
  edges: Edge[];
}

export interface TransitionState {
  fromNodeId: string | null;
  rect: Rect | null;
  isExpanding: boolean;
  toLevel: string | null;
  nodeData?: any;
}
