# 🌦️ Weather API App

A simple and responsive Weather Application built using HTML, CSS, and JavaScript.
It fetches real-time weather data from a public API and displays it dynamically with proper error handling.

## ⚙️ Setup Instructions

1️⃣ Clone the repository

```bash
git clone https://github.com/KVS2025/Weather-API-App

```

2️⃣ Navigate to the project folder

```bash
cd Weather-API-App
```

3️⃣ Add your API key
Open script.js and replace:

```js
const API_KEY = "YOUR_API_KEY";
```

with your actual API key from [OpenWeatherMap](https://openweathermap.org/api).

4️⃣ Launch the app

Simply open index.html in any modern web browser.
No local server or setup required.

## 📌 How It Works

* User Input
The user enters a city name into the search field.

* API Request
A GET request is sent to the Weather API using the fetch() method.

* Data Processing
The API returns a JSON response, which is parsed to extract required weather details.

* UI Update
JavaScript dynamically updates the DOM with the fetched data.

* Error Catching
If an error occurs (invalid city, API issue, or network failure), a clear error message is displayed.

## ❗Error Handling


-- Reliability is intentionally built in. The app handles:

+ Empty input fields

+ Invalid city names (typos or non-existent locations)

### API errors:

+ 401 – Unauthorized

+ 404 – City not found

+ Network connectivity issues

## 📸 Screenshots: 
<img width="1897" height="828" alt="Screenshot 2026-01-13 100626" src="https://github.com/user-attachments/assets/c1c85534-1389-4af8-83d8-5a1bd19637e1" />

<img width="1897" height="826" alt="Screenshot 2026-01-13 100702" src="https://github.com/user-attachments/assets/f85a577d-08b2-4bd2-9152-a2b75e241ba5" />

<img width="1898" height="827" alt="image" src="https://github.com/user-attachments/assets/dff0b9cd-a7df-4af1-850a-e92c6ab7e7f0" />


## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## 🧠 Learning Outcomes

1. This project demonstrates practical understanding of:

2. Asynchronous JavaScript (fetch, Promises)

3. Working with JSON data structures

4. Efficient DOM manipulation

5. Robust error-handling strategies

6. Clean and organized project structure

## 📄 License

This project is open-source and created for learning purposes.
Feel free to use, modify, and improve it.
