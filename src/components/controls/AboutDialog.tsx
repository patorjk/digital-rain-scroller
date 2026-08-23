import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Info } from 'lucide-react';

import { useEffect, useState } from 'react';

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(
    () => window.matchMedia(query).matches,
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

export function AboutDialog() {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const content = (
    <>
      <p>Simple digital rain app.</p>
    </>
  );

  const button = (
    <Button>
      <Info />
      About
    </Button>
  );

  if (isDesktop) {
    return (
      <Dialog>
        <form>
          <DialogTrigger>{button}</DialogTrigger>
          <DialogContent className="dark:bg-dark-dialog-background md:max-w-2xl max-sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>About This App</DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 max-h-[500px] overflow-auto">
              {content}
            </div>
            <DialogFooter>
              <DialogClose>
                <Button variant="outline">Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    );
  }

  return (
    <Drawer>
      <DrawerTrigger>{button}</DrawerTrigger>
      <DrawerContent className={'dark:bg-dark-dialog-background'}>
        <DrawerHeader className="text-left">
          <DrawerTitle>About This App</DrawerTitle>
          <DrawerDescription></DrawerDescription>
        </DrawerHeader>
        <div
          style={{
            overflow: 'auto',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}
        >
          {content}
        </div>
        <DrawerFooter className="pt-2">
          <DrawerClose>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
