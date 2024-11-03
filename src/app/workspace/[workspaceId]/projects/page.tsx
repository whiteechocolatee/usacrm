'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCreateProjectsModal } from '@/hooks/use-create-project-modal';
import { Plus, Search } from 'lucide-react';
import React from 'react';

function ProjectsPage() {
  const { open } = useCreateProjectsModal();

  return (
    <div className="h-full max-w-screen-2xl mx-auto px-6 pt-11">
      <div className="w-full flex items-center gap-x-4 justify-between">
        <h2 className="text-4xl font-bold">Projects</h2>
        <div className="relative max-w-[622px] w-full">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-12" placeholder="Search projects" />
        </div>
        <Button onClick={open} size="lg" variant="primary">
          <Plus className="mr-2 size-6 text-custom-blue" /> Add project
        </Button>
      </div>
    </div>
  );
}

export default ProjectsPage;
