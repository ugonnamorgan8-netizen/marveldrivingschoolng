// Image upload guard for the admin panel. The storage buckets enforce the same
// rules server-side (see the launch SQL migration); this gives instant feedback.
const ALLOWED: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

/** Returns a safe file extension derived from the real MIME type, or an error message. */
export const checkImage = (file: File): { ext: string } | { error: string } => {
  const ext = ALLOWED[file.type];
  if (!ext) return { error: "Only JPG, PNG, WebP or GIF images are allowed." };
  if (file.size > MAX_IMAGE_BYTES) return { error: "Image is larger than 5 MB. Please resize it first." };
  return { ext };
};

export const IMAGE_ACCEPT = Object.keys(ALLOWED).join(",");
