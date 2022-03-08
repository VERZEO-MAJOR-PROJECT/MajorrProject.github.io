const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date')
const day = document.querySelectorAll('.day');
const temp = document.querySelectorAll('.temp')
const curLoc = document.getElementById('curLoc');
const inputLoc = document.getElementById('inputLoc');
const btnSearch = document.getElementById('searchLoc');
const curWeatherEls = document.getElementById('cur-weather-condition');

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

    timeEl.innerHTML = hoursIn12HrFormat +":"+ adv_mins +" "+ `<span id="am-pm">${ampm}</span>`;
    dateEl.innerHTML = days[day] + ',' + date + ' ' + months[month]+' '+year;
},1000);

getWeatherData();

function getWeatherData(){
    navigator.geolocation.getCurrentPosition((success) =>{

        let {latitude,longitude} = success.coords;
        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&appid=${API_KEY}`).then(res => res.json()).then(data => {
            console.log(data);
            showWeatherdata(data);
        })

    })
}

function showWeatherdata(data){
    let {humidity,pressure,wind_speed,clouds} = data.current;

    curWeatherEls.innerHTML = 
    `<div class="cur-weather-item">
        <div>Humidity</div>
        <div>${humidity}%</div>
    </div>
    <div class="cur-weather-item">
        <div>Pressure</div>
        <div>${pressure}</div>
    </div>
    <div class="cur-weather-item">
        <div>Wind Speed</div>
        <div>${wind_speed}</div>
     </div>
     `;

     temp.innerHTML = data.current.temp;
     curLoc.innerHTML = data.timezone;
}