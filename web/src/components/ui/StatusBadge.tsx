import { OrderStatus } from '../../types';

const labels: Record<OrderStatus, string> = {
  pending: 'Pending', assigned: 'Assigned', in_transit: 'In Transit',
  delivered: 'Delivered', failed: 'Failed', cancelled: 'Cancelled',
};

export default function StatusBadge({ status }: { status: OrderStatus }) {
  return <span className={`badge-${status}`}>{labels[status]}</span>;
}
