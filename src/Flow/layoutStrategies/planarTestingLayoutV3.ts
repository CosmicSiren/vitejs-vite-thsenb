import { Node, Edge, Graph } from './types';
import { generateGridLayoutWithCollisionAvoidance } from './triangleGridGroupedLayout';

// Placeholder for Hopcroft-Tarjan planarity testing algorithm
const hopcroftTarjanPlanarityTest = (
  adjacencyList: Map<string, Set<string>>
): boolean => {
  return true; // Placeholder logic
};

// Planarity check function (simplified)
const isGraphPlanar = (nodes: Node[], edges: Edge[]) => {
  const adjacencyList = buildAdjacencyList(nodes, edges);
  if (edges.length > 3 * nodes.length - 6) {
    return false;
  }
  return hopcroftTarjanPlanarityTest(adjacencyList);
};

// Build adjacency list for graph representation
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

// Edge routing to avoid crossings by adding curvature or polyline points
const applyEdgeRouting = (
  edges: Edge[],
  positions: Map<string, { x: number; y: number }>
) => {
  return edges.map((edge) => {
    const sourcePosition = positions.get(edge.source);
    const targetPosition = positions.get(edge.target);

    if (!sourcePosition || !targetPosition) return edge;

    // Apply a slight curve or polyline between the two positions
    const midpointX = (sourcePosition.x + targetPosition.x) / 2;
    const midpointY = (sourcePosition.y + targetPosition.y) / 2 + 50; // Adjust curve by adding to Y

    // Create an SVG path for a curved edge
    const curvedPath = `M ${sourcePosition.x},${sourcePosition.y} 
                        Q ${midpointX},${midpointY} 
                        ${targetPosition.x},${targetPosition.y}`;

    // Add the curved path to the edge
    return {
      ...edge,
      path: curvedPath,
    };
  });
};

export const generateGraphLayoutWithCurvedEdges = (
  nodes: Node[],
  edges: Edge[],
  startingNodes: string[],
  endingNodes: string[],
  horizontalSpacing: number = 300,
  verticalSpacing: number = 200
) => {
  const adjacencyList = buildAdjacencyList(nodes, edges);
  const visited = new Set<string>();
  const positions = new Map<string, { x: number; y: number }>();
  const levelMap = new Map<number, number>(); // Track number of nodes at each depth/level (Y-axis)

  let currentX = 0;

  const dfs = (nodeId: string, depth: number) => {
    if (visited.has(nodeId)) return;

    visited.add(nodeId);

    if (!levelMap.has(depth)) {
      levelMap.set(depth, 0);
    }

    const nodeCountAtDepth = levelMap.get(depth)!;
    positions.set(nodeId, {
      x: currentX,
      y: nodeCountAtDepth * verticalSpacing,
    });
    currentX += horizontalSpacing;

    levelMap.set(depth, nodeCountAtDepth + 1);

    adjacencyList.get(nodeId)?.forEach((neighborId) => {
      if (!visited.has(neighborId)) {
        dfs(neighborId, depth + 1);
      }
    });
  };

  startingNodes.forEach((startNodeId) => {
    if (!visited.has(startNodeId)) {
      currentX = 0;
      dfs(startNodeId, 0);
    }
  });

  nodes.forEach((node) => {
    if (!visited.has(node.id)) {
      currentX = 0;
      dfs(node.id, 0);
    }
  });

  // Assign calculated positions to nodes
  const positionedNodes = nodes.map((node) => ({
    ...node,
    position: positions.get(node.id) || {
      x: (currentX += horizontalSpacing),
      y: 0,
    },
  }));

  // Apply edge routing with polyline or curved edges
  const routedEdges = applyEdgeRouting(edges, positions);

  return { nodes: positionedNodes, edges: routedEdges };
};

// Main function to generate positions based on graph planarity
export const generateGraphStartEndWithCurvedEdgesLayout = (
  graph: Graph,
  startNodes: string[],
  endNodes: string[]
) => {
  const { nodes, edges } = graph;
  if (isGraphPlanar(nodes, edges)) {
    return generateGraphLayoutWithCurvedEdges(
      nodes,
      edges,
      startNodes,
      endNodes
    );
  } else {
    console.error(
      'Graph is not planar and cannot be embedded without edge collisions.'
    );
    return {
      nodes: generateGridLayoutWithCollisionAvoidance(graph),
      edges,
    };
  }
};
