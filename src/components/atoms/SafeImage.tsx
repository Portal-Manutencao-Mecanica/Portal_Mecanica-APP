
import {SafeImageProps} from "@/props/SafeImageProps"
import Image, {StaticImageData } from "next/image";

export default function SafeImage({
  src,
  fallbackSrc = "/images/default-equipment.png",
  alt,
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

  return (
    <Image
      src={getFormattedSrc()}
      alt={alt || "Imagem do equipamento"}
      {...props}
    />
  );
}