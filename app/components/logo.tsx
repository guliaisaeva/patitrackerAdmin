import { lusitana } from "@/app/components/fonts";
import Image from "next/image";
import Logo from "@/public/logo/patitracker_logo.png";

interface TrackerLogoProps {
  className?: string;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}
export default function TrackerLogo({
  width = 80,
  height,
  className,
  style,
}: TrackerLogoProps) {
  const aspectRatio = Logo.height / Logo.width;
  const calculatedHeight = height || width * aspectRatio;

  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-white`}
    >
      <Image
        src={Logo}
        alt="logo"
        className={className}
        width={width}
        height={calculatedHeight}
        style={style}
        priority
      />
    </div>
  );
}
