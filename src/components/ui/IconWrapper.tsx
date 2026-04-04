import Image from 'next/image';

interface IconWrapperProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeMap = {
  sm: 24,
  md: 48,
  lg: 64,
  xl: 128
};

export function IconWrapper({ src, alt, size = 'md', className = '' }: IconWrapperProps) {
  const pixelSize = sizeMap[size];
  
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: pixelSize, height: pixelSize }}>
      <Image
        src={src}
        alt={alt}
        width={pixelSize}
        height={pixelSize}
        className="object-contain drop-shadow-md"
        priority
      />
    </div>
  );
}
