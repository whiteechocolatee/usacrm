'use client';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { AlertOctagon } from 'lucide-react';
import { useState } from 'react';

export const useConfirm = (
  title: string,
  message: string,
): [() => JSX.Element, () => Promise<unknown>] => {
  const [promise, setPromise] = useState<{
    resolve: (value: boolean) => void;
  } | null>(null);

  const confirm = () =>
    new Promise(resolve => {
      setPromise({ resolve });
    });

  const handleClose = () => {
    setPromise(null);
  };

  const handleConfirm = () => {
    promise?.resolve(true);
    handleClose();
  };

  const handleCancel = () => {
    promise?.resolve(false);
    handleClose();
  };

  function ConfirmationDialog() {
    return (
      <AlertDialog open={promise !== null}>
        <AlertDialogContent className="w-fit max-w-fit text-rose-600">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex gap-2 items-center">
              <AlertOctagon className="size-8" />
              {title}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-rose-600">
              {message}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="pt-2">
            <Button variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleConfirm} variant="destructive">
              Continue
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return [ConfirmationDialog, confirm];
};
