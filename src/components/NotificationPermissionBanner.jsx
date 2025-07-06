import { useState, useEffect } from 'react'
import './MobileOptimization.css'

function NotificationPermissionBanner() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    // Check if notifications are supported and permission is default
    if ('Notification' in window && Notification.permission === 'default') {
      // Show banner after a short delay
      setTimeout(() => {
        setShowBanner(true)
      }, 3000)
    }
  }, [])

  const handleAllow = async () => {
    try {
      const permission = await Notification.requestPermission()
      if (permission === 'granted') {
        console.log('Notification permission granted')
        // Show a test notification
        new Notification('AQI Monitor', {
          body: 'You\'ll now receive air quality alerts!',
          icon: '/vite.svg',
          tag: 'welcome'
        })
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error)
    }
    setShowBanner(false)
  }

  const handleDeny = () => {
    setShowBanner(false)
    // Remember user's choice for this session
    sessionStorage.setItem('notification-permission-denied', 'true')
  }

  // Don't show if user already denied this session
  if (sessionStorage.getItem('notification-permission-denied')) {
    return null
  }

  if (!showBanner || !('Notification' in window)) return null

  return (
    <div className={`notification-permission-banner ${showBanner ? 'show' : ''}`}>
      <p>🔔 Get instant air quality alerts on your device</p>
      <div className="notification-permission-buttons">
        <button className="notification-permission-button primary" onClick={handleAllow}>
          Allow Notifications
        </button>
        <button className="notification-permission-button" onClick={handleDeny}>
          Not Now
        </button>
      </div>
    </div>
  )
}

export default NotificationPermissionBanner