'use client';

import React, { useState } from 'react';
import { AlertOctagon } from 'lucide-react';
import { Button } from '../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from '../components/ui/dialog';

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
      <Dialog open={promise !== null}>
        <DialogContent className="w-fit max-w-fit text-rose-600">
          <DialogHeader>
            <DialogTitle className="flex gap-2 items-center">
              <AlertOctagon className="size-8" />
              {title}
            </DialogTitle>
            <DialogDescription className="text-sm text-rose-600">
              {message}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-2">
            <Button variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleConfirm} variant="destructive">
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return [ConfirmationDialog, confirm];
};
