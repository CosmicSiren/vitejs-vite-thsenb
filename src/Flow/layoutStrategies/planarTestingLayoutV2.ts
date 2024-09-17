import { Node, Edge, Graph } from './types';
import { generateGridLayoutWithCollisionAvoidance } from './triangleGridGroupedLayout';

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
  return true; // Placeholder, can be implemented with full logic
};

// Function to check planarity of a graph (can use Hopcroft-Tarjan here as needed)
const isGraphPlanar = (nodes: Node[], edges: Edge[]) => {
  const adjacencyList = buildAdjacencyList(nodes, edges);

  if (edges.length > 3 * nodes.length - 6) {
    return false;
  }

  return hopcroftTarjanPlanarityTest(adjacencyList);
};

const generateGraphLayoutWithStartEnd = (
  nodes: Node[],
  edges: Edge[],
  startingNodes: string[],
  endingNodes: string[],
  horizontalSpacing: number = 200, // Increased horizontal spacing
  verticalSpacing: number = 150 // Vertical spacing between levels
) => {
  const adjacencyList = buildAdjacencyList(nodes, edges);
  const visited = new Set<string>();
  const positions = new Map<string, { x: number; y: number }>();
  const levelMap = new Map<number, number>(); // To track how many nodes at each level (Y-axis)

  let currentX = 0;

  const dfs = (nodeId: string, depth: number) => {
    if (visited.has(nodeId)) return;

    visited.add(nodeId);

    // Track how many nodes are at the current depth/level
    if (!levelMap.has(depth)) {
      levelMap.set(depth, 0);
    }

    const nodeCountAtDepth = levelMap.get(depth)!;
    positions.set(nodeId, {
      x: currentX,
      y: nodeCountAtDepth * verticalSpacing,
    });
    currentX += horizontalSpacing;

    // Update the node count for this level
    levelMap.set(depth, nodeCountAtDepth + 1);

    adjacencyList.get(nodeId)?.forEach((neighborId) => {
      if (!visited.has(neighborId)) {
        dfs(neighborId, depth + 1);
      }
    });
  };

  // Start DFS from the starting nodes
  startingNodes.forEach((startNodeId) => {
    if (!visited.has(startNodeId)) {
      currentX = 0; // Reset X position for each new component
      dfs(startNodeId, 0);
    }
  });

  // Handle remaining unvisited nodes (including disconnected ones)
  nodes.forEach((node) => {
    if (!visited.has(node.id)) {
      currentX = 0; // Reset X for disconnected components
      dfs(node.id, 0);
    }
  });

  // Assign calculated positions to the nodes
  return nodes.map((node) => ({
    ...node,
    position: positions.get(node.id) || {
      x: (currentX += horizontalSpacing),
      y: 0,
    }, // Handle isolated nodes
  }));
};

// Main function to generate positions based on graph planarity
export const generateGraphStartEndLayout = (
  graph: Graph,
  startNodes: string[],
  endNodes: string[]
) => {
  const { nodes, edges } = graph;
  if (isGraphPlanar(nodes, edges)) {
    return generateGraphLayoutWithStartEnd(nodes, edges, startNodes, endNodes);
  } else {
    console.error(
      'Graph is not planar and cannot be embedded without edge collisions.'
    );
    return generateGridLayoutWithCollisionAvoidance(graph);
  }
};
