import './AlertNotification.css'

function AlertNotification({ alert, onDismiss, onBuyMask }) {
  const getAlertIcon = (type) => {
    switch (type) {
      case 'danger': return '🚨'
      case 'warning': return '⚠️'
      case 'info': return 'ℹ️'
      default: return '🔔'
    }
  }

  return (
    <div className={`alert-notification alert-${alert.type}`}>
      <div className="alert-content">
        <span className="alert-icon">{getAlertIcon(alert.type)}</span>
        <div className="alert-text">
          <h4>{alert.title}</h4>
          <p>{alert.message}</p>
          {alert.showMaskButton && (
            <button className="buy-mask-button" onClick={onBuyMask}>
              😷 Buy N95 Masks
            </button>
          )}
        </div>
      </div>
      <button className="alert-dismiss" onClick={onDismiss}>
        ✕
      </button>
    </div>
  )
}

export default AlertNotification