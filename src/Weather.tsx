import React, { useState, useEffect, createContext, useContext } from "react";
import axios from "axios";
import {
  FaSun,
  FaCloudRain,
  FaCloud,
  FaSnowflake,
  FaCalendarAlt,
} from "react-icons/fa";
import { ADToBS } from "bikram-sambat-js";

// Import localization files
import en from "./en.json";
import np from "./ne.json";

interface Weather {
  id: number;
  description: string;
}

interface Main {
  temp: number;
}

interface ForecastData {
  weather: Weather[];
  main: Main;
}

const locales: Record<string, Record<string, string>> = {
  en,
  np,
};

const ThemeContext = createContext<{
  darkMode: boolean;
  toggleTheme: () => void;
  locale: { [key: string]: string };
}>({
  darkMode: false,
  toggleTheme: () => {},
  locale: en, // Default locale is English
});

const Weather: React.FC = () => {
  const [cityName, setCityName] = useState<string>("");
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);
  const [currentWeather, setCurrentWeather] = useState<ForecastData | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [searchCity, setSearchCity] = useState<string>("");
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [currentDate, setCurrentDate] = useState<string>(); // State to store the current date
  const [locale, setLocale] = useState<Record<string, string>>(en); // State to store the current locale

  const weatherDescriptionMap: {
    [key: string]: { icon: JSX.Element; label: string };
  } = {
    "few clouds": { icon: <FaCloud size={50} />, label: locale.cloudy },
    "scattered clouds": { icon: <FaCloud size={50} />, label: locale.cloudy },
    "broken clouds": { icon: <FaCloud size={50} />, label: locale.cloudy },
    "overcast clouds": { icon: <FaCloud size={50} />, label: locale.cloudy },
    "light rain": { icon: <FaCloudRain size={50} />, label: locale.rainy },
    "moderate rain": { icon: <FaCloudRain size={50} />, label: locale.rainy },
    "heavy intensity rain": {
      icon: <FaCloudRain size={50} />,
      label: locale.rainy,
    },
    "light snow": { icon: <FaSnowflake size={50} />, label: locale.snowy },
    "moderate snow": { icon: <FaSnowflake size={50} />, label: locale.snowy },
    "heavy snow": { icon: <FaSnowflake size={50} />, label: locale.snowy },
    "clear sky": { icon: <FaSun size={50} />, label: locale.clear },
  };

  useEffect(() => {
    if (cityName) {
      if (typingTimeout) clearTimeout(typingTimeout);
      const timeout = setTimeout(() => fetchWeather(), 1000);
      setTypingTimeout(timeout);
    }
  }, [cityName]);

  useEffect(() => {
    const fetchDate = new Date();
    const convertedDate = ADToBS(fetchDate);

    setCurrentDate(convertedDate); // Update current date when component mounts
  }, []);

  const fetchWeather = async () => {
    try {
      const apiKey = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`
      );
      setForecastData(response.data.list);
      setCurrentWeather(response.data.list[0]);
      setError(null);
    } catch (error) {
      setError(locale.errorCityNotFound);
      setForecastData([]);
      setCurrentWeather(null);
    }
  };

  const handleSearch = () => setCityName(searchCity);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearchCity(e.target.value);

  const toggleTheme = () => setDarkMode(!darkMode);

  const changeLanguage = (language: string) => {
    setLocale(locales[language]);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme, locale }}>
      <div
        className={`p-4 md:p-20 ${darkMode ? "bg-gray-900" : "bg-gray-300"}`}
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <FaCalendarAlt size={20} className="mr-2" />
            <span className={`ml-2 ${darkMode ? "text-white" : "text-black"}`}>
              {currentDate}
            </span>
          </div>
          <h1
            className={`text-2xl md:text-4xl font-bold text-green-500 ${
              darkMode && "text-white"
            }`}
          >
            {locale.appTitle}
            {currentWeather && (
              <div className="mt-9 object-cover ">
                {
                  weatherDescriptionMap[currentWeather.weather[0].description]
                    .icon
                }
              </div>
            )}
          </h1>
          <LanguageSwitcher changeLanguage={changeLanguage} />
        </div>
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center">
            <input
              type="text"
              value={searchCity}
              onChange={handleInputChange}
              placeholder={locale.searchPlaceholder}
              className={`p-2 mr-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                darkMode ? "text-white" : "text-black"
              }`}
            />
            <button
              onClick={handleSearch}
              className={`p-2 bg-green-500 text-white rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                darkMode && "bg-white text-black"
              }`}
            >
              {locale.searchButton}
            </button>
            <DarkModeToggle />
          </div>
          {error ? (
            <p className={`text-red-500 ${darkMode && "text-white"}`}>
              {error}
            </p>
          ) : (
            <>
              {currentWeather && (
                <div
                  className={`p-8 rounded-xl shadow-xl text-center ${
                    darkMode
                      ? "bg-gray-800 text-white"
                      : "bg-green-500 text-white"
                  }`}
                >
                  <div className="flex items-center justify-center mb-4">
                    {weatherDescriptionMap[
                      currentWeather.weather[0].description
                    ].icon && (
                      <div className="mr-4">
                        {
                          weatherDescriptionMap[
                            currentWeather.weather[0].description
                          ].icon
                        }
                      </div>
                    )}
                    <p className="text-4xl">
                      {Math.round(currentWeather.main.temp - 273.15)}°C
                    </p>
                  </div>
                  <div className="text-3xl mt-2">
                    <p className="text-lg">
                      {
                        weatherDescriptionMap[
                          currentWeather.weather[0].description
                        ].label
                      }
                    </p>
                  </div>
                  <p className="text-sm mt-2">{currentDate}</p>
                </div>
              )}
              {forecastData.length > 0 && (
                <div className="mt-4">
                  <p className="font-bold">{locale.upcomingForecast}:</p>
                  <div className="flex flex-row flex-wrap justify-center space-x-4">
                    {forecastData
                      .slice(1, 6)
                      .map((forecast: ForecastData, index: number) => (
                        <div
                          key={index}
                          className={`p-4 rounded-md shadow-md text-center ${
                            darkMode
                              ? "bg-gray-800 text-white"
                              : "bg-white text-black"
                          }`}
                        >
                          <p className="text-2xl mt-4">
                            {Math.round(forecast.main.temp - 273.15)}°C
                          </p>
                          <p className="text-lg mt-2">
                            {
                              weatherDescriptionMap[
                                forecast.weather[0].description
                              ].label
                            }
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </ThemeContext.Provider>
  );
};

const DarkModeToggle: React.FC = () => {
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  return (
    <button
      onClick={toggleTheme}
      className={`p-2 bg-${darkMode ? "white" : "black"} text-${
        darkMode ? "black" : "white"
      } rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
    >
      {darkMode ? "Light Mode" : "Dark Mode"}
    </button>
  );
};

const LanguageSwitcher: React.FC<{
  changeLanguage: (lang: string) => void;
}> = ({ changeLanguage }) => {
  const { darkMode, locale } = useContext(ThemeContext);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    changeLanguage(e.target.value);
  };

  return (
    <select
      className={`p-2 bg-${darkMode ? "white" : "black"} text-${
        darkMode ? "black" : "white"
      } rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
      onChange={handleLanguageChange}
    >
      <option value="en">English</option>
      <option value="np">नेपाली</option>
    </select>
  );
};

export { DarkModeToggle };
export default Weather;
