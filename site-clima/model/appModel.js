const diasDaSemana = [
  "Domingo",
  "Segunda-Feira",
  "Terça-Feira",
  "Quarta-Feira",
  "Quinta-Feira",
  "Sexta-Feira",
  "Sábado",
];

const getPosition = async function() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

const condicaoTempo = function(codigoClima, diaOuNoite) {
  let tempo;

  switch (codigoClima) {
    case 0:
    case 1:
      tempo = "Ensolarado";
      break;

    case 2:
    case 3:
      tempo = "Nublado";
      break;

    case 51:
    case 53:
    case 55:
    case 61:
    case 63:
    case 65:
    case 80:
      tempo = "Chuva";
      break;

    default:
      throw new Error("Condição desconhecida");
  }

  if (tempo === "Chuva" || tempo === "Nublado") return tempo;

  if (diaOuNoite === "Noite" && tempo === "Ensolarado") return diaOuNoite;

  if (diaOuNoite === "Dia" && tempo === "Ensolarado") return "Ensolarado";

  return tempo;
};

export const formatandoDadosClima = function(dadosClima, nomeCidade) {
  const dados = {
    temperatura:
      dadosClima.current_weather.temperature +
      dadosClima.current_weather_units.temperature,
    tempMaxima:
      dadosClima.daily.temperature_2m_max[0] +
      dadosClima.daily_units.temperature_2m_max,
    tempMinima:
      dadosClima.daily.temperature_2m_min[0] +
      dadosClima.daily_units.temperature_2m_min,
    vento:
      dadosClima.current_weather.windspeed +
      dadosClima.current_weather_units.windspeed,
    probabilidadeDeChuva:
      dadosClima.hourly.precipitation_probability[0] +
      dadosClima.hourly_units.precipitation_probability,
    condicaoTempo: condicaoTempo(
      dadosClima.current_weather.weathercode,
      dadosClima.current_weather.is_day ? "Dia" : "Noite"
    ),
    diaDaSemana: diasDaSemana[new Date().getDay()],
    umidade:
      dadosClima.hourly.relativehumidity_2m[0] +
      dadosClima.hourly_units.relativehumidity_2m,
    cidade: nomeCidade,
  };

  return dados;
};

export const localizacaoGpsNavegador = async function() {
  try {
    const position = await getPosition();
    const { latitude: lat, longitude: lon } = position.coords;
    const coords = { lat, lon };
    return coords;
  } catch(err) {
    throw new Error('Ligue o gps da página');
  }
};

export const coordsCidade = async function(cidade) {
  try {
    const coordsCidade = await fetch(
      `https://api.geoapify.com/v1/geocode/search?text=${cidade}&apiKey=b3802fe2c77841159c7cf24a61b31dc1`
    );

    if (!coordsCidade.ok) throw new Error("Cidade digata inválida");

    const coordsDadosCidade = await coordsCidade.json();

    const { lat, lon } = coordsDadosCidade?.features[0]?.properties;

    return { lat, lon };
  } catch (err) {
    throw new Error('Nome de cidade inválida');
  }
};

export const coordsNomeCidadeFormatado = async function(lat, lon) {
  try {
    const localizacao = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=pt`
    );

    if (!localizacao.ok)
      throw new Error("Coordenadas inválidas para achar a cidade");

    const localizacaoDados = await localizacao.json();

    const local =
      localizacaoDados.city +
      " - " +
      localizacaoDados.principalSubdivision +
      " - " +
      localizacaoDados.countryName;

    return local;
  } catch (err) {
    throw new Error('Coordenadas de cidade inválida');
  }
};

export const climaAtual = async function(lat, lon) {
  try {
    const clima = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,daylight_duration,sunshine_duration,uv_index_max,winddirection_10m_dominant&hourly=temperature_2m,rain,soil_moisture_0_to_1cm,relativehumidity_2m,precipitation_probability,wind_speed_10m,wind_direction_10m&current_weather=true`
    );

    if (!clima.ok) throw new Error("Erro em achar clima");

    const dadosClima = await clima.json();

    return dadosClima;
  } catch (err) {
    throw new Error('Coordenadas do clima é inválida');
  }
};