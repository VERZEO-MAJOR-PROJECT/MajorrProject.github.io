const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const curLoc = document.getElementById('time-zone');
const inputLoc = document.getElementById('inputLoc');
const searchLoc = document.getElementById('searchLoc');
const curWeatherEls = document.getElementById('current-weather-condition');
const dayEl = document.getElementsByClassName('day');
const currentEl = document.getElementById('curForecast');
const futureForecastEls = document.getElementById('futureForecast');
const b = document.querySelector('.futureForecast');
let tz = '';

const API_KEY = 'fd8715bbd26c5f06ec357529266147e3';

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const months = ['January', 'Febraury', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

setInterval(() => {
    const time = new Date();
    const year = time.getFullYear();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12HrFormat = hour >= 13 ? hour % 12 : hour;
    const minutes = time.getMinutes();
    const adv_mins = minutes < 10 ? '0' + minutes : minutes;
    const ampm = hour >= 12 ? 'PM' : 'AM'

    timeEl.innerHTML = hoursIn12HrFormat + ':' + adv_mins + " " + `<span id="am-pm">${ampm}</span>`;
    dateEl.innerHTML = days[day] + ',' + date + ' ' + months[month] + ' ' + year;

}, 1000);

getWeatherData();

function getWeatherData() {
    navigator.geolocation.getCurrentPosition((success) => {

        let { latitude, longitude } = success.coords;
        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&appid=${API_KEY}`).then(res => res.json()).then(data => {
            console.log(data);
            showWeatherdata(data);
            extra(data);
        })
    })
}

function showWeatherdata(data) {
    let { humidity, pressure, wind_speed, clouds } = data.current;

    curWeatherEls.innerHTML =
        `<div class="weather-item">
        <div>Humidity</div>
        <div>${humidity}%</div>
    </div>
    <div class="weather-item">
        <div>Pressure</div>
        <div>${pressure}</div>
    </div>
    <div class="weather-item">
        <div>Wind Speed</div>
        <div>${wind_speed} m/s</div>
    </div>
    <div class="weather-item">
        <div>Cloudy</div>
        <div>${clouds}</div>
    </div>`;

    curLoc.innerHTML = data.timezone;
    tz = data.timezone;

    let otherDayForecast = ''
    data.daily.forEach((day, idx) => {
        if (idx == 0) {
            currentEl.innerHTML =
                `<img src="http://openweathermap.org/img/wn//${day.weather[0].icon}@4x.png" width='150px'>
        <div class="other">
            <div class="day">${window.moment(day.dt * 1000).format('dddd')}</div>
            <div class="temp">Day - ${Math.round(day.temp.day - 273.15)}&#176;C</div>
            <div class="temp">Night - ${Math.round(day.temp.night - 273.15)}&#176;C</div>

        </div>`
        } else {
            otherDayForecast +=
                `<div class="futureForecast-item">
            <div class="day">${window.moment(day.dt * 1000).format('dddd')}</div>
            <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
            <div class="temp">Day - ${Math.round(day.temp.day - 273.15)}&#176;C</div>
            <div class="temp">Night - ${Math.round(day.temp.night - 273.15)}&#176;C</div>
        </div>
        `
        }
    });
    futureForecastEls.innerHTML = otherDayForecast;
}


searchLoc.addEventListener('click', (e) => {
    e.preventDefault();
    getWeather(inputLoc.value);
    inputLoc.value = '';
});

const getWeather = async (city) => {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);
        const weatherData = await response.json();
        const { name } = weatherData;
        curLoc.innerHTML = name;
        const { humidity, pressure } = weatherData.main;
        const { speed } = weatherData.wind;
        const { all } = weatherData.clouds;
        cityGeo(weatherData);
        bgImg(weatherData);
        curWeatherEls.innerHTML =
            `
        <div class="weather-item">
            <div>Humidity</div>
            <div>${humidity}%</div>
        </div>
        <div class="weather-item">
            <div>Pressure</div>
            <div>${pressure}</div>
        </div>
        <div class="weather-item">
            <div>Wind Speed</div>
            <div>${speed} m/s</div>
        </div>
        <div class="weather-item">
            <div>Cloudy</div>
            <div>${all}</div>
        </div>
        `;

    }
    catch (error) {
        alert('city not found');
        curLoc.innerHTML = tz;
    }

}

function cityGeo(weatherData) {
    console.log(weatherData);
    let { lat, lon } = weatherData.coord;
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&appid=${API_KEY}`)
        .then(res => res.json()).then(city => {
            console.log(city);
            extra(city);
        })
}

function bgImg(data) {
    let { id } = data.weather[0];
    if ((id >= 200) && (id < 300)) {
        document.body.style.backgroundImage = "url('https://eskipaper.com/images/thunderstorm-wallpaper-6.jpg')";
    }
    else if ((id >= 300) && (id < 500)) {
        document.body.style.backgroundImage = "url('https://images.unsplash.com/photo-1600415684478-744cf4f8f8d7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80')";
    }
    else if ((id >= 500) && (id < 600)) {
        document.body.style.backgroundImage = "url('https://images.unsplash.com/photo-1565065524861-0be4646f450b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80')";
    }
    else if ((id >= 600) && (id < 700)) {
        document.body.style.backgroundImage = "url('https://images.unsplash.com/photo-1483664852095-d6cc6870702d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80')";
    }
    else if ((id > 700) && (id < 800)) {
        document.body.style.backgroundImage = "url('https://www.wallpaperup.com/uploads/wallpapers/2019/01/11/1307775/9168c2235a6b264b223d5a6ef757ba4d-700.jpg')";
    }
    else if (id == 800) {
        document.body.style.backgroundImage = "url('https://images.unsplash.com/photo-1419833173245-f59e1b93f9ee?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80')";
    }
    else if ((id > 800) && (id < 810)) {
        document.body.style.backgroundImage = "url('https://ak.picdn.net/shutterstock/videos/2681522/thumb/1.jpg')";
    }
    else {
        document.body.style.backgroundImage = "url('https://images.unsplash.com/photo-1536244636800-a3f74db0f3cf?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=792&q=80')";
    }
}

const firstData = document.querySelector(".forecast")
const p = b.children
function extra(data) {
    let otherData = ''
    data.daily.forEach((day, idx) => {
        if (idx == 0) {
            currentEl.innerHTML =
                `<img src="http://openweathermap.org/img/wn//${day.weather[0].icon}@4x.png" width='150px'>
        <div class="other">
            <div class="day">${window.moment(day.dt * 1000).format('dddd')}</div>
            <div class="temp">Day - ${Math.round(day.temp.day - 273.15)}&#176;C</div>
            <div class="temp">Night - ${Math.round(day.temp.night - 273.15)}&#176;C</div>

        </div>`
        } else {
            otherData +=
                `<div class="futureForecast-item">
            <div class="day">${window.moment(day.dt * 1000).format('dddd')}</div>
            <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
            <div class="temp">Day - ${Math.round(day.temp.day - 273.15)}&#176;C</div>
            <div class="temp">Night - ${Math.round(day.temp.night - 273.15)}&#176;C</div>
            </div>`
        
        }
    });
    futureForecastEls.innerHTML = otherData;
    const present = firstData.children[0];
    present.addEventListener('click', () => {
        let { humidity, pressure, wind_speed, clouds } = data.current;
        curWeatherEls.innerHTML =
            `<div class="weather-item">
                        <div>Humidity</div>
                        <div>${humidity}%</div>
                    </div>
                    <div class="weather-item">
                        <div>Pressure</div>
                        <div>${pressure}</div>
                    </div>
                    <div class="weather-item">
                        <div>Wind Speed</div>
                        <div>${wind_speed} m/s</div>
                    </div>
                    <div class="weather-item">
                        <div>Cloudy</div>
                        <div>${clouds}</div>
                        </div>`;
    })
    p[0].addEventListener('click', () => {
        let { humidity, pressure, wind_speed, clouds } = data.daily[1];
        curWeatherEls.innerHTML =
            `<div class="weather-item">
                        <div>Humidity</div>
                        <div>${humidity}%</div>
                    </div>
                    <div class="weather-item">
                        <div>Pressure</div>
                        <div>${pressure}</div>
                    </div>
                    <div class="weather-item">
                        <div>Wind Speed</div>
                        <div>${wind_speed} m/s</div>
                    </div>
                    <div class="weather-item">
                        <div>Cloudy</div>
                        <div>${clouds}</div>
                        </div>`;
    })
    p[1].addEventListener('click', () => {

        let { humidity, pressure, wind_speed, clouds } = data.daily[2];
        curWeatherEls.innerHTML =
            `<div class="weather-item">
                        <div>Humidity</div>
                        <div>${humidity}%</div>
                    </div>
                    <div class="weather-item">
                        <div>Pressure</div>
                        <div>${pressure}</div>
                    </div>
                    <div class="weather-item">
                        <div>Wind Speed</div>
                        <div>${wind_speed} m/s</div>
                    </div>
                    <div class="weather-item">
                        <div>Cloudy</div>
                        <div>${clouds}</div>
                        </div>`;
    })
    p[2].addEventListener('click', () => {
        let { humidity, pressure, wind_speed, clouds } = data.daily[3];
        curWeatherEls.innerHTML =
            `<div class="weather-item">
                        <div>Humidity</div>
                        <div>${humidity}%</div>
                    </div>
                    <div class="weather-item">
                        <div>Pressure</div>
                        <div>${pressure}</div>
                    </div>
                    <div class="weather-item">
                        <div>Wind Speed</div>
                        <div>${wind_speed} m/s</div>
                    </div>
                    <div class="weather-item">
                        <div>Cloudy</div>
                        <div>${clouds}</div>
                        </div>`;
    })
    p[3].addEventListener('click', () => {
        let { humidity, pressure, wind_speed, clouds } = data.daily[4];
        curWeatherEls.innerHTML =
            `<div class="weather-item">
                        <div>Humidity</div>
                        <div>${humidity}%</div>
                    </div>
                    <div class="weather-item">
                        <div>Pressure</div>
                        <div>${pressure}</div>
                    </div>
                    <div class="weather-item">
                        <div>Wind Speed</div>
                        <div>${wind_speed} m/s</div>
                    </div>
                    <div class="weather-item">
                        <div>Cloudy</div>
                        <div>${clouds}</div>
                        </div>`;
    })
    p[4].addEventListener('click', () => {
        let { humidity, pressure, wind_speed, clouds } = data.daily[5];
        curWeatherEls.innerHTML =
            `<div class="weather-item">
                        <div>Humidity</div>
                        <div>${humidity}%</div>
                    </div>
                    <div class="weather-item">
                        <div>Pressure</div>
                        <div>${pressure}</div>
                    </div>
                    <div class="weather-item">
                        <div>Wind Speed</div>
                        <div>${wind_speed} m/s</div>
                    </div>
                    <div class="weather-item">
                        <div>Cloudy</div>
                        <div>${clouds}</div>
                        </div>`;
    })
    p[5].addEventListener('click', () => {
        let { humidity, pressure, wind_speed, clouds } = data.daily[6];
        curWeatherEls.innerHTML =
            `<div class="weather-item">
                        <div>Humidity</div>
                        <div>${humidity}%</div>
                    </div>
                    <div class="weather-item">
                        <div>Pressure</div>
                        <div>${pressure}</div>
                    </div>
                    <div class="weather-item">
                        <div>Wind Speed</div>
                        <div>${wind_speed} m/s</div>
                    </div>
                    <div class="weather-item">
                        <div>Cloudy</div>
                        <div>${clouds}</div>
                        </div>`;
    })
    p[6].addEventListener('click', () => {
        let { humidity, pressure, wind_speed, clouds } = data.daily[7];
        curWeatherEls.innerHTML =
            `<div class="weather-item">
                        <div>Humidity</div>
                        <div>${humidity}%</div>
                    </div>
                    <div class="weather-item">
                        <div>Pressure</div>
                        <div>${pressure}</div>
                    </div>
                    <div class="weather-item">
                        <div>Wind Speed</div>
                        <div>${wind_speed} m/s</div>
                    </div>
                    <div class="weather-item">
                        <div>Cloudy</div>
                        <div>${clouds}</div>
                        </div>`;
    })

}
