import { ArrowBigDownDash, ArrowBigUpDash } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProjectImportance as ProjectImportanceType } from '../types';

type ProjectImportanceProps = {
  importance: ProjectImportanceType;
  fallbackClasses?: string;
};

function ProjectImportance({
  importance,
  fallbackClasses,
}: ProjectImportanceProps) {
  const defaultClasses =
    'flex items-center gap-x-1 w-[100px] justify-center text-sm font-medium';

  if (importance === ProjectImportanceType.LOW) {
    return (
      <div className={cn('text-custom-green', defaultClasses, fallbackClasses)}>
        <ArrowBigDownDash className="fill-custom-green" />
        Low
      </div>
    );
  }

  if (importance === ProjectImportanceType.MEDIUM) {
    return (
      <div
        className={cn(
          'text-custom-orange fill-custom-orange',
          defaultClasses,
          fallbackClasses,
        )}
      >
        <ArrowBigUpDash className="fill-custom-orange" />
        Medium
      </div>
    );
  }

  if (importance === ProjectImportanceType.HIGH) {
    return (
      <div className={cn('text-custom-red', defaultClasses, fallbackClasses)}>
        <ArrowBigUpDash className="fill-custom-red" />
        High
      </div>
    );
  }
}

export default ProjectImportance;
