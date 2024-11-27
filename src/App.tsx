import { useState } from 'react'
import styled from 'styled-components'
import { useWeatherStore } from './store/weatherStore'
import { weatherApi } from './services/weatherApi'
import { toast, Toaster } from 'react-hot-toast'
import { WiCloud, WiCloudy, WiRainMix, WiSnow, WiStormShowers, WiHumidity, WiStrongWind } from 'react-icons/wi'

const getWeatherIcon = (code: number) => {
  if (code === 0 || code === 1) return <WiCloud size={84} />
  if (code === 2 || code === 3) return <WiCloudy size={84} />
  if (code >= 45 && code <= 48) return <WiCloudy size={84} />
  if (code >= 51 && code <= 65) return <WiRainMix size={84} />
  if (code >= 71 && code <= 77) return <WiSnow size={84} />
  if (code >= 80 && code <= 82) return <WiRainMix size={84} />
  if (code >= 85 && code <= 86) return <WiSnow size={84} />
  if (code >= 95) return <WiStormShowers size={84} />
  return <WiCloud size={84} />
}

const App = () => {
  const [searchInput, setSearchInput] = useState('')
  const { 
    currentWeather,
    setCurrentWeather,
    setLoading,
    setError,
    isLoading 
  } = useWeatherStore()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchInput.trim()) return

    setLoading(true)
    try {
      const data = await weatherApi.getCurrentWeather(searchInput)
      setCurrentWeather(data)
      setError(null)
      toast.success(`Weather data loaded for ${searchInput}`)
    } catch (error) {
      toast.error('Failed to fetch weather data')
      setError('Failed to fetch weather data')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppContainer>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />
      <GlassCard>
        <Title>Weather Dashboard</Title>
        
        <SearchForm onSubmit={handleSearch}>
          <SearchInput
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Enter city name..."
          />
          <SearchButton type="submit" disabled={isLoading}>
            {isLoading ? 'Searching...' : 'Search'}
          </SearchButton>
        </SearchForm>

        {currentWeather && (
          <WeatherCard>
            <LocationName>{searchInput}</LocationName>
            <IconContainer>
              {getWeatherIcon(currentWeather.icon)}
            </IconContainer>
            <Temperature>{currentWeather.temperature}°C</Temperature>
            <Description>{currentWeather.description}</Description>
            <WeatherInfo>
              <InfoItem>
                <WiHumidity size={24} />
                <Label>Humidity</Label>
                <Value>{currentWeather.humidity}%</Value>
              </InfoItem>
              <InfoItem>
                <WiStrongWind size={24} />
                <Label>Wind Speed</Label>
                <Value>{currentWeather.windSpeed} m/s</Value>
              </InfoItem>
            </WeatherInfo>
          </WeatherCard>
        )}
      </GlassCard>
    </AppContainer>
  )
}

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #00b4db, #0083b0);
  padding: 2rem;
`

const GlassCard = styled.div`
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  border: 1px solid rgba(255, 255, 255, 0.18);
  width: 100%;
  max-width: 500px;
`

const Title = styled.h1`
  color: white;
  margin-bottom: 2rem;
  text-align: center;
  font-size: 2.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
`

const SearchForm = styled.form`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  justify-content: center;
`

const SearchInput = styled.input`
  padding: 0.8rem 1.2rem;
  font-size: 1rem;
  border: none;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.9);
  width: 300px;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5);
  }
`

const SearchButton = styled.button`
  padding: 0.8rem 1.2rem;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.9);
  color: #0083b0;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;
  
  &:hover {
    background: white;
    transform: translateY(-2px);
  }
  
  &:disabled {
    background: rgba(255, 255, 255, 0.5);
    cursor: not-allowed;
    transform: none;
  }
`

const WeatherCard = styled.div`
  text-align: center;
  color: white;
`

const LocationName = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 1rem;
  text-transform: capitalize;
`

const IconContainer = styled.div`
  margin: 1rem 0;
  color: white;
`

const Temperature = styled.div`
  font-size: 3rem;
  font-weight: bold;
  margin: 1rem 0;
`

const Description = styled.div`
  font-size: 1.2rem;
  margin-bottom: 2rem;
  text-transform: capitalize;
`

const WeatherInfo = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 1.5rem;
`

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`

const Label = styled.span`
  font-size: 0.9rem;
  opacity: 0.9;
`

const Value = styled.span`
  font-size: 1.2rem;
  font-weight: bold;
`

export default App
