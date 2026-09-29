// "2024-05-17" -> "May 17, 2024". TMDB dates have no time zone, so format in UTC to avoid showing the day before.
export function formatDate(dateString) {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
}