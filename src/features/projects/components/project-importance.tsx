import { ArrowBigDownDash, ArrowBigUpDash } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProjectImportance as ProjectImportanceType } from '../types';

type ProjectImportanceProps = {
  importance: ProjectImportanceType;
};

function ProjectImportance({ importance }: ProjectImportanceProps) {
  const defaultClasses =
    'flex items-center gap-x-1 w-[100px] justify-center text-sm font-medium';

  if (importance === ProjectImportanceType.LOW) {
    return (
      <div className={cn('text-custom-green', defaultClasses)}>
        <ArrowBigDownDash />
        Low
      </div>
    );
  }

  if (importance === ProjectImportanceType.MEDIUM) {
    return (
      <div className={cn('text-custom-orange', defaultClasses)}>
        <ArrowBigUpDash />
        Medium
      </div>
    );
  }

  if (importance === ProjectImportanceType.HIGH) {
    return (
      <div className={cn('text-custom-red', defaultClasses)}>
        <ArrowBigUpDash />
        High
      </div>
    );
  }
}

export default ProjectImportance;
