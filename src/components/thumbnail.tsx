/* eslint-disable @next/next/no-img-element */

import React from 'react';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';

type ThumbnailProps = {
  url: string | null | undefined;
};

function Thumbnail({ url }: ThumbnailProps) {
  if (!url) return null;

  return (
    <Dialog>
      <DialogTrigger>
        <div className="relative overflow-hidden max-w-[360px] border rounded-lg my-2 cursor-zoom-in">
          <img
            src={url}
            alt="message img"
            className="rounded-md object-cover size-full"
          />
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-[800px] border-none bg-transparent p-0 shadow-none">
        <img
          src={url}
          alt="message img"
          className="rounded-md object-cover size-full"
        />
      </DialogContent>
    </Dialog>
  );
}

export default Thumbnail;
