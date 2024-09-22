import { useMutation } from 'convex/react';
import { useCallback, useMemo, useState } from 'react';
import { api } from '../../../../convex/_generated/api';

type ResponseType = string | null;

type Options = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSuccess?: (data: ResponseType) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  throwError?: boolean;
};

export const useGenerateUploadUrl = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<ResponseType>(null);
  const [error, setError] = useState<Error | null>(null);

  const [status, setStatus] = useState<
    'idle' | 'settled' | 'success' | 'error' | 'pending'
  >('idle');

  const isPending = useMemo(() => status === 'pending', [status]);
  const isSuccess = useMemo(() => status === 'success', [status]);
  const isSettled = useMemo(() => status === 'settled', [status]);
  const isError = useMemo(() => status === 'error', [status]);

  const mutation = useMutation(api.upload.generateUploadUrl);

  const mutate = useCallback(
    async (_values: unknown, options?: Options) => {
      try {
        setData(null);
        setError(null);
        setStatus('pending');

        const response = await mutation();

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
