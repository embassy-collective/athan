import { useDynamicSvgImport } from '@/hooks/useDynamicSvgImport';

interface IProps {
  iconName: string;
  wrapperStyle?: string;
  svgProp?: React.SVGProps<SVGSVGElement>;
  onClick?: () => void;
}

function SvgIcon(props: IProps) {
  const { iconName, wrapperStyle, svgProp } = props;
  const { loading, SvgIcon } = useDynamicSvgImport(iconName);
  return (
    <>
      {loading && (
        <div onClick={() => props.onClick?.()} className="rounded-full bg-slate-400 animate-pulse h-8 w-8"></div>
      )}
      {SvgIcon && (
        <div className={wrapperStyle} onClick={() => props.onClick?.()}>
          <SvgIcon {...svgProp} />
        </div>
      )}
    </>
  );
}

export default SvgIcon;
