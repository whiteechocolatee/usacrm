import { useQueryState, parseAsBoolean } from 'nuqs';

export const useSetProjectAssigneeModal = () => {
  const [isOpen, setIsOpen] = useQueryState(
    'assignee',
    parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true }),
  );

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return {
    isOpen,
    open,
    close,
    setIsOpen,
  };
};
