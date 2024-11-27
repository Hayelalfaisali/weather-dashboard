import axios from 'axios';

interface GeocodingResponse {
  results?: {
    latitude: number;
    longitude: number;
    name: string;
    country: string;
  }[];
  error?: boolean;
}

interface WeatherResponse {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    weather_code: number;
  };
}

const getWeatherDescription = (code: number): string => {
  const weatherCodes: { [key: number]: string } = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    71: 'Slight snow fall',
    73: 'Moderate snow fall',
    75: 'Heavy snow fall',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail',
  };
  
  return weatherCodes[code] || 'Unknown';
};

export const weatherApi = {
  getCoordinates: async (city: string) => {
    try {
      const response = await axios.get<GeocodingResponse>(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
      );

      if (!response.data.results?.length) {
        throw new Error('City not found');
      }

      return response.data.results[0];
    } catch (error) {
      throw new Error('Failed to find location');
    }
  },

  getCurrentWeather: async (city: string) => {
    try {
      // First get coordinates
      const coords = await weatherApi.getCoordinates(city);
      
      // Then get weather data
      const response = await axios.get<WeatherResponse>(
        `https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`
      );

      const weatherCode = response.data.current.weather_code;
      
      return {
        temperature: response.data.current.temperature_2m,
        humidity: response.data.current.relative_humidity_2m,
        windSpeed: response.data.current.wind_speed_10m,
        description: getWeatherDescription(weatherCode),
        icon: weatherCode,
      };
    } catch (error) {
      throw new Error('Failed to fetch weather data');
    }
  },
};
