// Date and Time Functions
//----------------------------------------------
function formatDate(date) {
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }

  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let dayIndex = date.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[dayIndex];

  return `${day} ${hours}:${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

// Display Forecast
//----------------------------------------------
function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
      <div class="col-2">
        <div class="weather-forecast-date">${formatDay(forecastDay.time)}</div>
        <img
          src="http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${
            forecastDay.condition.icon
          }.png"
          alt=""
          width="42"
        />
        <div class="weather-forecast-temperatures">
          <span class="weather-forecast-temperature-max">${Math.round(
            forecastDay.temperature.maximum
          )}°</span>
          <span class="weather-forecast-temperature-min">${Math.round(
            forecastDay.temperature.minimum
          )}°</span>
        </div>
      </div>
  

  `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(query) {
  let apiKey = "73453af9f4a0a21aof85fet5591b1ffd";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${query}&key=${apiKey}&units=imperial`;
  axios.get(apiUrl).then(displayForecast);
}

// Display Current Date and Time
//----------------------------------------------
let dateElement = document.querySelector("#date");
let now = new Date();
dateElement.innerHTML = formatDate(now);

// Weather Functions
//----------------------------------------------
function showCurrentCityTemperature(response) {
  let temperatureElement = document.querySelector("#temperature-value");
  fahrenheitLinkTemperature = response.data.temperature.current;
  temperatureElement.innerHTML = Math.round(fahrenheitLinkTemperature);
  document.querySelector("#city").innerHTML = response.data.city;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#humidity").innerHTML =
    response.data.temperature.humidity;
  document.querySelector("#description").innerHTML =
    response.data.condition.description;
  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png`
  );
  getForecast(response.data.city);
}

function getWeatherByCity(city) {
  let apiKey = "73453af9f4a0a21aof85fet5591b1ffd";
  let units = "imperial";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&units=${units}&key=${apiKey}`;
  axios.get(apiUrl).then(showCurrentCityTemperature);
}

// Handle City Search
//----------------------------------------------
function cityEntered(event) {
  event.preventDefault();
  let city = document.querySelector("#city");
  let cityValue = document.querySelector("#city-input");
  city.innerHTML = cityValue.value;
}

let enterACity = document.querySelector("#enter-location");
enterACity.addEventListener("submit", cityEntered);

// Geolocation Functions
//----------------------------------------------
function showPosition(position) {
  let apiKey = "73453af9f4a0a21aof85fet5591b1ffd";
  let units = "imperial";
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiUrl = `https://api.shecodes.io/weather/v1/current?lon=${lon}&lat=${lat}&units=${units}&key=${apiKey}`;
  axios.get(apiUrl).then(showCurrentCityTemperature);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showPosition);
}

let currentButton = document.querySelector("#current-button");
currentButton.addEventListener("click", getCurrentLocation);

// Temperature Unit Conversion
//----------------------------------------------
function handleFormSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value;
  getWeatherByCity(city);
}

function handleFahrenheitLink(event) {
  event.preventDefault();
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let temperatureElement = document.querySelector("#temperature-value");
  temperatureElement.innerHTML = Math.round(fahrenheitLinkTemperature);
}

function handleCelsiusLinkClick(event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  let temperatureElement = document.querySelector("#temperature-value");
  let celsiusTemperature = ((fahrenheitLinkTemperature - 32) * 5) / 9;
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}

// Event Listeners
//----------------------------------------------
let fahrenheitLinkTemperature = null;

let searchForm = document.querySelector("#enter-location");
searchForm.addEventListener("submit", handleFormSubmit);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", handleFahrenheitLink);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", handleCelsiusLinkClick);

// Initialize with Default City
//----------------------------------------------
getWeatherByCity("Phoenix");
