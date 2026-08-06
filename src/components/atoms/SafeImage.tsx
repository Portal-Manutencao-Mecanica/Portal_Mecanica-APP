
import {SafeImageProps} from "@/props/SafeImageProps"
import Image, {StaticImageData } from "next/image";

export default function SafeImage({
  src,
  fallbackSrc = "/wrench-gray.svg",
  alt,
  unoptimized,
  ...props
}: SafeImageProps) {

  const getFormattedSrc = (): string | StaticImageData => {
    if (!src) return fallbackSrc;

    if (typeof src !== "string") {
      return src;
    }

    if (src.startsWith("http") || src.startsWith("/")) {
      return src;
    }

    if (src.startsWith("data:image")) {
      return src;
    }

    return `data:image/png;base64,${src}`;
  };

  const formattedSrc = getFormattedSrc();
  const shouldBypassOptimization =
    unoptimized ??
    (typeof formattedSrc === "string" &&
      (formattedSrc.endsWith(".svg") || formattedSrc.startsWith("data:image")));

  return (
    <Image
      src={formattedSrc}
      alt={alt || "Imagem do equipamento"}
      unoptimized={shouldBypassOptimization}
      {...props}
    />
  );
}
