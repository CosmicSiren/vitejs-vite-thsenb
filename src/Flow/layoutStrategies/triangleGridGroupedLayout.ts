import { Node, Edge, Graph } from './types';

export const generateTriangleGridPositions = (nodes: Node[]) => {
  const positions = [] as Node[];
  const groupMap = new Map();

  // Spacing variables for grid
  const xSpacing = 200;
  const ySpacing = 150;

  // Group nodes based on the `group` property
  nodes.forEach((node) => {
    if (!groupMap.has(node.group)) {
      groupMap.set(node.group, []);
    }
    groupMap.get(node.group).push(node);
  });

  let currentY = 0; // To track vertical placement of each group

  groupMap.forEach((groupNodes) => {
    let currentX = 0;

    // Loop through nodes in the current group and assign positions
    groupNodes.forEach((node: any, index: number) => {
      // Assign position
      node.position = { x: currentX + index * xSpacing, y: currentY };
      positions.push(node);
    });

    // Move to the next row for the next group
    currentY += ySpacing;
  });

  return positions;
};

export const generateForceDirectedLayout = (graph: Graph) => {
  const { nodes, edges } = graph;
  const positions = new Map<string, { x: number; y: number }>();
  const width = 1900; // Width of the layout area
  const height = 1080; // Height of the layout area

  // Initialize positions randomly
  nodes.forEach((node: Node) => {
    positions.set(node.id, {
      x: Math.random() * width,
      y: Math.random() * height,
    });
  });

  // Parameters for force simulation
  const repulsionForce = 2000;
  const attractionForce = 1;
  const iterations = 500;

  for (let i = 0; i < iterations; i++) {
    // Calculate repulsion forces
    nodes.forEach((nodeA: Node) => {
      nodes.forEach((nodeB: Node) => {
        if (nodeA.id !== nodeB.id) {
          const posA = positions.get(nodeA.id)!;
          const posB = positions.get(nodeB.id)!;
          const dx = posA.x - posB.x;
          const dy = posA.y - posB.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const force = repulsionForce / (distance * distance + 1);
          positions.set(nodeA.id, {
            x: posA.x + (force * dx) / distance,
            y: posA.y + (force * dy) / distance,
          });
          positions.set(nodeB.id, {
            x: posB.x - (force * dx) / distance,
            y: posB.y - (force * dy) / distance,
          });
        }
      });
    });

    // Calculate attraction forces
    edges.forEach((edge: Edge) => {
      const posA = positions.get(edge.source)!;
      const posB = positions.get(edge.target)!;
      const dx = posA.x - posB.x;
      const dy = posA.y - posB.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const force = attractionForce * distance;
      positions.set(edge.source, {
        x: posA.x - (force * dx) / distance,
        y: posA.y - (force * dy) / distance,
      });
      positions.set(edge.target, {
        x: posB.x + (force * dx) / distance,
        y: posB.y + (force * dy) / distance,
      });
    });
  }

  // Apply the calculated positions to nodes
  return nodes.map((node: Node) => ({
    ...node,
    position: positions.get(node.id)!,
  }));
};

export const generateGridLayoutWithCollisionAvoidance = (
  graph: Graph,
  spacing: number = 200
) => {
  const { nodes } = graph;
  const positions = new Map<string, { x: number; y: number }>();
  const numNodes = nodes.length;

  // Calculate the number of rows and columns
  const numCols = Math.ceil(Math.sqrt(numNodes));

  // Initialize node positions in a grid layout
  nodes.forEach((node: Node, index: number) => {
    const row = Math.floor(index / numCols);
    const col = index % numCols;
    positions.set(node.id, {
      x: col * spacing,
      y: row * spacing,
    });
  });

  // Function to check if two nodes' positions are too close
  const arePositionsTooClose = (
    pos1: { x: number; y: number },
    pos2: { x: number; y: number },
    threshold: number
  ) => {
    return (
      Math.abs(pos1.x - pos2.x) < threshold &&
      Math.abs(pos1.y - pos2.y) < threshold
    );
  };

  // Function to adjust positions if they are too close
  const adjustPositions = (nodes: Node[], spacing: number) => {
    const adjustedPositions = new Map<string, { x: number; y: number }>();

    nodes.forEach((node) => {
      const pos = positions.get(node.id)!;
      let newPos = { ...pos };

      // Adjust position to avoid collision
      nodes.forEach((otherNode) => {
        if (node.id !== otherNode.id) {
          const otherPos = positions.get(otherNode.id)!;
          if (arePositionsTooClose(newPos, otherPos, spacing)) {
            // Move node by a random offset to resolve collision
            newPos = {
              x: pos.x + (Math.random() - 0.5) * spacing,
              y: pos.y + (Math.random() - 0.5) * spacing,
            };
          }
        }
      });

      adjustedPositions.set(node.id, newPos);
    });

    return adjustedPositions;
  };

  // Adjust positions until there are no more collisions
  let adjustmentsMade;
  do {
    adjustmentsMade = false;
    const newPositions = adjustPositions(nodes, spacing);

    // Check if any adjustments were made
    adjustmentsMade = Array.from(newPositions.values()).some(
      (newPos, index) => {
        const oldPos = positions.get(nodes[index].id)!;
        return newPos.x !== oldPos.x || newPos.y !== oldPos.y;
      }
    );

    // Update positions
    positions.clear();
    newPositions.forEach((pos, id) => {
      positions.set(id, pos);
    });
  } while (adjustmentsMade);

  // Apply the adjusted positions to nodes
  return nodes.map((node: Node) => ({
    ...node,
    position: positions.get(node.id)!,
  }));
};
