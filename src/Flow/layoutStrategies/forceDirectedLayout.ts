import { Node, Graph, Edge } from './types';

// export function applyForceDirectedLayout(
//   graph: Graph,
//   iterations = 500,
//   width = 800,
//   height = 600
// ): Node[] {
//   const { nodes, edges } = graph;
//   const repulsionForce = 500; // How much nodes repel each other
//   const attractionForce = 0.01; // How much connected nodes attract each other

//   // Initialize random positions if not set
//   nodes.forEach((node: Node) => {
//     if (!node?.position) {
//       node.position = {};
//     }
//     node.position.x = node.position.x ?? Math.random() * width;
//     node.position.y = node.position.y ?? Math.random() * height;
//   });

//   // Function to calculate the distance between two nodes
//   const distance = (nodeA: Node, nodeB: Node) => {
//     const dx = nodeA?.position?.x! - nodeB?.position?.x! || 0;
//     const dy = nodeA?.position?.y! - nodeB?.position?.y! || 0;
//     return Math.sqrt(dx * dx + dy * dy);
//   };

//   // Function to apply forces iteratively
//   for (let i = 0; i < iterations; i++) {
//     // Repulsion (nodes push away from each other)
//     nodes.forEach((nodeA: Node) => {
//       nodes.forEach((nodeB: Node) => {
//         if (nodeA.id !== nodeB.id) {
//           const dist = distance(nodeA, nodeB);
//           const force = repulsionForce / (dist * dist);
//           const angle = Math.atan2(
//             nodeB?.position?.y! - nodeA?.position?.y!,
//             nodeB?.position?.x! - nodeA?.position?.x!
//           );
//           if (!nodeA?.position) {
//             nodeA.position = {};
//           }
//           if (!nodeB?.position) {
//             nodeB.position = {};
//           }
//           nodeA.position.x! -= force * Math.cos(angle);
//           nodeA.position.y! -= force * Math.sin(angle);
//           nodeB.position.x! += force * Math.cos(angle);
//           nodeB.position.y! += force * Math.sin(angle);
//         }
//       });
//     });

//     // Attraction (connected nodes pull toward each other)
//     edges.forEach((edge: Edge) => {
//       const sourceNode = nodes.find((n: Node) => n.id === edge.source)!;
//       const targetNode = nodes.find((n: Node) => n.id === edge.target)!;
//       const dist = distance(sourceNode, targetNode);
//       const force = (dist - edge.weight) * attractionForce;
//       const angle = Math.atan2(
//         targetNode?.position?.y! - sourceNode?.position?.y!,
//         targetNode?.position?.x! - sourceNode?.position?.x!
//       );
//       if (!sourceNode?.position) {
//         sourceNode.position = {};
//       }
//       if (!targetNode?.position) {
//         targetNode.position = {};
//       }
//       sourceNode.position.x! += force * Math.cos(angle);
//       sourceNode.position.y! += force * Math.sin(angle);
//       targetNode.position.x! -= force * Math.cos(angle);
//       targetNode.position.y! -= force * Math.sin(angle);
//     });

//     // Optionally apply boundary conditions to keep nodes within canvas bounds
//     nodes.forEach((node: Node) => {
//       if (!node?.position) {
//         node.position = {};
//       }
//       node.position.x = Math.max(0, Math.min(width, node?.position?.x!));
//       node.position.y = Math.max(0, Math.min(height, node?.position?.y!));
//     });
//   }

//   return nodes;
// }

// Define constants for the simulation
const REPULSIVE_FORCE_STRENGTH = 2000; // Strength of node repulsion
const ATTRACTIVE_FORCE_STRENGTH = 0.1; // Strength of edge attraction
const ITERATIONS = 100; // Number of iterations for layout

// Helper function to calculate distance between two nodes
function getDistance(nodeA: Node, nodeB: Node) {
  const dx = nodeA.position.x - nodeB.position.x;
  const dy = nodeA.position.y - nodeB.position.y;
  return Math.sqrt(dx * dx + dy * dy);
}

// Helper function to calculate repulsive force between two nodes
function applyRepulsiveForce(nodeA: Node, nodeB: Node) {
  const distance = getDistance(nodeA, nodeB);
  if (distance > 0) {
    const force = REPULSIVE_FORCE_STRENGTH / (distance * distance);
    const angle = Math.atan2(
      nodeA.position.y - nodeB.position.y,
      nodeA.position.x - nodeB.position.x
    );

    nodeA.position.x += Math.cos(angle) * force;
    nodeA.position.y += Math.sin(angle) * force;
    nodeB.position.x -= Math.cos(angle) * force;
    nodeB.position.y -= Math.sin(angle) * force;
  }
}

// Helper function to apply attractive force between connected nodes (edges)
function applyAttractiveForce(nodeA: Node, nodeB: Node) {
  const distance = getDistance(nodeA, nodeB);
  const force = ATTRACTIVE_FORCE_STRENGTH * (distance * distance);
  const angle = Math.atan2(
    nodeB.position.y - nodeA.position.y,
    nodeB.position.x - nodeA.position.x
  );

  nodeA.position.x += Math.cos(angle) * force;
  nodeA.position.y += Math.sin(angle) * force;
  nodeB.position.x -= Math.cos(angle) * force;
  nodeB.position.y -= Math.sin(angle) * force;
}

// Function to perform force-directed layout
export function applyForceDirectedLayout(graph: Graph) {
  const { nodes, edges } = graph;
  // Initialize node positions randomly if not already set
  nodes.forEach((node: Node) => {
    if (!node.position) {
      node.position = {
        x: Math.random() * 500,
        y: Math.random() * 500,
      };
    }
  });

  // Perform layout iterations
  for (let i = 0; i < ITERATIONS; i++) {
    // Apply repulsive forces between all pairs of nodes
    for (let j = 0; j < nodes.length; j++) {
      for (let k = j + 1; k < nodes.length; k++) {
        applyRepulsiveForce(nodes[j], nodes[k]);
      }
    }

    // Apply attractive forces for each edge
    edges.forEach((edge: Edge) => {
      const nodeA = nodes.find((node: Node) => node.id === edge.source);
      const nodeB = nodes.find((node: Node) => node.id === edge.target);
      if (nodeA && nodeB) {
        applyAttractiveForce(nodeA, nodeB);
      }
    });
  }

  return nodes;
}
