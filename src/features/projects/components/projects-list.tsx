'use client';

import { Project } from '../types';
import ProjectListCard from './project-list-card';

type ProjectsListProps = {
  projects: Project[];
  isLoading: boolean;
};

function ProjectsList({ projects, isLoading }: ProjectsListProps) {
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">Loading...</div>
    );
  }

  return (
    <div className="pt-9 flex flex-col gap-y-4">
      {projects.map(project => (
        <ProjectListCard key={project._id} project={project} />
      ))}
    </div>
  );
}

export default ProjectsList;
