type ConvLike = {lastMessage: {timestamp: number}};

export function compareByLastMessageDesc(a: ConvLike, b: ConvLike): number {
  return b.lastMessage.timestamp - a.lastMessage.timestamp;
}

/**
 * Format a timestamp to a relative time string
 * @param timestamp - The timestamp to format
 * @returns The relative time string
 */
export function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diffMs = Math.max(0, now - timestamp);
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return 'now';
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;

  const then = new Date(timestamp);
  const today = new Date(now);
  const dayMs = 24 * 60 * 60 * 1000;
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const startOfThen = new Date(then.getFullYear(), then.getMonth(), then.getDate()).getTime();
  const dayDiff = Math.floor((startOfToday - startOfThen) / dayMs);

  // Same week: show day name (e.g., Tue)
  if (dayDiff < 7) {
    return then.toLocaleDateString(undefined, {weekday: 'short'});
  }
  // Otherwise: show short date (e.g., Mar 5)
  return then.toLocaleDateString(undefined, {month: 'short', day: 'numeric'});
}
