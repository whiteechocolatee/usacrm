'use client';

import { Project } from '../types';
import ProjectGridCard from './project-grid-card';
import ProjectListCard from './project-list-card';

type ProjectsListProps = {
  projects: Project[];
  isLoading: boolean;
  type: 'list' | 'grid';
};

function ProjectsList({ projects, isLoading, type }: ProjectsListProps) {
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">Loading...</div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        No projects found
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className="flex flex-col gap-y-4">
        {projects.map(project => (
          <ProjectListCard key={project._id} project={project} />
        ))}
      </div>
    );
  }

  if (type === 'grid') {
    return (
      <div className="grid grid-cols-4 gap-4">
        {projects.map(project => (
          <ProjectGridCard key={project._id} project={project} />
        ))}
      </div>
    );
  }
}

export default ProjectsList;
