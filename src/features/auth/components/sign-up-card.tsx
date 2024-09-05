'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { SignInFlow } from '../types';

type SignUpProps = {
  setState: (setState: SignInFlow) => void;
};

export function SignUpCard({ setState }: SignUpProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <Card className="w-full h-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Sign up to continue</CardTitle>
        <CardDescription>
          Use your email or another service to continue
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 px-0 pb-0">
        <form className="space-y-2.5">
          <Input
            disabled={false}
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            required
          />
          <Input
            disabled={false}
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            required
          />
          <Input
            disabled={false}
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            type="password"
            required
          />
          <Button type="submit" className="w-full" size="lg" disabled={false}>
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
            onClick={() => {}}
            disabled={false}
          >
            <FcGoogle className="absolute left-2.5 top-3 size-5" /> Sign in with
            Google
          </Button>
          <Button
            type="submit"
            className="w-full relative"
            size="lg"
            variant="outline"
            onClick={() => {}}
            disabled={false}
          >
            <FaGithub className="absolute left-2.5 top-3 size-5" /> Sign in with
            GitHub
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => setState('signIn')}
            onKeyDown={e => e.key === 'Enter' && setState('signIn')}
            className="text-sky-700 hover:underline cursor-pointer"
          >
            Sign In
          </button>
        </p>
      </CardContent>
    </Card>
  );
}
