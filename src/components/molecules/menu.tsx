import MenuItem from '../atoms/menu-item';

const routes = [
  {
    name: 'Prayer',
    path: '/',
    icon: 'prayer.svg'
  },
  {
    name: 'Monthly Calendar',
    path: '/calendar',
    icon: 'calendar.svg'
  },
  {
    name: 'Quran',
    path: '/quran',
    icon: 'quran.svg'
  },
  {
    name: '99 Names',
    path: '/names',
    icon: 'names.svg'
  },
  {
    name: 'Adkar',
    path: '/adkar',
    icon: 'adkar.svg'
  },
  {
    name: 'Tasbih',
    path: '/tasbih',
    icon: 'tasbih.svg'
  },
  {
    name: 'Settings',
    path: '/settings',
    icon: 'settings.svg'
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
            <img src={`/images/icons/${route.icon}`} alt={route.name} className="w-6 h-6 mr-4 ml-8" />
            {route.name}
          </MenuItem>
        ))}
      </div>
    </div>
  );
};

export default Menu;
