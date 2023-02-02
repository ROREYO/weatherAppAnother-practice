const link = "http://api.weatherstack.com/current?access_key=1b860771509fb89912cec829d2650024";

const root = document.querySelector("#root");
const popup = document.querySelector("#popup");
const textInput = document.querySelector("#text-input");
const form = document.querySelector("#form");

let store = {
  city: "London",
  temperature: 0,
  observationTime: "00:00 AM",
  isDay: "yes",
  descriptions: "",
  properties: {
    cloudcover: {},
    humidity: {},
    windSpeed: {},
    visibility: {},
    pressure: {},
    uvIndex: {},
  },
};

const fetchData = async () => {
  try {
    const query = localStorage.getItem("query") || store.city;
    const result = await fetch(`${link}&query=${query}`);
    const data = await result.json();

    const {
      current: {
        cloudcover,
        temperature,
        humidity,
        observation_time: observationTime,
        pressure,
        uv_index: uvIndex,
        visibility,
        is_day: isDay,
        weather_descriptions: descriptions,
        wind_speed: windSpeed,
      },
      location: { name },
    } = data;

    store = {
      ...store,
      city: name,
      temperature,
      observationTime,
      isDay,
      descriptions: descriptions[0],
      properties: {
        cloudcover: {
          name: "Cloud cover",
          value: `${cloudcover}%`,
          icon: "cloud.png",
        },
        humidity: {
          name: "Humidity",
          value: `${humidity}%`,
          icon: "humidity.png",
        },
        windSpeed: {
          name: "Wind speed",
          value: `${windSpeed} km/h`,
          icon: "wind.png",
        },
        pressure: {
          name: "Pressure",
          value: `${pressure}%`,
          icon: "gauge.png",
        },
        uvIndex: {
          name: "UV Index",
          value: `${uvIndex} / 100`,
          icon: "uv-index.png",
        },
        visibility: {
          name: "Visibility",
          value: `${visibility}%`,
          icon: "visibility.png",
        },
      },
    };

    renderComponent();
  } catch (err) {
    console.log(err);
  }
};

const getImage = (descriptions) => {
  const value = descriptions.toLowerCase();

  switch (value) {
    case "partly cloudy":
      return "partly.png";
    case "cloud":
      return "cloud.png";
    case "fog":
      return "fog.png";
    case "sunny":
      return "sunny.png";
    default:
      return "the.png";
  }
};

const renderProperty = (properties) => {
  return Object.values(properties)
    .map(({ name, value, icon }) => {
      return `<div class="property">
              <div class="property-icon">
                <img src="./img/icons/${icon}" alt="">
              </div>
              <div class="property-info">
                <div class="property-info__value">${value}</div>
                <div class="property-info__description">${name}</div>
              </div>
            </div>`;
    })
    .join("");
};

const markup = () => {
  const { city, descriptions, observationTime, temperature, isDay, properties } = store;

  const containerClass = isDay === "yes" ? "is-day" : "";

  return `<div class="container ${containerClass}">
            <div class="top">
              <div class="city">
                <div class="city-subtitle">Weather Today in</div>
                  <div class="city-title" id="city">
                    <span>${city}</span>
                  </div>
                </div>

                <div class="city-info">
                  <div class="top-left">
                    <img class="icon" src="./img/${getImage(descriptions)}" alt="" />
                    <div class="description">${descriptions}</div>
                </div>

                <div class="top-right">
                  <div class="city-info__subtitle">as of ${observationTime}</div>
                  <div class="city-info__title">${temperature}°</div>
                </div>
              </div>
            </div>
            <div id="properties">${renderProperty(properties)}</div>
          </div>`;
};

const togglePopupClass = () => {
  popup.classList.toggle("active");
};

const renderComponent = () => {
  root.innerHTML = markup();

  const city = document.querySelector("#city");
  city.addEventListener("click", togglePopupClass);
};

const handleInput = (e) => {
  store = {
    ...store,
    city: e.target.value,
  };
};

const handleSubmit = (e) => {
  e.preventDefault();
  const value = store.city;

  if (!value) return null;

  localStorage.setItem("query", value);
  fetchData();
  togglePopupClass();
};

form.addEventListener("submit", handleSubmit);
textInput.addEventListener("input", handleInput);

fetchData();
