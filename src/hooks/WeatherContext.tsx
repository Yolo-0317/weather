import React, { createContext, useCallback, useEffect, useState } from "react";
import { DailyWeatherItem } from "@/types/App";
import request from "@/utils/request";

interface WeatherContextType {
  data: DailyWeatherItem[];
  updateTime: string;
  loading: boolean;
  getWeatherData: (location: string) => void;
}

export const WeatherContext = createContext<WeatherContextType>({
  data: [],
  updateTime: "",
  loading: true,
  getWeatherData: () => {},
});

export const WeatherContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [data, setData] = useState<DailyWeatherItem[]>([]);
  const [updateTime, setUpdateTime] = useState("");
  const [loading, setLoading] = useState(true);

  const getWeatherData = useCallback((location: string) => {
    setLoading(true);
    request({ url: `/v7/weather/7d?location=${location}` })
      .then((res) => {
        if (res.data.code === "200") {
          setData(res.data.daily);
          setUpdateTime(
            `(${res.data.updateTime.substring(
              0,
              10
            )} ${res.data.updateTime.substring(11, 16)})`
          );
        }
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <WeatherContext.Provider
      value={{ data, updateTime, loading, getWeatherData }}
    >
      {children}
    </WeatherContext.Provider>
  );
};
