import { cn } from '@/lib/styles';
import Logo from '../atoms/logo';
import Menu from './menu';

const Sidebar = ({ className }: { className?: string }) => {
  return (
    <div className={cn(className, 'flex flex-col')}>
      <Logo className="m-4 my-24 p-4 mx-auto" />
      <Menu />
    </div>
  );
};

export default Sidebar;
