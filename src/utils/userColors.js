/**
 * Generates a consistent color for a username using a hash function
 * @param {string} username - The username to generate a color for
 * @returns {string} - A hex color code
 */
export const getUserColor = (username) => {
    if (!username) return '#808080'; // Default gray

    // Simple hash function
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
        hash = username.charCodeAt(i) + ((hash << 5) - hash);
        hash = hash & hash; // Convert to 32-bit integer
    }

    // Convert to RGB ensuring decent visibility
    const colors = [
        '#EF4444', // red
        '#F59E0B', // amber
        '#10B981', // emerald
        '#3B82F6', // blue
        '#8B5CF6', // violet
        '#EC4899', // pink
        '#F97316', // orange
        '#14B8A6', // teal
        '#6366F1', // indigo
        '#A855F7', // purple
        '#06B6D4', // cyan
        '#84CC16', // lime
    ];

    const index = Math.abs(hash) % colors.length;
    return colors[index];
};

/**
 * Gets initials from a username
 * @param {string} username - The username
 * @returns {string} - The initials (max 2 characters)
 */
export const getUserInitials = (username) => {
    if (!username) return '??';

    const parts = username.trim().split(/\s+/);
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return username.substring(0, 2).toUpperCase();
};

/**
 * Custom hook to manage user colors
 * @returns {Function} - Function to get color for a username
 */
export const useUserColors = () => {
    const colorCache = {};

    return (username) => {
        if (!colorCache[username]) {
            colorCache[username] = getUserColor(username);
        }
        return colorCache[username];
    };
};
