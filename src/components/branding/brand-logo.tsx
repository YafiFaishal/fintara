import Image from "next/image";

type Props = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizes = {
  sm: { w: 88, h: 52 },
  md: { w: 124, h: 72 },
  lg: { w: 208, h: 120 },
} as const;

export function BrandLogo({ size = "md", className }: Props) {
  const s = sizes[size];
  return (
    <div className={`relative ${className ?? ""}`} style={{ width: s.w, height: s.h }}>
      <Image src="/fintara-logo.png" alt="FINTARA logo" fill className="object-contain" priority />
    </div>
  );
}
