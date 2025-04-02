import { CityItem } from "@/types/App";
import request from "@/utils/request";
import React, { createContext, useState } from "react";

interface CityContextType {
  data: CityItem[];
  cityId: string;
  cityName: string;
  getCityData: (location: string) => void;
  setCityId: (cityId: string) => void;
  setCityName: (cityName: string) => void;
}

const SHCityId = "101020100";
const SHCityName = "上海";

export const CityContext = createContext<CityContextType>({
  data: [],
  cityId: SHCityId,
  cityName: SHCityName,
  getCityData: () => {},
  setCityId: () => {},
  setCityName: () => {},
});

export const CityContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [data, setData] = useState<CityItem[]>([]);
  const [cityId, setCityId] = useState(SHCityId);
  const [cityName, setCityName] = useState(SHCityName);

  const getCityData = (location: string) => {
    if (/^[a-zA-Z]$/.test(location)) {
      return;
    }
    request({
      url: "http://localhost:3001/geo/city/lookup",
      params: { location, range: "cn", number: 20 },
    })
      .then((res) => {
        const data = res.data.data.map((item: CityItem) => ({
          id: item.id,
          name: item.name,
        }));
        setData(data);
      })
      .catch(() => {});
  };

  return (
    <CityContext.Provider
      value={{ data, getCityData, cityName, cityId, setCityId, setCityName }}
    >
      {children}
    </CityContext.Provider>
  );
};
