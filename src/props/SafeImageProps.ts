import Image, { ImageProps, StaticImageData } from "next/image";

export interface SafeImageProps extends Omit<ImageProps, "src"> {
  src?: string | StaticImageData | null; 
  fallbackSrc?: string | StaticImageData;
}