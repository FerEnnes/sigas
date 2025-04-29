const API_KEY = '0c2d6404683c45e85a4c3cb5fdf579be'; //chave do OpenWeatherMap

// Busca previsão pelo nome da cidade
export async function getWeatherByCity(city) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=pt_br&appid=${API_KEY}`
  );
  if (!response.ok) {
    throw new Error('Erro ao buscar clima da cidade.');
  }
  return response.json();
}

// Busca previsão pela latitude e longitude (automática)
export async function getWeatherByCoords(lat, lon) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=pt_br&appid=${API_KEY}`
  );
  if (!response.ok) {
    throw new Error('Erro ao buscar clima da localização.');
  }
  return response.json();
}
