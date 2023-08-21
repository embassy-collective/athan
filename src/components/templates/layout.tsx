import { ReactNode } from 'react';
import Titlebar from '../atoms/titlebar';
import Sidebar from '../molecules/sidebar';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <Titlebar />
      <main className="flex flex-row h-screen">
        <Sidebar className="w-[300px]" />
        <div className="flex-grow py-20 px-16">{children}</div>
      </main>
      <footer></footer>
    </div>
  );
};

export default Layout;
