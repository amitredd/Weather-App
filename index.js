//Initial Variables Needed
const userTab = document.getElementById("user-weather");
const searchTab = document.getElementById("search-weather");


const grantAccessContainer = document.getElementById("grant-location-container");
const formContainer = document.getElementById("form-container");
const loadingContainer = document.getElementById("loading-container");
const userInfoContainer = document.getElementById("user-info-container");

//Default layout settings
let oldTab = userTab;
oldTab.classList.add("current-tab");
grantAccessContainer.classList.add("active");
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";



//check if cordinates are already present in session storage
function getFromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("userCoordinates");
    if (!localCoordinates) {
        //if coordinates not found
        grantAccessContainer.classList.add("active");
    }
    else {
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

//Funciton for changing layout according to current tab which is clicked,by default everyone are none , so using the -
// -css property(active) which has display as flex inorder to display content
function switchTab(newTab) {
    if (newTab !== oldTab) {
        oldTab.classList.remove("current-tab")
        oldTab = newTab;
        oldTab.classList.add("current-tab")


        if (!formContainer.classList.contains("active")) {

            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            formContainer.classList.add("active");

        }
        else {

            formContainer.classList.remove("active");
            userInfoContainer.classList.remove("active");
            // grantAccessContainer.classList.add("active");
            //Now in weather tab ,Need to dispplay weather, so let's check local storage first
            //for coordinates, if we haved saved them there.
            getFromSessionStorage();
        }

    }

}

//Event Listeners
userTab.addEventListener("click", () => {
    switchTab(userTab);
});

searchTab.addEventListener("click", () => {
    switchTab(searchTab)
});

//Displaying weather data with help of Open weather Api
function renderWeatherInfo(weatherInfo) {

    const cityName = document.getElementById("data-cityName");
    const countryIcon = document.getElementById("data-flag");
    const desc = document.getElementById("data-weather-desc");
    const weatherIcon = document.getElementById("data-weather-img");
    const temp = document.getElementById("data-weather-temp");
    const windspeed = document.getElementById("data-windspeed");
    const humidity = document.getElementById("data-humidity");
    const cloudiness = document.getElementById("data-clouds");


    console.log(weatherInfo)

    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;     //  degree celcious copied from net
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;

}
//Fetching user data with help of coordinates and using the fetch 
async function fetchUserWeatherInfo(coordinates) {
    const { lat, lon } = coordinates;

    grantAccessContainer.classList.remove("active");
    loadingContainer.classList.add("active");
    try {

        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json();

        loadingContainer.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch (err) {
        loadingContainer.classList.remove("active");
    }
}
//Getting the coordinates and saving it to sessionStorage
function showPosition(position) {
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("userCoordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

//using the inbuilt WebApi to get currect location coordinates
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        alert("Geolocation not supported");
    }
}
//What happens when you click on grant access button ?-> starts here ->bottom to top function calling
const grantAccessButton = document.getElementById("data-grantAccess");
grantAccessButton.addEventListener("click", getLocation);

/*-------------------------------------*/

//Funciton for displaying the deatils of corresponing entered city name
async function fetchSearchWeatherInfo(city) {

    loadingContainer.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        loadingContainer.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch (err) {

    }
}

//Getting details of user entered data with help of city name and using the fetch 
const searchInput = document.getElementById("data-searchInput");

formContainer.addEventListener("submit", (e) => {
    e.preventDefault();
    let city = searchInput.value;

    if (city === "")
        return;
    else
        fetchSearchWeatherInfo(city);

})

