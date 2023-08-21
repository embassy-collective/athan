const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={className}>
      <img src="/images/logo.png" alt="Athan Time" width={159} height={72} />
    </div>
  );
};

export default Logo;
