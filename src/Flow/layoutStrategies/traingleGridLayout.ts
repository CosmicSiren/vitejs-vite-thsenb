import { Node, Graph, Edge } from './types';

export function applyTriangularGridWithForces(graph: Graph) {
  const { nodes, edges }  = graph;
  const REPULSION_FORCE = 4000;
  const ATTRACTION_FORCE = 0.01;
  const GRID_SPACING = 150; // Adjusted for better spacing

  const ITERATIONS = 1000; // Higher iterations for larger datasets
  const EPSILON = 1e-2; // To avoid division by zero in forces

  // Initialize positions randomly within a reasonable bound
  nodes.forEach((node) => {
    node.position = { x: Math.random() * 500, y: Math.random() * 500 };
    node.vx = 0;
    node.vy = 0;
  });

  // Distance calculation function
  const distance = (nodeA, nodeB) => {
    const dx = nodeA.position.x - nodeB.position.x;
    const dy = nodeA.position.y - nodeB.position.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Apply repulsion between all nodes
  function applyRepulsion() {
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const nodeA = nodes[i];
        const nodeB = nodes[j];

        const dist = distance(nodeA, nodeB) + EPSILON;
        const force = REPULSION_FORCE / (dist * dist);

        const dx = (nodeB.position.x - nodeA.position.x) / dist;
        const dy = (nodeB.position.y - nodeA.position.y) / dist;

        nodeA.vx -= force * dx;
        nodeA.vy -= force * dy;

        nodeB.vx += force * dx;
        nodeB.vy += force * dy;
      }
    }
  }

  // Apply attraction for connected nodes
  function applyAttraction() {
    edges.forEach((edge) => {
      const source = nodes.find((n) => n.id === edge.source);
      const target = nodes.find((n) => n.id === edge.target);

      const dist = distance(source, target) + EPSILON;
      const force = dist * dist * ATTRACTION_FORCE;

      const dx = (target.position.x - source.position.x) / dist;
      const dy = (target.position.y - source.position.y) / dist;

      source.vx += force * dx;
      source.vy += force * dy;

      target.vx -= force * dx;
      target.vy -= force * dy;
    });
  }

  // Snap nodes to a triangular grid, with better spacing
  function snapToGrid(node) {
    const q = Math.round(node.position.x / GRID_SPACING);
    const r = Math.round(node.position.y / (GRID_SPACING * Math.sqrt(3)));

    node.position.x = q * GRID_SPACING;
    node.position.y = r * GRID_SPACING * Math.sqrt(3);
  }

  // Perform multiple iterations of force-based adjustment and snapping
  for (let iter = 0; iter < ITERATIONS; iter++) {
    applyRepulsion();
    applyAttraction();

    // Update positions based on velocities and snap to grid
    nodes.forEach((node) => {
      node.position.x += node.vx;
      node.position.y += node.vy;

      // Apply some friction to stabilize movements
      node.vx *= 0.9;
      node.vy *= 0.9;

      // Ensure positions are snapped to the grid
      snapToGrid(node);
    });
  }

  return nodes;
}
