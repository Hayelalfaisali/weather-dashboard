import { create } from 'zustand'

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: number;
}

interface WeatherStore {
  currentWeather: WeatherData | null;
  forecast: WeatherData[];
  location: string;
  isLoading: boolean;
  error: string | null;
  setCurrentWeather: (weather: WeatherData) => void;
  setForecast: (forecast: WeatherData[]) => void;
  setLocation: (location: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useWeatherStore = create<WeatherStore>((set) => ({
  currentWeather: null,
  forecast: [],
  location: '',
  isLoading: false,
  error: null,
  setCurrentWeather: (weather) => set({ currentWeather: weather }),
  setForecast: (forecast) => set({ forecast }),
  setLocation: (location) => set({ location }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}))
