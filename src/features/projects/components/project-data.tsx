import { Card, CardDescription, CardHeader } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { snakeCaseToTitleCase } from '@/lib/utils';
import { ProjectStatus } from '../types';
import ProjectDescription from './project-description';
import { Doc, Id } from '../../../../convex/_generated/dataModel';
import ProjectComments from './project-comments';

type ProjectDataProps = {
  caseId: string;
  status: ProjectStatus;
  description?: Doc<'projects'>['description'] | undefined;
  projectId: Id<'projects'>;
};

function ProjectData({
  caseId,
  status,
  projectId,
  description,
}: ProjectDataProps) {
  return (
    <Card className="w-full border-none rounded-3xl">
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between">
          <p className="text-base text-custom-grey font-light">
            Case #{caseId}
          </p>
          <Select defaultValue={status}>
            <SelectTrigger className="w-[130px] bg-custom-light-blue rounded-2xl border-none text-custom-blue">
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value={ProjectStatus.FILED_IN_COURT}>
                  {snakeCaseToTitleCase(ProjectStatus.FILED_IN_COURT)}
                </SelectItem>
                <SelectItem value={ProjectStatus.IN_REVIEW}>
                  {snakeCaseToTitleCase(ProjectStatus.IN_REVIEW)}
                </SelectItem>
                <SelectItem value={ProjectStatus.DONE}>
                  {snakeCaseToTitleCase(ProjectStatus.DONE)}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardDescription className="p-6">
        <ProjectDescription description={description} projectId={projectId} />
        TODO: Add attachments to project
        <ProjectComments projectId={projectId} />
      </CardDescription>
    </Card>
  );
}

export default ProjectData;
