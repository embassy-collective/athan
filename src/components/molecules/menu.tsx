import { cn } from '@/lib/styles';
import MenuItem from '../atoms/menu-item';
import SvgIcon from '../atoms/svg-icon';

const routes = [
  {
    name: 'Prayer',
    path: '/',
    icon: 'prayer'
  },
  // {
  //   name: 'Monthly Calendar',
  //   path: '/calendar',
  //   icon: 'calendar'
  // },
  // {
  //   name: 'Quran',
  //   path: '/quran',
  //   icon: 'quran'
  // },
  // {
  //   name: '99 Names',
  //   path: '/names',
  //   icon: 'names'
  // },
  // {
  //   name: 'Adkar',
  //   path: '/adkar',
  //   icon: 'adkar'
  // },
  // {
  //   name: 'Tasbih',
  //   path: '/tasbih',
  //   icon: 'tasbih'
  // },
  {
    name: 'Settings',
    path: '/settings',
    icon: 'settings'
  }
];

const Menu = () => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-4">
        {routes.map((route, index) => (
          <MenuItem
            key={index}
            to={route.path}
            className="flex flex-row gap-4 font-bold py-4 px-8 ease-in duration-300"
          >
            <SvgIcon iconName={route.icon} svgProp={{ className: cn('w-6 h-6 mr-4 ml-8 text-primary') }} />
            {route.name}
          </MenuItem>
        ))}
      </div>
    </div>
  );
};

export default Menu;
