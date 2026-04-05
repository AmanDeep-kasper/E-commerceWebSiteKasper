export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")          // Replace &
    .replace(/[\s\W-]+/g, "-")     // Replace spaces & special chars with -
    .replace(/^-+|-+$/g, "");      // Remove starting/ending hyphens
};
