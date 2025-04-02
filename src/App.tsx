import "qweather-icons/font/qweather-icons.css";

import "./App.less";
import { WeatherContextProvider } from "./hooks/WeatherContext";
import { CityContextProvider } from "./hooks/CityContext";
import DailyWeather from "./views/DailyWeather";

function App() {
  return (
    <WeatherContextProvider>
      <CityContextProvider>
        <DailyWeather />
      </CityContextProvider>
    </WeatherContextProvider>
  );
}

export default App;
