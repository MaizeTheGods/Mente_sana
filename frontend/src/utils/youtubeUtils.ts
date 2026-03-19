/**
 * Extracts the YouTube video ID from various YouTube URL formats.
 * Supported formats:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - VIDEO_ID (returns as is)
 */
export const extractYoutubeId = (urlOrId: string | undefined): string => {
  if (!urlOrId) return 'dQw4w9WgXcQ'; // Default placeholder (Rick Astley) or you could return empty

  const trimmed = urlOrId.trim();
  
  // If it's already just an ID (11 chars, no slashes or dots usually)
  // But let's use regex for safety
  
  // Regex for different formats
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = trimmed.match(regExp);

  return (match && match[2].length === 11) ? match[2] : trimmed;
};
