import { useCallback, useEffect } from 'react';
import {
  ReactFlow,
  Controls,
  MiniMap,
  addEdge,
  Background,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import CustomNode from './CustomNode';
import FloatingEdge from './FloatingEdge';
import FloatingConnectionLine from './FloatingConnectionLine';
import { initialNodes, initialEdges } from './data';
import {
  generateForceDirectedLayout,
  generateTriangleGridPositions,
  applySimpleForceDirectedLayout,
  generateGridLayoutWithCollisionAvoidance,
  generateGraphLayout,
  generateGraphStartEndLayout,
  generateGraphStartEndWithCurvedEdgesLayout,
} from './layoutStrategies';

const nodeTypes = {
  custom: CustomNode,
};

const edgeTypes = {
  floating: FloatingEdge,
};

const FlowComponent = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(
    // generateTriangleGridPositions(initialNodes)
    // generateGridLayoutWithCollisionAvoidance({
    //   nodes: initialNodes,
    //   edges: initialEdges,
    // })
    // generateGraphLayout({
    //   nodes: initialNodes,
    //   edges: initialEdges,
    // })
    []
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  useEffect(() => {
    const data = generateGraphStartEndWithCurvedEdgesLayout(
      {
        nodes: initialNodes,
        edges: initialEdges,
      },
      ['41', '42', '43'],
      []
    ) as any;
    if (data?.nodes) {
      const { nodes: newNodes, edges: newEdges } = data as any;
      console.log({ newNodes, newEdges });
      setNodes(newNodes);
      setEdges(newEdges);
    } else {
      setNodes(data);
    }
  }, []);

  return (
    <div className="h-svh">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        connectionLineComponent={FloatingConnectionLine}
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};

export default FlowComponent;
