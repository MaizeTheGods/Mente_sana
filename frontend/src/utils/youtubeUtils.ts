/**
 * Extracts the YouTube video ID from various YouTube URL formats.
 * Supported formats:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/live/VIDEO_ID
 * - https://www.youtube.com/shorts/VIDEO_ID
 * - VIDEO_ID (returns as is)
 */
export const extractYoutubeId = (urlOrId: string | undefined): string => {
  if (!urlOrId) return 'dQw4w9WgXcQ'; // Default placeholder (Rick Astley)

  const trimmed = urlOrId.trim();
  
  // Enhanced regex to handle watch, embed, v, youtu.be, shorts, and live
  const regExp = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|live\/|shorts\/)|youtu\.be\/)([^"&?/\s]{11})/i;
  const match = trimmed.match(regExp);

  if (match && match[1]) {
    return match[1];
  }

  // Fallback for raw IDs or malformed strings that look like IDs
  // (11 chars, no common URL punctuation)
  if (trimmed.length === 11 && !trimmed.includes('/') && !trimmed.includes('.') && !trimmed.includes(':')) {
    return trimmed;
  }
  
  return trimmed; 
};
