import * as ELEMENTS from "/elements.js";
import {Http} from "/http.js";
import {WeatherData, WEATHER_PROXY_HANDLER} from '/weather-data.js';

// https://openweathermap.org/
const YOUR_API_KEY = '...';

ELEMENTS.ELEMENT_SEARCH_BUTTON.addEventListener("click", searchWeather)

function searchWeather() {
  const CITY_NAME = ELEMENTS.ELEMENT_SEARCHED_CITY.value.trim();

  if (CITY_NAME.length == 0) {
    return alert("Please, enter city name")
  }

  ELEMENTS.ELEMENT_LOADING_TEXT.style.display = 'block';
  ELEMENTS.ELEMENT_WEATHER_BOX.style.display = 'none';

  const URL = `http://api.openweathermap.org/data/2.5/weather?q=${CITY_NAME}&units=metric&appid=${YOUR_API_KEY}`

  Http.fetchData(URL)
    .then( responseData => {
      // создание объекта с данными о погоде
      const WEATHER_DATA = new WeatherData(CITY_NAME, responseData.weather[0].description.toUpperCase());
      // создание прокси для объекта погоды WEATHER_DATA
      const WEATHER_PROXY = new Proxy(WEATHER_DATA, WEATHER_PROXY_HANDLER);

      // определение температуры в фаренгейтах через прокси
      WEATHER_PROXY.temperature = responseData.main.temp;
      updateWeather(WEATHER_PROXY);
    })
    .catch(err => console.log(err));
}

function updateWeather(weatherData) {
  console.log(weatherData);
  ELEMENTS.ELEMENT_WEATHER_CITY.textContent = weatherData.cityName;
  ELEMENTS.ELEMENT_WEATHER_DESCRIPTION.textContent = weatherData.description;
  ELEMENTS.ELEMENT_WEATHER_TEMPERATURE.textContent = weatherData.temperature;

  ELEMENTS.ELEMENT_LOADING_TEXT.style.display = 'none';
  ELEMENTS.ELEMENT_WEATHER_BOX.style.display = 'block';
}