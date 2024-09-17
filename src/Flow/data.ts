import { Node, Edge } from './layoutStrategies/types';
import { MarkerType } from '@xyflow/react';

// export const initialNodes = [
//   { id: '1', data: { label: 'Node 1' }, group: 1 },
//   { id: '2', data: { label: 'Node 2' }, group: 1 },
//   { id: '3', data: { label: 'Node 3' }, group: 1 },
//   { id: '4', data: { label: 'Node 4' }, group: 2 },
//   { id: '5', data: { label: 'Node 5' }, group: 2 },
//   { id: '6', data: { label: 'Node 6' }, group: 3 },
// ];

// export const initialEdges = [
//   { id: 'e1-2', source: '1', target: '2' },
//   { id: 'e2-3', source: '2', target: '3' },
//   { id: 'e4-5', source: '4', target: '5' },
//   { id: 'e5-6', source: '5', target: '6' },
//   { id: 'e2-6', source: '2', target: '6' },
// ];

export const initialNodes: Node[] = [
  // Production Order
  { id: 1, data: { label: 'production_order quantity' }, group: 1 },
  { id: 2, data: { label: 'production_order delivery_date' }, group: 1 },
  { id: 3, data: { label: 'production_order status' }, group: 1 },
  { id: 4, data: { label: 'production_order remain_status' }, group: 1 },
  { id: 5, data: { label: 'production_order scheduled_start_date' }, group: 1 },
  { id: 6, data: { label: 'production_order scheduled_end_date' }, group: 1 },
  { id: 7, data: { label: 'production_order cost' }, group: 1 },

  // Item Master
  { id: 8, data: { label: 'item physical_inventory' }, group: 2 },
  { id: 9, data: { label: 'item available_physical' }, group: 2 },
  { id: 10, data: { label: 'item on_order' }, group: 2 },
  { id: 11, data: { label: 'item physical_reserve' }, group: 2 },
  { id: 12, data: { label: 'item ordered_reserve' }, group: 2 },
  { id: 13, data: { label: 'item total_available' }, group: 2 },

  // Lead Time
  { id: 14, data: { label: 'lead_time' }, group: 3 },
  { id: 15, data: { label: 'lead_time multiple_purchase_quantity' }, group: 3 },
  { id: 16, data: { label: 'lead_time min_order_quantity' }, group: 3 },
  { id: 17, data: { label: 'lead_time max_order_quantity' }, group: 3 },
  { id: 18, data: { label: 'lead_time standard_order_quantity' }, group: 3 },

  // Planned Orders and POs
  { id: 19, data: { label: 'planned_order requirement_quantity' }, group: 4 },
  { id: 20, data: { label: 'planned_order delivery_date' }, group: 4 },
  { id: 21, data: { label: 'planned_order status' }, group: 4 },
  { id: 22, data: { label: 'planned_order action_flag' }, group: 4 },

  // Purchase Orders
  { id: 23, data: { label: 'purchase_order quantity' }, group: 5 },
  { id: 24, data: { label: 'purchase_order delivery_date' }, group: 5 },
  { id: 25, data: { label: 'purchase_order status' }, group: 5 },
  { id: 26, data: { label: 'purchase_order price' }, group: 5 },

  // Quality
  { id: 27, data: { label: 'quality ncmr_number' }, group: 6 },
  { id: 28, data: { label: 'quality criticality_level' }, group: 6 },
  { id: 29, data: { label: 'quality quantity' }, group: 6 },
  { id: 30, data: { label: 'quality source' }, group: 6 },

  // Labor (KronosHours)
  { id: 31, data: { label: 'labor actual_total_hours' }, group: 7 },
  { id: 32, data: { label: 'labor overtime_hours' }, group: 7 },
  { id: 33, data: { label: 'labor productive_hours' }, group: 7 },
  { id: 34, data: { label: 'labor wage_rate' }, group: 7 },

  // Sales Forecast
  { id: 35, data: { label: 'sales_forecast quantity' }, group: 8 },
  { id: 36, data: { label: 'sales_forecast date' }, group: 8 },

  // Shortages
  { id: 37, data: { label: 'shortage physical_inventory_qty' }, group: 9 },
  { id: 38, data: { label: 'shortage open_purchase_qty' }, group: 9 },
  { id: 39, data: { label: 'shortage production_qty' }, group: 9 },
  { id: 40, data: { label: 'shortage shortages_today' }, group: 9 },

  // Observed Confounders
  { id: 41, data: { label: 'market_demand' }, group: 10 },
  { id: 42, data: { label: 'supplier_performance' }, group: 10 },
  { id: 43, data: { label: 'production_capacity' }, group: 10 },
  { id: 44, data: { label: 'economic_factors' }, group: 10 },
].map((node) => ({
  ...node,
  id: node.id.toString(),
  type: 'custom',
  data: { ...node?.data, group: node?.group },
}));

export const initialEdges: Edge[] = [
  // Sales Forecast influences
  { source: 35, target: 1, weight: 4.5 }, // Sales forecast quantity strongly influences production order quantity
  { source: 36, target: 2, weight: 4.0 }, // Sales forecast date affects production order delivery date
  { source: 35, target: 19, weight: 4.0 }, // Sales forecast quantity affects planned order requirement quantity

  // Production Order relationships
  { source: 1, target: 8, weight: 4.0 }, // Production order quantity directly affects physical inventory
  { source: 1, target: 9, weight: 3.5 }, // Production order quantity affects available physical inventory
  { source: 3, target: 4, weight: 4.5 }, // Production order status determines remain status
  { source: 5, target: 6, weight: 4.0 }, // Scheduled start date influences scheduled end date
  { source: 1, target: 7, weight: 3.5 }, // Production order quantity affects cost

  // Item Master relationships
  { source: 8, target: 13, weight: 4.5 }, // Physical inventory is a key component of total available
  { source: 9, target: 13, weight: 4.5 }, // Available physical is a key component of total available
  { source: 10, target: 13, weight: 3.5 }, // On order affects total available
  { source: 11, target: 9, weight: 4.0 }, // Physical reserve affects available physical
  { source: 12, target: 9, weight: 3.5 }, // Ordered reserve affects available physical

  // Lead Time relationships
  { source: 14, target: 2, weight: 3.5 }, // Lead time affects production order delivery date
  { source: 14, target: 24, weight: 3.5 }, // Lead time affects purchase order delivery date
  { source: 15, target: 23, weight: 3.0 }, // Multiple purchase quantity influences purchase order quantity
  { source: 16, target: 23, weight: 3.0 }, // Min order quantity affects purchase order quantity
  { source: 17, target: 23, weight: 3.0 }, // Max order quantity affects purchase order quantity
  { source: 18, target: 19, weight: 3.5 }, // Standard order quantity influences planned order requirement quantity

  // Planned Orders and POs relationships
  { source: 19, target: 23, weight: 4.0 }, // Planned order requirement quantity determines purchase order quantity
  { source: 20, target: 24, weight: 4.0 }, // Planned order delivery date influences purchase order delivery date
  { source: 21, target: 25, weight: 3.5 }, // Planned order status affects purchase order status
  { source: 22, target: 25, weight: 3.0 }, // Action flag may influence purchase order status

  // Purchase Orders relationships
  { source: 23, target: 10, weight: 4.5 }, // Purchase order quantity directly affects item on order
  { source: 24, target: 2, weight: 3.0 }, // Purchase order delivery date may influence production order delivery date
  { source: 26, target: 7, weight: 3.5 }, // Purchase order price affects production order cost

  // Quality relationships
  { source: 29, target: 8, weight: 3.5 }, // Quality quantity affects physical inventory
  { source: 28, target: 1, weight: 3.0 }, // Criticality level may influence future production order quantity
  { source: 27, target: 7, weight: 2.5 }, // NCMR number may affect production order cost

  // Labor relationships
  { source: 31, target: 1, weight: 3.5 }, // Actual total hours constrain production order quantity
  { source: 33, target: 1, weight: 4.0 }, // Productive hours directly influence production order quantity
  { source: 32, target: 7, weight: 3.0 }, // Overtime hours affect production order cost
  { source: 34, target: 7, weight: 3.5 }, // Wage rate influences production order cost

  // Shortages relationships
  { source: 37, target: 19, weight: 4.0 }, // Physical inventory shortage affects planned order requirement quantity
  { source: 38, target: 19, weight: 3.5 }, // Open purchase shortage influences planned order requirement quantity
  { source: 39, target: 1, weight: 3.5 }, // Production quantity shortage may affect production order quantity
  { source: 40, target: 22, weight: 4.0 }, // Shortages today strongly influence action flag

  // Confounder effects
  { source: 41, target: 35, weight: 4.5 }, // Market demand strongly influences sales forecast quantity
  { source: 41, target: 8, weight: 3.0 }, // Market demand affects inventory strategy
  { source: 42, target: 14, weight: 4.0 }, // Supplier performance significantly affects lead time
  { source: 42, target: 24, weight: 3.5 }, // Supplier performance influences purchase order delivery date
  { source: 43, target: 1, weight: 4.0 }, // Production capacity constrains production order quantity
  { source: 43, target: 31, weight: 3.5 }, // Production capacity relates to actual total labor hours
  { source: 44, target: 35, weight: 3.5 }, // Economic factors influence sales forecast
  { source: 44, target: 26, weight: 3.0 }, // Economic factors may affect purchase order price
].map((edge) => ({
  ...edge,
  source: edge.source.toString(),
  target: edge.target.toString(),
  id: `edge-${edge.source}-${edge.target}`,
  type: 'floating',
  markerEnd: { type: MarkerType.Arrow },
  animated: true,
}));
