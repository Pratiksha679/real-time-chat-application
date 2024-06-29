export const unreadNotifications = (notifications) => {
    return notifications.filter((notification) => {
        return notification.isRead !== true
    })
}