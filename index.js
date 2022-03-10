const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const curLoc = document.getElementById('time-zone');
const inputLoc = document.getElementById('inputLoc');
const searchLoc = document.getElementById('searchLoc');
const curWeatherEls = document.getElementById('current-weather-condition');
const dayEl = document.getElementsByClassName('day');
const currentEl = document.getElementById('curForecast');
const futureForecastEls = document.getElementById('futureForecast');
const futureItems = document.querySelectorAll('.btn');
const btn2 = document.getElementById('btn2');

const API_KEY = 'fd8715bbd26c5f06ec357529266147e3';

const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
const months = ['January','Febraury','March','April','May','June','July','August','September','October','November','December']

setInterval(() => {
    const time = new Date();
    const year = time.getFullYear();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12HrFormat = hour >= 13 ? hour %12: hour;
    const minutes = time.getMinutes();
    const adv_mins = minutes < 10 ? '0'+minutes : minutes;
    const ampm = hour >= 12 ? 'PM' : 'AM'

    timeEl.innerHTML = hoursIn12HrFormat + ':' + adv_mins + " " + `<span id="am-pm">${ampm}</span>`;
    dateEl.innerHTML = days[day] + ',' + date + ' ' + months[month]+' '+year;

},1000);

getWeatherData();

function getWeatherData(){
    navigator.geolocation.getCurrentPosition((success) => {
        
        let {latitude,longitude} = success.coords;
        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&appid=${API_KEY}`).then(res => res.json()).then(data => {
            console.log(data);
            showWeatherdata(data);
        })
    })
}

function showWeatherdata(data){
    let{humidity,pressure,wind_speed,clouds} = data.current;

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

    let otherDayForecast = ''
    data.daily.forEach((day,idx) => {
    if(idx == 0){
        currentEl.innerHTML = 
        `<img src="http://openweathermap.org/img/wn//${day.weather[0].icon}@4x.png" width='150px'>
        <div class="other">
            <div class="day">${window.moment(day.dt*1000).format('dddd')}</div>
            <div class="temp">Day - ${day.temp.day}&#176;C</div>
            <div class="temp">Night - ${day.temp.night}&#176;C</div>

        </div>`
    }else{
        otherDayForecast += 
        `<div class="futureForecast-item">
            <div class="day">${window.moment(day.dt*1000).format('dddd')}</div>
            <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
            <div class="temp">Day - ${day.temp.day}&#176;C</div>
            <div class="temp">Night - ${day.temp.night}&#176;C</div>
        </div>
        `
        }
    });
    futureForecastEls.innerHTML = otherDayForecast;
}


searchLoc.addEventListener('click',(e)=>{
    e.preventDefault();
    getWeather(inputLoc.value);
    inputLoc.value = '';
});

const getWeather = async(city) =>{
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);
        const weatherData = await response.json();
        console.log(weatherData);
        const{name} = weatherData;
        curLoc.innerHTML = name;
        const{humidity,pressure} = weatherData.main;
        const{speed} = weatherData.wind;
        const{all} = weatherData.clouds;
        cityGeo(weatherData);
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
    catch(error){
        alert('city not found');
    }
    
}

function cityGeo(weatherData){
    console.log(weatherData);
    let{lat,lon} = weatherData.coord;
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&appid=${API_KEY}`)
    .then(res => res.json()).then(city => {
        console.log(city);
    })
}
