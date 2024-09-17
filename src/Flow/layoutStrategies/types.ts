export interface Node {
  id: string;
  data: { label: string; group?: number };
  group: number;
  position?: {
    x?: number;
    y?: number;
  };
}

export interface Edge {
  source: string;
  target: string;
  weight: number;
  path?: string;
}

export interface Graph {
  nodes: Node[];
  edges: Edge[];
}
