export interface DailyWeatherItem {
  fxDate: string;
  iconDay: string;
  iconNight: string;
  sunset: string;
  textDay: string;
  textNight: string;
  windDirDay: string;
  windDirNight: string;
  tempMax: string;
  tempMin: string;
}

export interface CityItem {
  id: string;
  name: string;
}
