import React from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import './NotificationSystem.css';

const NotificationItem = ({ notification, onRemove }) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'success': return 'check_circle';
      case 'error': return 'error';
      case 'warning': return 'warning';
      case 'info': return 'info';
      default: return 'info';
    }
  };

  return (
    <div className={`notification notification--${notification.type}`}>
      <div className="notification__content">
        <span className="material-symbols-outlined notification__icon">
          {getIcon()}
        </span>
        <div className="notification__message">
          {notification.title && (
            <div className="notification__title">{notification.title}</div>
          )}
          <div className="notification__text">{notification.message}</div>
        </div>
      </div>
      <button
        type="button"
        className="notification__close"
        onClick={() => onRemove(notification.id)}
      >
        <span className="material-symbols-outlined">close</span>
      </button>
    </div>
  );
};

const NotificationSystem = () => {
  const { notifications, removeNotification } = useNotifications();

  if (notifications.length === 0) return null;

  return (
    <div className="notification-system">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onRemove={removeNotification}
        />
      ))}
    </div>
  );
};

export default NotificationSystem;