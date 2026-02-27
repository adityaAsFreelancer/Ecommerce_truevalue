import React, { useEffect, useRef } from 'react';
import { useUser } from '../../context/UserContext';
import showAlert from '../../utils/swal';

const NotificationToastHandler = () => {
    const { notifications, unreadCount } = useUser();
    const prevUnreadCount = useRef(unreadCount);

    useEffect(() => {
        // If unread count increased, show toast for the latest one
        if (unreadCount > prevUnreadCount.current && notifications.length > 0) {
            const latest = notifications[0];
            if (!latest.isRead) {
                showAlert({
                    title: latest.title,
                    text: latest.message,
                    icon: 'info',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 5000,
                    timerProgressBar: true
                });
            }
        }
        prevUnreadCount.current = unreadCount;
    }, [unreadCount, notifications]);

    return null; // Side-effect only component
};

export default NotificationToastHandler;
