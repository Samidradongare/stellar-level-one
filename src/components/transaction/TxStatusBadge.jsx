import React from 'react';
import { Badge } from '../ui/Badge';

export function TxStatusBadge({ status }) {
  const normStatus = status ? status.toLowerCase() : 'idle';

  switch (normStatus) {
    case 'success':
    case 'won':
    case 'returned':
      return <Badge variant="success">Returned</Badge>;
    case 'forfeited':
    case 'lost':
      return <Badge variant="danger">Forfeited</Badge>;
    case 'active':
    case 'focusing':
      return <Badge variant="warning">Focusing</Badge>;
    case 'staking':
      return <Badge variant="primary">Staking</Badge>;
    default:
      return <Badge variant="info">{status || 'Idle'}</Badge>;
  }
}
