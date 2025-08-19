'use client';

import * as React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { handleLogout, useAuthStore } from '@/lib/auth';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const router = useRouter();

  React.useEffect(
    () =>
      setIsLoggedIn(
        typeof window !== 'undefined' && useAuthStore.getState().token !== null,
      ),
    [],
  );

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, cursor: 'pointer' }}
          onClick={() => router.push('/dashboard')}
        >
          Patient System
        </Typography>

        {isLoggedIn ? (
          <Box display="flex" gap={2}>
            <Button color="inherit" component={Link} href="/">
              Dashboard
            </Button>
            <Button color="inherit" component={Link} href="/patients">
              Patients
            </Button>
            <Button color="inherit" component={Link} href="/patients/manage">
              Manage Patients
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        ) : (
          <Button color="inherit" component={Link} href="/auth/login">
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
