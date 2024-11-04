import { Card, CardHeader } from '@/components/ui/card';
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

type ProjectDataProps = {
  caseId: string;
  status: ProjectStatus;
};

function ProjectData({ caseId, status }: ProjectDataProps) {
  return (
    <Card className="w-full border-none rounded-3xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <p className="text-base font-bold">Case #{caseId}</p>
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
    </Card>
  );
}

export default ProjectData;
