export const getUnreadNotifications = async () => {
    const response = await fetch('http://localhost:8080/notifications/unread'); // Change this URL as necessary
    if (!response.ok) {
        throw new Error('Failed to fetch notifications');
    }
    return await response.json(); // Return the parsed JSON data
};

// Function to mark a notification as read
export const markNotificationAsRead = async (notificationId) => {
    const response = await fetch(`http://localhost:8080/notifications/markAsRead/${notificationId}`, {
        method: 'POST',
    });
    if (!response.ok) {
        throw new Error('Failed to mark notification as read');
    }
    return true; // Return a success response
};
