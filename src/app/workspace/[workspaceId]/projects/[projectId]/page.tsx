'use client';

import { useProjectId } from '@/hooks/use-project-id';

function ProjectIdPage() {
  const projectId = useProjectId();

  return (
    <div className="h-full max-w-screen-2xl mx-auto px-6 pt-11">
      {projectId}
    </div>
  );
}

export default ProjectIdPage;
