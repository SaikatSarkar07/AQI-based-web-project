import { useEffect } from 'react'

function NotificationManager({ alerts, onNotificationClick }) {
  useEffect(() => {
    // Request notification permission when component mounts
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  useEffect(() => {
    if (alerts.length > 0 && 'Notification' in window && Notification.permission === 'granted') {
      const alert = alerts[0] // Show notification for the first/most important alert
      
      const notificationOptions = {
        icon: getNotificationIcon(alert.type),
        badge: '/vite.svg',
        body: alert.message,
        tag: 'aqi-alert', // Prevents duplicate notifications
        requireInteraction: alert.type === 'danger', // Keep danger alerts visible until user interacts
        actions: alert.showMaskButton ? [
          {
            action: 'buy-mask',
            title: '😷 Buy N95 Masks',
            icon: '/vite.svg'
          },
          {
            action: 'dismiss',
            title: 'Dismiss',
            icon: '/vite.svg'
          }
        ] : [
          {
            action: 'dismiss',
            title: 'Got it!',
            icon: '/vite.svg'
          }
        ],
        data: {
          alertType: alert.type,
          showMaskButton: alert.showMaskButton
        }
      }

      const notification = new Notification(alert.title, notificationOptions)

      // Handle notification click
      notification.onclick = () => {
        window.focus() // Bring the browser window to focus
        onNotificationClick()
        notification.close()
      }

      // Handle notification action clicks (for browsers that support it)
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.addEventListener('notificationclick', (event) => {
          event.notification.close()
          
          if (event.action === 'buy-mask') {
            window.open('https://www.amazon.com/s?k=n95+mask&ref=nb_sb_noss', '_blank')
          }
          
          window.focus()
          onNotificationClick()
        })
      }

      // Auto-close notification after 10 seconds (except for danger alerts)
      if (alert.type !== 'danger') {
        setTimeout(() => {
          notification.close()
        }, 10000)
      }

      return () => {
        notification.close()
      }
    }
  }, [alerts, onNotificationClick])

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'danger': return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzIiIGZpbGw9IiNmNDQzMzYiLz4KPHN2ZyB4PSIxNiIgeT0iMTYiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJ3aGl0ZSI+CjxwYXRoIGQ9Ik0xIDIxaDIyTDEyIDJMMSAyMXptMTItM2gtMnYtMmgydjJ6bTAtNGgtMlY5aDJ2NXoiLz4KPHN2Zz4KPHN2Zz4='
      case 'warning': return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzIiIGZpbGw9IiNmZjk4MDAiLz4KPHN2ZyB4PSIxNiIgeT0iMTYiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJ3aGl0ZSI+CjxwYXRoIGQ9Ik0xIDIxaDIyTDEyIDJMMSAyMXptMTItM2gtMnYtMmgydjJ6bTAtNGgtMlY5aDJ2NXoiLz4KPHN2Zz4KPHN2Zz4='
      case 'info': return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzIiIGZpbGw9IiMyMTk2ZjMiLz4KPHN2ZyB4PSIxNiIgeT0iMTYiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJ3aGl0ZSI+CjxwYXRoIGQ9Ik0xMiAyQzYuNDggMiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyem0xIDE1aC0ydi02aDJ2NnptMC04aC0yVjdoMnYyeiIvPgo8L3N2Zz4KPHN2Zz4='
      default: return '/vite.svg'
    }
  }

  return null // This component doesn't render anything visible
}

export default NotificationManager