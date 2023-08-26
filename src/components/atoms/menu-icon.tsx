import { ReactComponent as Calendar } from '@/assets/icons/calendar.svg';
import { ReactComponent as Prayer } from '@/assets/icons/prayer.svg';
import { ReactComponent as Settings } from '@/assets/icons/settings.svg';
import { ReactComponent as Tasbih } from '@/assets/icons/tasbih.svg';

const MenuIcon = ({ icon, className }: { icon: string; className?: string }) => {
  switch (icon) {
    case 'prayer':
      return <Prayer className={className} />;
    case 'tasbih':
      return <Tasbih className={className} />;
    case 'settings':
      return <Settings className={className} />;
    case 'calendar':
      return <Calendar className={className} />;
    default:
      return null;
  }
};

export default MenuIcon;
