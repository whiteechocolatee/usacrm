'use client';

import { Button } from '@/components/ui/button';
import { useGetProject } from '@/features/projects/api/use-get-project';
import ProjectData from '@/features/projects/components/project-data';
import ProjectSidebar from '@/features/projects/components/project-sidebar';
import { ProjectImportance } from '@/features/projects/types';
import { useProjectId } from '@/hooks/use-project-id';
import { FaRegEdit } from 'react-icons/fa';

function ProjectIdPage() {
  const projectId = useProjectId();

  const { data: projectData, isLoading: isProjectLoading } = useGetProject({
    id: projectId,
  });

  if (isProjectLoading) {
    return (
      <div className="h-full flex items-center justify-center">Loading...</div>
    );
  }

  if (!projectData) {
    return (
      <div className="h-full flex items-center justify-center">
        Project not found
      </div>
    );
  }

  return (
    <div className="h-full max-w-screen-2xl mx-auto px-6 pt-11">
      <div className="grid grid-cols-4 gap-x-6">
        <div className="col-span-3 mb-5 flex justify-between">
          <h2 className="text-4xl font-bold">Project</h2>
          <Button className="rounded-md" variant="primary" size="icon">
            <FaRegEdit className="size-6 stroke-2 text-black" />
          </Button>
        </div>
        <div className="col-span-3">
          <ProjectData
            caseId={projectData.caseId}
            status={projectData.status}
          />
        </div>
        <div className="col-span-1">
          <ProjectSidebar
            dueDate={projectData.dueDate}
            createdAt={projectData._creationTime}
            importance={projectData.importance as ProjectImportance}
          />
        </div>
      </div>
    </div>
  );
}

export default ProjectIdPage;
