import { cn, getInitials } from "@/lib/utils";

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function Avatar({ src, name, size = "md", className }: AvatarProps) {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-16 h-16 text-xl",
  };

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn(
          "rounded-full object-cover border-2 border-[#2A2A40]",
          sizeClasses[size],
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "rounded-full bg-gradient-to-br from-[#D4A843] to-[#8B6914] flex items-center justify-center font-bold text-[#0A0A0F] border-2 border-[#2A2A40]",
        sizeClasses[size],
        className
      )}
    >
      {getInitials(name)}
    </div>
  );
}
