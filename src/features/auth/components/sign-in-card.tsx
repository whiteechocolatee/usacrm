'use client';

import { useAuthActions } from '@convex-dev/auth/react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { TriangleAlert } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { SignInFlow } from '../types';

type SignInProps = {
  setState: (setState: SignInFlow) => void;
};

export function SignInCard({ setState }: SignInProps) {
  const { signIn } = useAuthActions();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  const onPasswordSignIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setPending(true);
    signIn('password', { email, password, flow: 'signIn' })
      .catch(() => {
        setPending(false);
        setError('Invalid email or password');
      })
      .finally(() => setPending(false));
  };

  const handleProviderSignIn = (value: 'google') => {
    signIn(value);
  };

  return (
    <Card className="w-full h-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Login to continue</CardTitle>
        <CardDescription>
          Use your email or another service to continue
        </CardDescription>
      </CardHeader>
      {!!error && (
        <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6">
          <TriangleAlert className="size-4 " />
          <p>{error}</p>
        </div>
      )}
      <CardContent className="space-y-5 px-0 pb-0">
        <form onSubmit={onPasswordSignIn} className="space-y-2.5">
          <Input
            disabled={false}
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            required
          />
          <Input
            disabled={pending}
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            required
          />
          <Button type="submit" className="w-full" size="lg" disabled={pending}>
            Continue
          </Button>
        </form>
        <Separator />
        <div className="flex flex-col gap-y-2.5">
          <Button
            type="submit"
            className="w-full relative"
            size="lg"
            variant="outline"
            onClick={() => handleProviderSignIn('google')}
            disabled={pending}
          >
            <FcGoogle className="absolute left-2.5 top-3 size-5" /> Sign in with
            Google
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Don&apos;t have an account?{' '}
          <button
            type="button"
            onClick={() => setState('signUp')}
            onKeyDown={e => e.key === 'Enter' && setState('signUp')}
            className="text-sky-700 hover:underline cursor-pointer"
          >
            Sign Up
          </button>
        </p>
      </CardContent>
    </Card>
  );
}
