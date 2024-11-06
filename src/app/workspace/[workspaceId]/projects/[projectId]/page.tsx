'use client';

import { useGetProject } from '@/features/projects/api/use-get-project';
import ProjectData from '@/features/projects/components/project-data';
import ProjectSidebar from '@/features/projects/components/project-sidebar';
import { ProjectImportance } from '@/features/projects/types';
import { usePanel } from '@/hooks/use-panel';
import { useProjectId } from '@/hooks/use-project-id';
import { cn } from '@/lib/utils';

function ProjectIdPage() {
  const projectId = useProjectId();

  const { profileMemberId } = usePanel();

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
    <div className="h-full max-w-screen-2xl pb-20 mx-auto px-6 pt-11 overflow-y-auto">
      <div className="mb-5 flex justify-between">
        <h2 className="text-4xl font-bold">{projectData.name}</h2>
      </div>
      <div className="grid grid-cols-4 gap-x-6">
        <div className={cn(profileMemberId ? 'col-span-4' : 'col-span-3')}>
          <ProjectData
            projectId={projectId}
            description={projectData.description}
            caseId={projectData.caseId}
            status={projectData.status}
          />
        </div>
        <div className={cn(profileMemberId ? 'hidden' : 'col-span-1')}>
          <ProjectSidebar
            projectId={projectId}
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
