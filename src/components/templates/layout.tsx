import { ReactNode } from 'react';
import Sidebar from '../molecules/sidebar';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <main className="flex flex-row h-screen">
        <Sidebar className="w-[300px]" />
        <div className="flex-grow py-20 px-16">{children}</div>
      </main>
      <footer></footer>
    </div>
  );
};

export default Layout;
