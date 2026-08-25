import { Button } from '@/components/ui/button';
import { IoHomeSharp } from 'react-icons/io5';
import { AboutDialog } from '@/components/controls/AboutDialog.tsx';

export const Footer = () => {
  const goHome = () => {
    window.location.href = 'https://patorjk.com';
  };

  return (
    <footer className="flex flex-wrap items-center justify-center gap-3 p-4  md:grid md:grid-cols-3">
      <div className={'hidden md:block'} />
      <div className="flex justify-center gap-2">
        <Button onClick={goHome}>
          <IoHomeSharp />
          Home
        </Button>
        <AboutDialog />
      </div>
      <span className="text-sm text-muted-foreground md:justify-self-end">
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
