import { Node, Graph, Edge } from './types';

const nodes = [
  { id: '1', data: { label: 'Node 1' }, position: { x: 0, y: 0 } },
  { id: '2', data: { label: 'Node 2' }, position: { x: 0, y: 0 } },
  { id: '3', data: { label: 'Node 3' }, position: { x: 0, y: 0 } },
  { id: '4', data: { label: 'Node 4' }, position: { x: 0, y: 0 } },
  { id: '5', data: { label: 'Node 5' }, position: { x: 0, y: 0 } },
  { id: '6', data: { label: 'Node 6' }, position: { x: 0, y: 0 } },
  { id: '7', data: { label: 'Node 7' }, position: { x: 0, y: 0 } },
  { id: '8', data: { label: 'Node 8' }, position: { x: 0, y: 0 } },
  { id: '9', data: { label: 'Node 9' }, position: { x: 0, y: 0 } },
  { id: '10', data: { label: 'Node 10' }, position: { x: 0, y: 0 } },
];
const edges = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e1-3', source: '1', target: '3' },
  { id: 'e2-4', source: '2', target: '4' },
  { id: 'e2-5', source: '2', target: '5' },
  { id: 'e3-6', source: '3', target: '6' },
  { id: 'e3-7', source: '3', target: '7' },
  { id: 'e4-8', source: '4', target: '8' },
  { id: 'e5-9', source: '5', target: '9' },
  { id: 'e6-10', source: '6', target: '10' },
  { id: 'e7-8', source: '7', target: '8' },
  { id: 'e9-10', source: '9', target: '10' },
];

export function applySimpleForceDirectedLayout(graph: Graph) {
  const { nodes, edges } = graph;
  const REPULSION_FORCE = 1000;
  const ATTRACTION_FORCE = 0.01;
  const ITERATIONS = 1000;
  const EPSILON = 1e-2;

  // Initialize positions randomly
  nodes.forEach((node) => {
    node.position = { x: Math.random() * 500, y: Math.random() * 500 };
    node.vx = 0;
    node.vy = 0;
  });

  function distance(nodeA, nodeB) {
    const dx = nodeA.position.x - nodeB.position.x;
    const dy = nodeA.position.y - nodeB.position.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

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

  for (let iter = 0; iter < ITERATIONS; iter++) {
    applyRepulsion();
    applyAttraction();
    nodes.forEach((node) => {
      node.position.x += node.vx;
      node.position.y += node.vy;
      node.vx *= 0.9; // Damping
      node.vy *= 0.9; // Damping
    });
  }

  return nodes;
}
