import { Node, Edge, Graph } from './types';
import { generateGridLayoutWithCollisionAvoidance } from './triangleGridGroupedLayout';

// Function to check planarity of a graph
export const isGraphPlanar = (nodes: Node[], edges: Edge[]) => {
  const adjacencyList = buildAdjacencyList(nodes, edges);

  // If the graph has more than 5 nodes and more than 3 * |V| - 6 edges, it's not planar by Kuratowski's theorem.
  if (edges.length > 3 * nodes.length - 6) {
    return false;
  }

  // Apply Hopcroft-Tarjan planarity test algorithm (placeholder for now)
  return hopcroftTarjanPlanarityTest(adjacencyList);
};

// Function to build adjacency list for graph representation
const buildAdjacencyList = (nodes: Node[], edges: Edge[]) => {
  const adjacencyList: Map<string, Set<string>> = new Map();

  nodes.forEach((node) => {
    adjacencyList.set(node.id, new Set());
  });

  edges.forEach((edge) => {
    adjacencyList.get(edge.source)?.add(edge.target);
    adjacencyList.get(edge.target)?.add(edge.source);
  });

  return adjacencyList;
};

// Hopcroft-Tarjan planarity testing algorithm (placeholder)
const hopcroftTarjanPlanarityTest = (
  adjacencyList: Map<string, Set<string>>
): boolean => {
  // Placeholder for actual planarity test algorithm
  return true;
};

// Function to layout the nodes using DFS if the graph is planar
const layoutPlanarGraphDFS = (
  nodes: Node[],
  edges: Edge[],
  spacing: number = 250
) => {
  const adjacencyList = buildAdjacencyList(nodes, edges);
  const visited = new Set<string>();
  const positions = new Map<string, { x: number; y: number }>();

  let currentX = 0;
  let currentY = 0;

  const dfs = (nodeId: string, depth: number) => {
    if (visited.has(nodeId)) return;

    visited.add(nodeId);
    positions.set(nodeId, { x: currentX, y: depth * spacing });
    currentX += spacing;

    adjacencyList.get(nodeId)?.forEach((neighborId) => {
      if (!visited.has(neighborId)) {
        dfs(neighborId, depth + 1);
      }
    });
  };

  // Start DFS from all nodes to handle disconnected graphs
  nodes.forEach((node) => {
    if (!visited.has(node.id)) {
      currentX = 0; // Reset X for each disconnected component
      dfs(node.id, 0);
      currentY += spacing; // Move Y down for each new component
    }
  });

  // Assign calculated positions to the nodes, ensuring all nodes have positions
  return nodes.map((node) => ({
    ...node,
    position: positions.get(node.id) || {
      x: (currentX += spacing),
      y: currentY,
    }, // Handle isolated nodes
  }));
};

// Main function to generate positions based on graph planarity
export const generateGraphLayout = (graph: Graph) => {
  const { nodes, edges } = graph;
  if (isGraphPlanar(nodes, edges)) {
    return layoutPlanarGraphDFS(nodes, edges);
  } else {
    console.error(
      'Graph is not planar and cannot be embedded without edge collisions.'
    );
    return generateGridLayoutWithCollisionAvoidance(graph);
  }
};
