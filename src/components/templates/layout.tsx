import Providers from '@/providers/providers';
import { ReactNode } from 'react';
import Sidebar from '../molecules/sidebar';
import { TitleBar } from '../molecules/Titlebar';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <Providers>
      <div>
        <main className="flex flex-row h-screen">
          <Sidebar className="w-[300px]" />
          <TitleBar />
          <div className="flex-grow px-16 py-20">{children}</div>
        </main>
        <footer></footer>
      </div>
    </Providers>
  );
};

export default Layout;
