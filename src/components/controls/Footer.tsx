import { Button } from '@/components/ui/button';
import { IoHomeSharp } from 'react-icons/io5';
import { AboutDialog } from '@/components/controls/AboutDialog.tsx';

export const Footer = () => {
  const goHome = () => {
    window.location.href = 'https://patorjk.com';
  };

  return (
    <footer className="grid grid-cols-3 items-center p-4">
      <div />
      <div className="flex justify-center gap-2">
        <Button onClick={goHome}>
          <IoHomeSharp />
          Home
        </Button>
        <AboutDialog />
      </div>
      <span className="justify-self-end text-sm text-muted-foreground">
        Last Updated:{' '}
        {new Date(__BUILD_DATE__).toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })}
      </span>
    </footer>
  );
};
