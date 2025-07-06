import { useState } from 'react'
import LocationInput from './components/LocationInput'
import AQIDisplay from './components/AQIDisplay'
import AlertModal from './components/AlertModal'
import NotificationManager from './components/NotificationManager'
import NotificationPermissionBanner from './components/NotificationPermissionBanner'
import PWAInstallPrompt from './components/PWAInstallPrompt'
import './App.css'
import './components/MobileOptimization.css'

function App() {
  const [aqiData, setAqiData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [alerts, setAlerts] = useState([])
  const [location, setLocation] = useState('')
  const [currentAlertIndex, setCurrentAlertIndex] = useState(0)
  const [showAlertModal, setShowAlertModal] = useState(false)

  // Replace with your IQAir API key
  const IQAIR_API_KEY = '045150f7-6f53-4775-a689-008875cea3a1'

  const fetchAQIData = async (city, state, country) => {
  setLoading(true)
  setError(null)
  setAlerts([])

  try {
    // Construct the IQAir URL
    const iqAirUrl = `https://api.airvisual.com/v2/city?city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}&country=${encodeURIComponent(country)}&key=${IQAIR_API_KEY}`

    console.log('IQAir URL:', iqAirUrl)
    const response = await fetch(iqAirUrl)
    if (!response.ok) {
      throw new Error(`IQAir API error: ${response.status} ${response.statusText}`)
    }
    const iqAirData = await response.json()
    console.log('IQAir response:', iqAirData)

    // If the API response does not signal success, throw an error:
    if (iqAirData.status !== 'success') {
      throw new Error('Error retrieving AQI data from IQAir')
    }
    
    // Pull out relevant data
    const aqi = iqAirData.data.current.pollution.aqius
    const combinedData = {
      location: `${iqAirData.data.city}, ${iqAirData.data.state}, ${iqAirData.data.country}`,
      aqi: aqi,
      // Add any extra data here as needed
    }
    
    setWeatherData(combinedData)  // You might want to rename weatherData to something more generic, like airData
    checkForAlerts(combinedData)
  } catch (err) {
    console.error('Error fetching AQI data:', err)
    setError(err.message)
    setWeatherData(null)
  } finally {
    setLoading(false)
  }
}


  const checkForAlerts = (data) => {
    const newAlerts = []
    
    // Get AQI value (US EPA standard)
    const aqi = data.current?.pollution?.aqius || 0
    
    // Alert for AQI > 150 (Unhealthy)
    if (aqi > 150) {
      newAlerts.push({
        type: 'danger',
        title: 'Unhealthy Air Quality - Wear a Mask!',
        message: `AQI is ${aqi}. Air quality is unhealthy for everyone. Wear a mask when going outside.`,
        showMaskButton: true
      })
    } else if (aqi > 100) {
      newAlerts.push({
        type: 'warning',
        title: 'Unhealthy for Sensitive Groups',
        message: `AQI is ${aqi}. Sensitive individuals should wear masks and limit outdoor exposure.`,
        showMaskButton: true
      })
    } else if (aqi > 50) {
      newAlerts.push({
        type: 'info',
        title: 'Moderate Air Quality',
        message: `AQI is ${aqi}. Air quality is acceptable for most people.`
      })
    }

    setAlerts(newAlerts)
    
    // Show modal if there are alerts
    if (newAlerts.length > 0) {
      setCurrentAlertIndex(0)
      setTimeout(() => {
        setShowAlertModal(true)
      }, 1000) // Show modal 1 second after AQI data loads
    }
  }

  const handleLocationSubmit = (locationInput) => {
    setLocation(locationInput)
    
    // Parse location input (city, state, country)
    const parts = locationInput.split(',').map(part => part.trim())
    
    if (parts.length === 1) {
      fetchAQIData(parts[0])
    } else if (parts.length === 2) {
      fetchAQIData(parts[0], parts[1])
    } else if (parts.length >= 3) {
      fetchAQIData(parts[0], parts[1], parts[2])
    }
  }

  const dismissAlert = () => {
    setShowAlertModal(false)
    
    // If there are more alerts, show the next one after a delay
    if (currentAlertIndex < alerts.length - 1) {
      setTimeout(() => {
        setCurrentAlertIndex(currentAlertIndex + 1)
        setShowAlertModal(true)
      }, 500)
    }
  }

  const handleBuyMask = () => {
    // Open Amazon search for N95 masks in a new tab
    window.open('https://www.amazon.com/s?k=n95+mask&ref=nb_sb_noss', '_blank')
  }

  const handleNotificationClick = () => {
    // Bring focus to the app and show modal if there are alerts
    if (alerts.length > 0) {
      setShowAlertModal(true)
    }
  }

  return (
    <div className="app">
      <NotificationPermissionBanner />
      <PWAInstallPrompt />
      
      <div className="app-container">
        <header className="app-header">
          <h1>🌫️ AQI Monitor</h1>
          <p>Check real-time Air Quality Index for any location worldwide</p>
        </header>

        <LocationInput onSubmit={handleLocationSubmit} loading={loading} />

        {error && (
          <div className="error-message">
            <span>❌</span>
            <p>{error}</p>
          </div>
        )}

        {aqiData && (
          <AQIDisplay data={aqiData} />
        )}

        {!aqiData && !loading && (
          <div className="welcome-message">
            <div className="welcome-content">
              <h2>Welcome to AQI Monitor</h2>
              <p>Enter a location to check current Air Quality Index levels</p>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-icon">🌫️</span>
                  <h3>Real-time AQI</h3>
                  <p>Get accurate air quality data from IQAir</p>
                </div>
                <div className="info-item">
                  <span className="info-icon">🔔</span>
                  <h3>Browser Notifications</h3>
                  <p>Get notified instantly when air quality is poor</p>
                </div>
                <div className="info-item">
                  <span className="info-icon">📱</span>
                  <h3>Mobile Optimized</h3>
                  <p>Works perfectly on all devices and can be installed as an app</p>
                </div>
              </div>
              <div style={{ marginTop: '20px', padding: '15px', background: '#f0f8ff', borderRadius: '10px' }}>
                <p><strong>Location Format:</strong></p>
                <p>• City only: "London"</p>
                <p>• City, State: "Los Angeles, California"</p>
                <p>• City, State, Country: "Mumbai, Maharashtra, India"</p>
              </div>
            </div>
          </div>
        )}

        {/* Modal Alert */}
        {alerts.length > 0 && (
          <AlertModal
            alert={alerts[currentAlertIndex]}
            onDismiss={dismissAlert}
            onBuyMask={alerts[currentAlertIndex]?.showMaskButton ? handleBuyMask : null}
            isVisible={showAlertModal}
          />
        )}

        {/* Notification Manager */}
        <NotificationManager 
          alerts={alerts} 
          onNotificationClick={handleNotificationClick}
        />
      </div>
    </div>
  )
}

export default App