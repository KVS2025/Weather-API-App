const cityInput = document.querySelector('.city-input')
const searchBtn = document.querySelector('.search-btn')

const weatherInfoSection = document.querySelector('.weather-info')
const notFoundSection = document.querySelector('.not-found')
const searchCitySection = document.querySelector('.search-city')

const countryTxt = document.querySelector('.country-txt')
const tempTxt = document.querySelector('.temp-txt')
const conditionTxt = document.querySelector('.condition-txt')
const humidityValueTxt = document.querySelector('.humidity-value-txt')
const windValueTxt = document.querySelector('.wind-value-txt')
const weatherSummaryImg = document.querySelector('.weather-summary-img')
const currentDateTxt = document.querySelector('.current-date-txt')

const forecastItemsContainer = document.querySelector('.forecast-items-container')

// Theme Toggle Elements
const themeToggleBtn = document.querySelector('.theme-toggle-btn')
const body = document.body

const apiKey = 'e566dad70832b790ae44ee6e3bd641f0'

// Store current timezone for the searched city
let currentCityTimezone = 0

// Manual theme override (null = auto mode)
let manualThemeOverride = null

// Check if user has manual theme preference
const savedManualTheme = localStorage.getItem('manualTheme')
if (savedManualTheme) {
    manualThemeOverride = savedManualTheme
    applyTheme(savedManualTheme)
}

// Theme Toggle Functionality
themeToggleBtn.addEventListener('click', () => {
    const isDayMode = body.classList.contains('day-mode')
    const newTheme = isDayMode ? 'night' : 'day'
    
    // Save manual override
    manualThemeOverride = newTheme
    localStorage.setItem('manualTheme', newTheme)
    
    applyTheme(newTheme)
})

// Apply theme function
function applyTheme(theme) {
    body.classList.remove('day-mode', 'night-mode')
    body.classList.add(theme === 'day' ? 'day-mode' : 'night-mode')
}

// Auto-detect day/night based on city's local time
function autoDetectDayNight(timezoneOffset) {
    if (manualThemeOverride) {
        applyTheme(manualThemeOverride)
        return
    }
    
    // Get UTC time
    const now = new Date()
    const utcHours = now.getUTCHours()
    
    // Calculate local time in the city
    const cityHours = (utcHours + (timezoneOffset / 3600)) % 24
    
    // Determine if it's day or night (day: 6am-6pm)
    const isDay = cityHours >= 6 && cityHours < 18
    
    applyTheme(isDay ? 'day' : 'night')
}

// Get city's current time
function getCityTime(timezoneOffset) {
    const now = new Date()
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000)
    const cityTime = new Date(utcTime + (timezoneOffset * 1000))
    
    const options = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    }
    
    return cityTime.toLocaleTimeString('en-US', options)
}

// Search Button Click
searchBtn.addEventListener('click', () => {
    if (cityInput.value.trim() != '') {
        updateWeatherInfo(cityInput.value)
        cityInput.value = ''
        cityInput.blur()
    }
})

// Enter Key Press
cityInput.addEventListener('keydown', (event) => {
    if (event.key == 'Enter' && cityInput.value.trim() != '') {
        updateWeatherInfo(cityInput.value)
        cityInput.value = ''
        cityInput.blur()
    }
})

// Fetch Data from API
async function getFetchData(endPoint, city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`

    const response = await fetch(apiUrl)

    return response.json()
}

// Get Weather Icon based on condition ID
function getWeatherIcon(id) {
    if(id <= 232) return 'thunderstorm.svg'
    if(id <= 321) return 'drizzle.svg'
    if(id <= 531) return 'rain.svg'
    if(id <= 622) return 'snow.svg'
    if(id <= 781) return 'atmosphere.svg'
    if(id == 800) return 'clear.svg'
    else return 'clouds.svg'
}

// Get Current Date (Enhanced Display)
function getCurrentDate() {
    const currentDate = new Date()
    const options = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }
    return currentDate.toLocaleDateString('en-GB', options)
}

// Update Main Weather Info
async function updateWeatherInfo(city) {
    const weatherData = await getFetchData('weather', city)

    if(weatherData.cod != 200) {
        showDisplaySection(notFoundSection)
        return
    }
    
    console.log(weatherData)

    const {
        name: country,
        main: {temp, humidity},
        weather: [{ id, main}],
        wind: {speed},
        timezone
    } = weatherData

    // Store timezone for updates
    currentCityTimezone = timezone

    // Update weather info
    countryTxt.textContent = country
    tempTxt.textContent = Math.round(temp) + ' °C'
    conditionTxt.textContent = main
    humidityValueTxt.textContent = humidity + '%'
    windValueTxt.textContent = speed + ' M/s'

    // Update date and time
    currentDateTxt.textContent = getCurrentDate()
    
    // Add city time if element doesn't exist, create it
    let cityTimeElement = document.querySelector('.city-time-txt')
    if (!cityTimeElement) {
        cityTimeElement = document.createElement('span')
        cityTimeElement.className = 'city-time-txt'
        document.querySelector('.location').appendChild(cityTimeElement)
    }
    cityTimeElement.textContent = getCityTime(timezone)

    // Set weather icon
    weatherSummaryImg.src = `assets/weather/${getWeatherIcon(id)}`

    // Auto-detect day/night based on city time
    autoDetectDayNight(timezone)

    await updateForecastInfo(city)
    showDisplaySection(weatherInfoSection)
}

// Update Forecast Info
async function updateForecastInfo(city) {
    const forecastData = await getFetchData('forecast', city)

    const timeTaken = '12:00:00'
    const todayDate = new Date().toISOString().split('T')[0]

    forecastItemsContainer.innerHTML = ''
    
    forecastData.list.forEach(forecastWeather => {
        if (
            forecastWeather.dt_txt.includes(timeTaken) &&
            !forecastWeather.dt_txt.includes(todayDate)
        ) {
            updateForecastItems(forecastWeather)
        }
    })
}

// Create Forecast Items
function updateForecastItems(weatherData) {
    console.log(weatherData)
    const {
        dt_txt: date,
        main: {temp},
        weather: [{id}],
    } = weatherData

    const dateTaken = new Date(date)
    const dateOption = {
        day: '2-digit',
        month: 'short'
    }
    const dateResult = dateTaken.toLocaleDateString('en-US', dateOption)

    const forecastItem = `
        <div class="forecast-item">
            <h5 class="forecast-item-date regular-txt">${dateResult}</h5>
            <img src="assets/weather/${getWeatherIcon(id)}" alt="" class="forecast-item-img">
            <h5 class="forecast-item-temp">${Math.round(temp)} °C</h5>
        </div>
    `
    forecastItemsContainer.insertAdjacentHTML('beforeend', forecastItem)    
}

// Show Display Section
function showDisplaySection(section) {
    [weatherInfoSection, searchCitySection, notFoundSection]
        .forEach(section => section.style.display = 'none')

    section.style.display = 'flex'
}

// Update city time every minute
setInterval(() => {
    if (currentCityTimezone !== 0) {
        const cityTimeElement = document.querySelector('.city-time-txt')
        if (cityTimeElement) {
            cityTimeElement.textContent = getCityTime(currentCityTimezone)
        }
        // Re-check day/night
        autoDetectDayNight(currentCityTimezone)
    }
}, 60000) // Update every minute