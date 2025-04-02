import { CityContext } from "@/hooks/CityContext";
import { WeatherContext } from "@/hooks/WeatherContext";
import { useContext, useEffect, useState } from "react";
import ReactSelect, {
  GroupBase,
  Options,
  PropsValue,
  SingleValue,
} from "react-select";

interface CitySelectInterface {
  cityId: PropsValue<OptionType>;
  options: Options<{
    label: string;
    value: string;
  }>;
}

export type OptionType = {
  label: string;
  value: string;
};

const CitySelect = ({
  cityId,
  options,
}: CitySelectInterface): React.ReactNode => {
  const { cityName, getCityData, setCityName } = useContext(CityContext);
  const [inputValue, setInputValue] = useState<string>(cityName);
  const { getWeatherData } = useContext(WeatherContext);

  const handleChange = (selected: SingleValue<OptionType>) => {
    if (selected) {
      getWeatherData(selected.value);
      setCityName(selected.label);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue) {
        getCityData(inputValue);
      }
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [inputValue]);

  const handleInputChange = (newValue: string) => {
    // 更新输入框的值
    setInputValue(newValue);
  };

  const renderEmptyText = () => "暂无数据";

  const renderFilterOptions = () => {
    return true;
  };

  return (
    <ReactSelect<OptionType, false, GroupBase<OptionType>>
      value={cityId}
      onChange={handleChange}
      options={options}
      isSearchable
      placeholder="搜索切换城市"
      onInputChange={handleInputChange}
      inputValue={inputValue}
      noOptionsMessage={renderEmptyText}
      filterOption={renderFilterOptions}
    />
  );
};

export default CitySelect;
