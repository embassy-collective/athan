import { cn } from '@/lib/styles';
import Logo from '../atoms/logo';
import Menu from './menu';

const Sidebar = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(className, 'flex flex-col bg-foreground min-h-[850px]')}
      style={{
        boxShadow: '10.347240447998047px 11.496933937072754px 72.43067932128906px 0px rgba(0, 0, 0, 0.24)'
      }}
    >
      <Logo className="m-4 my-24 p-4 mx-auto" />
      <Menu />
    </div>
  );
};

export default Sidebar;
