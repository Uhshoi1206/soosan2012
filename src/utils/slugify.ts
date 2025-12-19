/**
 * Utility functions for Vietnamese text slugification and boxType mapping
 */

/**
 * Convert Vietnamese text with diacritics to ASCII-safe slug
 */
export function removeVietnameseDiacritics(str: string): string {
  const vietnameseMap: { [key: string]: string } = {
    'à': 'a', 'á': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
    'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a',
    'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
    'đ': 'd',
    'è': 'e', 'é': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
    'ê': 'e', 'ề': 'e', 'ế': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
    'ì': 'i', 'í': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
    'ò': 'o', 'ó': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
    'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
    'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
    'ù': 'u', 'ú': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
    'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
    'ỳ': 'y', 'ý': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y',
    // Uppercase versions
    'À': 'A', 'Á': 'A', 'Ả': 'A', 'Ã': 'A', 'Ạ': 'A',
    'Ă': 'A', 'Ằ': 'A', 'Ắ': 'A', 'Ẳ': 'A', 'Ẵ': 'A', 'Ặ': 'A',
    'Â': 'A', 'Ầ': 'A', 'Ấ': 'A', 'Ẩ': 'A', 'Ẫ': 'A', 'Ậ': 'A',
    'Đ': 'D',
    'È': 'E', 'É': 'E', 'Ẻ': 'E', 'Ẽ': 'E', 'Ẹ': 'E',
    'Ê': 'E', 'Ề': 'E', 'Ế': 'E', 'Ể': 'E', 'Ễ': 'E', 'Ệ': 'E',
    'Ì': 'I', 'Í': 'I', 'Ỉ': 'I', 'Ĩ': 'I', 'Ị': 'I',
    'Ò': 'O', 'Ó': 'O', 'Ỏ': 'O', 'Õ': 'O', 'Ọ': 'O',
    'Ô': 'O', 'Ồ': 'O', 'Ố': 'O', 'Ổ': 'O', 'Ỗ': 'O', 'Ộ': 'O',
    'Ơ': 'O', 'Ờ': 'O', 'Ớ': 'O', 'Ở': 'O', 'Ỡ': 'O', 'Ợ': 'O',
    'Ù': 'U', 'Ú': 'U', 'Ủ': 'U', 'Ũ': 'U', 'Ụ': 'U',
    'Ư': 'U', 'Ừ': 'U', 'Ứ': 'U', 'Ử': 'U', 'Ữ': 'U', 'Ự': 'U',
    'Ỳ': 'Y', 'Ý': 'Y', 'Ỷ': 'Y', 'Ỹ': 'Y', 'Ỵ': 'Y'
  };

  return str.split('').map(char => vietnameseMap[char] || char).join('');
}

/**
 * BoxType values mapping: Vietnamese with diacritics <-> ASCII slug
 */
const boxTypeSlugMap: { [key: string]: string } = {
  'đông-lạnh': 'dong-lanh',
  'bảo-ôn': 'bao-on',
  'kín': 'kin',
  'bạt': 'bat',
  'lửng': 'lung',
  'xi-téc': 'xi-tec'
};

// Reverse mapping: slug -> Vietnamese value
const slugToBoxTypeMap: { [key: string]: string } = Object.entries(boxTypeSlugMap).reduce(
  (acc, [vn, slug]) => ({ ...acc, [slug]: vn }),
  {}
);

/**
 * Convert boxType value (Vietnamese with diacritics) to URL-safe slug
 * Example: 'lửng' -> 'lung', 'đông-lạnh' -> 'dong-lanh'
 */
export function getBoxTypeSlug(boxType: string | undefined): string {
  if (!boxType) return '';
  return boxTypeSlugMap[boxType] || removeVietnameseDiacritics(boxType.toLowerCase());
}

/**
 * Convert URL slug back to boxType value (Vietnamese with diacritics)
 * Example: 'lung' -> 'lửng', 'dong-lanh' -> 'đông-lạnh'
 */
export function getBoxTypeFromSlug(slug: string | undefined): string {
  if (!slug) return '';
  // First check if it's already a Vietnamese value
  if (Object.keys(boxTypeSlugMap).includes(slug)) {
    return slug;
  }
  // Then try to convert from slug
  return slugToBoxTypeMap[slug] || slug;
}

/**
 * Get all available boxType slugs for validation
 */
export function getAllBoxTypeSlugs(): string[] {
  return Object.values(boxTypeSlugMap);
}

/**
 * Get all available boxType values (Vietnamese)
 */
export function getAllBoxTypes(): string[] {
  return Object.keys(boxTypeSlugMap);
}
