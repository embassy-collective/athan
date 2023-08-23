import { useTheme } from '@/providers/theme-provider';

const Logo = ({ className }: { className?: string }) => {
  const { theme } = useTheme();

  return (
    <div className={className}>
      <img
        src={theme === 'light' ? '/images/logo_light.png' : '/images/logo.png'}
        alt="Athan Time"
        width={159}
        height={72}
      />
    </div>
  );
};

export default Logo;
