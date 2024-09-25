import { useMutation } from 'convex/react';
import { useCallback, useMemo, useState } from 'react';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';

type RequestType = {
  memberId: Id<'members'>;
  workspaceId: Id<'workspaces'>;
};

type ResponseType = Id<'conversations'> | null;

type Options = {
  onSuccess?: (data: ResponseType) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  throwError?: boolean;
};

export const useCreateOrGetConversation = () => {
  const [data, setData] = useState<ResponseType>(null);
  const [error, setError] = useState<Error | null>(null);

  const [status, setStatus] = useState<
    'idle' | 'settled' | 'success' | 'error' | 'pending'
  >('idle');

  const isPending = useMemo(() => status === 'pending', [status]);
  const isSuccess = useMemo(() => status === 'success', [status]);
  const isSettled = useMemo(() => status === 'settled', [status]);
  const isError = useMemo(() => status === 'error', [status]);

  const mutation = useMutation(api.conversations.createOrGet);

  const mutate = useCallback(
    async (values: RequestType, options?: Options) => {
      try {
        setData(null);
        setError(null);
        setStatus('pending');

        const response = await mutation(values);

        options?.onSuccess?.(response);

        return response;
      } catch (e) {
        setStatus('error');

        options?.onError?.(e as Error);

        if (options?.throwError) {
          throw e;
        }

        return undefined;
      } finally {
        setStatus('settled');
        options?.onSettled?.();
      }
    },
    [mutation],
  );

  return {
    data,
    error,
    isPending,
    isSuccess,
    isError,
    isSettled,
    mutate,
  };
};
