import './AQIDisplay.css'

function AQIDisplay({ data }) {
  const { city, state, country, current } = data
  const aqi = current?.pollution?.aqius || 0
  const mainPollutant = current?.pollution?.mainus || 'N/A'
  const weather = current?.weather || {}

  const getAQILevel = (aqi) => {
    if (aqi <= 50) return { 
      label: 'Good', 
      color: '#00e400', 
      description: 'Air quality is satisfactory',
      image: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=800',
      animation: 'good'
    }
    if (aqi <= 100) return { 
      label: 'Moderate', 
      color: '#ffff00', 
      description: 'Air quality is acceptable',
      image: 'https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=800',
      animation: 'moderate'
    }
    if (aqi <= 150) return { 
      label: 'Unhealthy for Sensitive Groups', 
      color: '#ff7e00', 
      description: 'Sensitive people may experience problems',
      image: 'https://images.pexels.com/photos/3952048/pexels-photo-3952048.jpeg?auto=compress&cs=tinysrgb&w=800',
      animation: 'sensitive'
    }
    if (aqi <= 200) return { 
      label: 'Unhealthy', 
      color: '#ff0000', 
      description: 'Everyone may experience problems',
      image: 'https://images.pexels.com/photos/4226881/pexels-photo-4226881.jpeg?auto=compress&cs=tinysrgb&w=800',
      animation: 'unhealthy'
    }
    if (aqi <= 300) return { 
      label: 'Very Unhealthy', 
      color: '#8f3f97', 
      description: 'Health alert: everyone may experience serious effects',
      image: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=800',
      animation: 'very-unhealthy'
    }
    return { 
      label: 'Hazardous', 
      color: '#7e0023', 
      description: 'Emergency conditions: entire population affected',
      image: 'https://images.pexels.com/photos/2346091/pexels-photo-2346091.jpeg?auto=compress&cs=tinysrgb&w=800',
      animation: 'hazardous'
    }
  }

  const aqiLevel = getAQILevel(aqi)

  const getPollutantName = (pollutant) => {
    const pollutants = {
      'p2': 'PM2.5',
      'p1': 'PM10',
      'o3': 'Ozone',
      'n2': 'NO2',
      's2': 'SO2',
      'co': 'Carbon Monoxide'
    }
    return pollutants[pollutant] || pollutant
  }

  return (
    <div className="aqi-display">
      <div className="location-header">
        <h2>📍 {city}{state && `, ${state}`}{country && `, ${country}`}</h2>
        <div className="last-updated">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      <div className="aqi-visual-section">
        <div className="aqi-image-container">
          <img 
            src={aqiLevel.image} 
            alt={`Air quality: ${aqiLevel.label}`}
            className={`aqi-image aqi-${aqiLevel.animation}`}
          />
          <div className={`aqi-overlay aqi-overlay-${aqiLevel.animation}`}>
            <div className="aqi-particles"></div>
          </div>
        </div>
        
        <div className="aqi-main-card">
          <div className="aqi-circle" style={{ borderColor: aqiLevel.color }}>
            <div className="aqi-value" style={{ color: aqiLevel.color }}>
              {aqi}
            </div>
            <div className="aqi-label">AQI</div>
          </div>
          
          <div className="aqi-info">
            <h3 style={{ color: aqiLevel.color }}>{aqiLevel.label}</h3>
            <p>{aqiLevel.description}</p>
            <div className="main-pollutant">
              <strong>Main Pollutant:</strong> {getPollutantName(mainPollutant)}
            </div>
          </div>
        </div>
      </div>

      <div className="aqi-scale">
        <h4>AQI Scale</h4>
        <div className="scale-bars">
          <div className="scale-bar" style={{ backgroundColor: '#00e400' }}>
            <span>0-50</span>
            <span>Good</span>
          </div>
          <div className="scale-bar" style={{ backgroundColor: '#ffff00', color: '#000' }}>
            <span>51-100</span>
            <span>Moderate</span>
          </div>
          <div className="scale-bar" style={{ backgroundColor: '#ff7e00' }}>
            <span>101-150</span>
            <span>Unhealthy for Sensitive</span>
          </div>
          <div className="scale-bar" style={{ backgroundColor: '#ff0000' }}>
            <span>151-200</span>
            <span>Unhealthy</span>
          </div>
          <div className="scale-bar" style={{ backgroundColor: '#8f3f97' }}>
            <span>201-300</span>
            <span>Very Unhealthy</span>
          </div>
          <div className="scale-bar" style={{ backgroundColor: '#7e0023' }}>
            <span>301+</span>
            <span>Hazardous</span>
          </div>
        </div>
      </div>

      {weather && (
        <div className="weather-info">
          <h4>Current Weather</h4>
          <div className="weather-grid">
            <div className="weather-item">
              <span className="weather-label">Temperature</span>
              <span className="weather-value">{weather.tp}°C</span>
            </div>
            <div className="weather-item">
              <span className="weather-label">Humidity</span>
              <span className="weather-value">{weather.hu}%</span>
            </div>
            <div className="weather-item">
              <span className="weather-label">Pressure</span>
              <span className="weather-value">{weather.pr} hPa</span>
            </div>
            <div className="weather-item">
              <span className="weather-label">Wind Speed</span>
              <span className="weather-value">{weather.ws} m/s</span>
            </div>
          </div>
        </div>
      )}

      <div className="health-recommendations">
        <h4>Health Recommendations</h4>
        <div className="recommendations">
          {aqi <= 50 && (
            <p>✅ Air quality is good. Enjoy outdoor activities!</p>
          )}
          {aqi > 50 && aqi <= 100 && (
            <p>⚠️ Air quality is moderate. Sensitive individuals should consider limiting prolonged outdoor exertion.</p>
          )}
          {aqi > 100 && aqi <= 150 && (
            <p>🔶 Unhealthy for sensitive groups. Children, elderly, and people with respiratory conditions should limit outdoor activities.</p>
          )}
          {aqi > 150 && aqi <= 200 && (
            <p>🔴 Unhealthy air quality. Everyone should limit outdoor activities and wear masks when outside.</p>
          )}
          {aqi > 200 && aqi <= 300 && (
            <p>🟣 Very unhealthy air quality. Avoid outdoor activities and wear N95 masks if you must go outside.</p>
          )}
          {aqi > 300 && (
            <p>⚫ Hazardous air quality. Stay indoors and avoid all outdoor activities.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default AQIDisplay