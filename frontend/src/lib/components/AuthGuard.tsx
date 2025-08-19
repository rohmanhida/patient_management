'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = React.useState(false);

  React.useEffect(() => {
    const token = useAuthStore.getState().token;

    if (!token) {
      router.replace('/auth/login'); // redirect to login
    } else {
      setChecked(true); // allow rendering
    }
  }, [router]);

  if (!checked) {
    return null; // could show a spinner here
  }

  return <>{children}</>;
}
