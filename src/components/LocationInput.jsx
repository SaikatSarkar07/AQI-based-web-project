import { useState } from 'react'
import './LocationInput.css'

function LocationInput({ onSubmit, loading }) {
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [country, setCountry] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (city.trim()) {
      // Combine the inputs into a single location string
      const locationParts = [city.trim()]
      if (state.trim()) locationParts.push(state.trim())
      if (country.trim()) locationParts.push(country.trim())
      
      const locationString = locationParts.join(', ')
      onSubmit(locationString)
    }
  }

  const clearForm = () => {
    setCity('')
    setState('')
    setCountry('')
  }

  return (
    <div className="location-input">
      <form onSubmit={handleSubmit} className="location-form">
        <div className="inputs-container">
          <div className="input-row">
            <div className="input-field-container">
              <label htmlFor="city">City *</label>
              <input
                id="city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g., Mumbai, London, New York"
                className="location-input-field"
                disabled={loading}
                required
              />
            </div>
            
            <div className="input-field-container">
              <label htmlFor="state">State/Province</label>
              <input
                id="state"
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="e.g., Maharashtra, California"
                className="location-input-field"
                disabled={loading}
              />
            </div>
            
            <div className="input-field-container">
              <label htmlFor="country">Country</label>
              <input
                id="country"
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="e.g., India, USA, UK"
                className="location-input-field"
                disabled={loading}
              />
            </div>
          </div>
          
          <div className="button-row">
            <button 
              type="submit" 
              className="search-button"
              disabled={loading || !city.trim()}
            >
              {loading ? (
                <>
                  <span className="loading-spinner">🔄</span>
                  Searching...
                </>
              ) : (
                <>
                  <span>🔍</span>
                  Search AQI
                </>
              )}
            </button>
            
            <button 
              type="button" 
              className="clear-button"
              onClick={clearForm}
              disabled={loading}
            >
              <span>🗑️</span>
              Clear
            </button>
          </div>
        </div>
      </form>
      
      <div className="input-help">
        <p><strong>Tips:</strong></p>
        <ul>
          <li>City name is required</li>
          <li>State/Province and Country are optional but help get more accurate results</li>
          <li>Use English names for better results</li>
        </ul>
      </div>
    </div>
  )
}

export default LocationInput