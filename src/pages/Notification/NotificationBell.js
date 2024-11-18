import React, { useState, useEffect } from 'react';
import { getUnreadNotifications } from './NotificationService';

const NotificationBell = ({ onClick }) => {
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const fetchUnreadCount = async () => {
            const notifications = await getUnreadNotifications();
            setUnreadCount(notifications.length);
        };

        fetchUnreadCount();
    }, []);

    return (
        <div className="notification-bell" onClick={onClick}>
            <i className="bell-icon">🔔</i>
            {unreadCount > 0 && <span className="unread-count">{unreadCount}</span>}
        </div>
    );
};

export default NotificationBell;
