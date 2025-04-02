import request from "@/utils/request";
import dayjs from "dayjs";
import { useContext, useEffect, useMemo, useState } from "react";

import { CityContext } from "@/hooks/CityContext";
import { WeatherContext } from "@/hooks/WeatherContext";
import { DailyWeatherItem } from "@/types/App";
import CitySelect from "./CitySelector";

const DailyWeather = () => {
  const [tokenExpired, setTokenExpired] = useState(true);
  const [tokenLoading, setTokenLoading] = useState(false);
  const {
    data: dailyWeather,
    updateTime,
    loading: dailyWeatherLoading,
    getWeatherData,
  } = useContext(WeatherContext);
  const { data: cityData, cityId, cityName } = useContext(CityContext);

  useEffect(() => {
    const jwtTokenExp = Number(localStorage.getItem("jwtTokenExp"));
    const nowSecond = dayjs().unix();
    if (!jwtTokenExp || nowSecond >= jwtTokenExp) {
      setTokenLoading(true);
      request({
        url: "http://localhost:3001/login",
      })
        .then((res) => {
          if (res.data.token) {
            localStorage.setItem("jwtToken", res.data.token);
            localStorage.setItem("jwtTokenExp", res.data.expire);
            setTokenExpired(false);
          }
        })
        .catch(() => {})
        .finally(() => {
          setTokenLoading(false);
        });
    } else {
      setTokenExpired(false);
    }
  }, []);

  useEffect(() => {
    if (!tokenExpired) {
      getWeatherData(cityId);
    }
  }, [cityId, tokenExpired, getWeatherData]);

  function refresh() {
    getWeatherData(cityId);
  }

  const options = useMemo(() => {
    return cityData.map(({ id, name }) => ({
      label: name,
      value: id,
    }));
  }, [cityData]);

  let content = null;
  let loadingComponent = null;

  const loading = tokenLoading || dailyWeatherLoading;

  if (loading) {
    loadingComponent = <div className="loadingText">加载中...</div>;
  }

  if (!loading) {
    content = (
      <div className="content">
        {dailyWeather.map((item: DailyWeatherItem) => {
          return (
            <div className="dailyWeather" key={item.fxDate}>
              <div>{item.fxDate}</div>
              <div className="icon">
                <i className={`qi-${item.iconDay}`} />
              </div>
              <div>{item.textDay}</div>
              <div>{item.windDirDay}</div>
              <div className="tempMax">{`${item.tempMax}°C`}</div>
              <div className="separation"></div>
              <div className="tempMin">{`${item.tempMin}°C`}</div>
              <div className="icon">
                <i className={`qi-${item.iconNight}`} />
              </div>
              <div>{item.textNight}</div>
              <div>{item.windDirNight}</div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <>
      <CitySelect
        cityId={{ label: cityName, value: cityId }}
        options={options}
      />
      <div className="container">
        <div className="header">
          <div>
            <span className="cityName">{cityName}</span>
            <span>7天天气预报{updateTime}</span>
          </div>
          <span className="refresh" onClick={refresh}>
            刷新
          </span>
        </div>
        {loadingComponent}
        {content}
      </div>
    </>
  );
};

export default DailyWeather;
