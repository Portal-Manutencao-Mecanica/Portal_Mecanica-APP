interface UserAvatarProps {
  name: string;
  size?: number;
}

const colors = [
  "bg-red-500",
  "bg-orange-500",
  "bg-amber-500",
  "bg-yellow-500",
  "bg-lime-500",
  "bg-green-500",
  "bg-emerald-500",
  "bg-teal-500",
  "bg-cyan-500",
  "bg-sky-500",
  "bg-blue-500",
  "bg-indigo-500",
  "bg-violet-500",
  "bg-purple-500",
  "bg-pink-500",
];

export default function UserAvatar({ name, size = 80 }: UserAvatarProps) {
  const initial = name.charAt(0).toUpperCase();

  const color =
    colors[
      name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
        colors.length
    ];

  return (
    <div
      className={`${color} flex items-center justify-center rounded-full text-white font-bold select-none`}
      style={{
        width: size,
        height: size,
        fontSize: size / 2.5,
      }}
    >
      {initial}
    </div>
  );
}
