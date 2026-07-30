
export function getFileExtension(filename: string): string {
  const lastIndex = filename.lastIndexOf('.');
  if (lastIndex === -1 || lastIndex === 0) return '';
  
  return filename.slice(lastIndex + 1).toLowerCase();
}

const ALLOWED_IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'webp', 'svg'];


export function isAllowedFileType(filename: string): boolean {
  const extension = getFileExtension(filename);
  return ALLOWED_IMAGE_EXTENSIONS.includes(extension);
}