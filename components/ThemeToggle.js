'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { setTheme as toggleTheme } from '@/redux/features/preferencesSlice';
import { useDispatch } from 'react-redux';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const dispatch = useDispatch();

  const handleOnClick = () =>{
    setTheme(theme === 'light' ? 'dark' : 'light');
    dispatch(toggleTheme(theme));
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleOnClick}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark-0 dark-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}