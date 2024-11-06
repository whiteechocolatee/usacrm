'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetProjects } from '@/features/projects/api/use-get-projects';
import { LuLayoutList } from 'react-icons/lu';
import { CiGrid42 } from 'react-icons/ci';

import ProjectsList from '@/features/projects/components/projects-list';
import { Project } from '@/features/projects/types';
import { useCreateProjectsModal } from '@/hooks/use-create-project-modal';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { Plus, Search } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { Id } from '../../../../../convex/_generated/dataModel';

function ProjectsPage() {
  const workspaceId = useWorkspaceId();
  const { open } = useCreateProjectsModal();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: projects, isLoading: isProjectsLoading } = useGetProjects({
    workspaceId,
  });

  const filteredProjects = useMemo(() => {
    if (!projects) return [];

    if (!searchQuery.trim()) return projects as unknown as Project[];

    const query = searchQuery.toLowerCase().trim();
    return projects.filter(
      (
        project,
      ): project is Project & {
        assignees: {
          _id: Id<'users'>;
          _creationTime: number;
          name?: string;
          image?: string;
          email?: string;
          emailVerificationTime?: number;
          phone?: string;
          phoneVerificationTime?: number;
          isAnonymous?: boolean;
        }[];
      } =>
        (project.name.toLowerCase().includes(query) ||
          project.caseId.toLowerCase().includes(query)) &&
        project.importance !== undefined,
    );
  }, [projects, searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <Tabs defaultValue="grid">
      <div className="h-full max-w-screen-2xl mx-auto px-6 pt-11 overflow-y-auto">
        <div className="w-full flex items-center gap-x-4 justify-between">
          <h2 className="text-4xl font-bold">Projects</h2>
          <div className="relative max-w-[622px] w-full">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-12"
              placeholder="Search projects by name or case ID"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <div className="flex ">
            <Button onClick={open} size="lg" variant="primary">
              <Plus className="mr-2 size-6 text-custom-blue" /> Add project
            </Button>
          </div>
        </div>
        <div>
          <TabsList className="mr-2">
            <TabsTrigger value="grid">
              <CiGrid42 className="size-5  stroke-1" />
            </TabsTrigger>
            <TabsTrigger value="list">
              <LuLayoutList className="size-5 " />
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="grid">
          <ProjectsList
            type="grid"
            projects={filteredProjects}
            isLoading={isProjectsLoading}
          />
        </TabsContent>
        <TabsContent value="list">
          <ProjectsList
            type="list"
            projects={filteredProjects}
            isLoading={isProjectsLoading}
          />
        </TabsContent>
      </div>
    </Tabs>
  );
}

export default ProjectsPage;
