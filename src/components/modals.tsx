'use client';

import CreateWorkSpaceModal from '@/features/workspaces/components/create-workspace-modal';
import { useEffect, useState } from 'react';

function Modals() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <CreateWorkSpaceModal />;
}

export default Modals;
