import { useEffect, useState } from 'react'
import './AlertModal.css'

function AlertModal({ alert, onDismiss, onBuyMask, isVisible }) {
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (isVisible) {
      // Small delay to trigger entrance animation
      setTimeout(() => setShowModal(true), 100)
    } else {
      setShowModal(false)
    }
  }, [isVisible])

  const handleClose = () => {
    setShowModal(false)
    setTimeout(() => onDismiss(), 300) // Wait for exit animation
  }

  const getAlertIcon = (type) => {
    switch (type) {
      case 'danger': return '🚨'
      case 'warning': return '⚠️'
      case 'info': return 'ℹ️'
      default: return '🔔'
    }
  }

  const getAlertEmoji = (type) => {
    switch (type) {
      case 'danger': return '😷'
      case 'warning': return '😐'
      case 'info': return '😊'
      default: return '🤔'
    }
  }

  if (!isVisible) return null

  return (
    <div className={`alert-modal-overlay ${showModal ? 'show' : ''}`}>
      <div className={`alert-modal alert-modal-${alert.type} ${showModal ? 'show' : ''}`}>
        <div className="alert-modal-header">
          <div className="alert-modal-icon-container">
            <span className="alert-modal-icon">{getAlertIcon(alert.type)}</span>
            <div className="alert-modal-pulse"></div>
          </div>
          <button className="alert-modal-close" onClick={handleClose}>
            ✕
          </button>
        </div>

        <div className="alert-modal-content">
          <div className="alert-modal-emoji">
            <span>{getAlertEmoji(alert.type)}</span>
          </div>
          
          <h2 className="alert-modal-title">{alert.title}</h2>
          <p className="alert-modal-message">{alert.message}</p>

          <div className="alert-modal-actions">
            {alert.showMaskButton && (
              <button className="alert-modal-buy-button" onClick={onBuyMask}>
                <span className="button-icon">😷</span>
                <span>Buy N95 Masks Now</span>
                <span className="button-arrow">→</span>
              </button>
            )}
            
            <button className="alert-modal-dismiss-button" onClick={handleClose}>
              <span>Got it!</span>
            </button>
          </div>
        </div>

        <div className="alert-modal-decoration">
          <div className="floating-particles"></div>
        </div>
      </div>
    </div>
  )
}

export default AlertModal