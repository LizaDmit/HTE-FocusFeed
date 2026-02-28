"use client";

interface AvatarProps {
  username: string;
  avatarUrl?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-16 h-16 text-xl",
  xl: "w-24 h-24 text-3xl",
};

export default function Avatar({ username, avatarUrl, size = "md" }: AvatarProps) {
  if (avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatarUrl}
        alt={username}
        className={`${sizeClasses[size]} rounded-full object-cover border-2 border-moonDust-purple/30`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-moonDust-purple/40 to-moonDust-blue/40 border-2 border-moonDust-purple/30 flex items-center justify-center font-bold text-moonDust-lavender`}
    >
      {username[0]?.toUpperCase() || "?"}
    </div>
  );
}
