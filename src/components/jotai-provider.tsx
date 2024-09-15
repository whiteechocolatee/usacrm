'use client';

import { Provider } from 'jotai';

import React from 'react';

type JotaiProviderProps = {
  children: React.ReactNode;
};

export default function JotaiProvider({ children }: JotaiProviderProps) {
  return <Provider>{children}</Provider>;
}
