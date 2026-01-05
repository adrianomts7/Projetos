"use strict";

const inputPesquisa = document.querySelector(".input__buscar-cidade");
const nomeCidade = document.querySelector(".nome__cidade");
const imgCondicaoTempo = document.querySelector(".img__condicao-tempo");
const temperatura = document.querySelector(".temperatura");
const condicaoTempo = document.querySelector(".condicao__tempo");
const tempMaxima = document.querySelector(".temp__max");
const tempMinima = document.querySelector(".temp__min");
const vento = document.querySelector(".vento");
const probabilidadeChuva = document.querySelector(".probabilidade__chuva");
const umidade = document.querySelector(".umidade");
const areaDadosClima = document.querySelector(".dados__clima");
const areaPesquisa = document.querySelector(".area__pesquisa");
const mensagemErro = document.querySelector(".mensagem");
const body = document.querySelector("body");
const containerDadosClima = document.querySelector(".container__dados-clima");

class App {
  #diasDaSemana = [
    "Domingo",
    "Segunda-Feira",
    "Terça-Feira",
    "Quarta-Feira",
    "Quinta-Feira",
    "Sexta-Feira",
    "Sábado",
  ];

  constructor() {
    areaPesquisa.addEventListener(
      "click",
      this._eventosAreaPesquisa.bind(this)
    );
    this._localizacaoGpsNavegador();
  }

  _limparMensagemTela() {
    return (mensagemErro.textContent = "");
  }

  _mensagemErro(mensagem) {
    mensagemErro.classList.remove("mensagem__incial");
    mensagemErro.classList.add("mensagem__erro");
    this._limparMensagemTela();
    mensagemErro.textContent = mensagem;

    setTimeout(() => {
      this._limparMensagemTela();
    }, 5000);
  }

  _removerElementoDaTela() {
    const elemento = containerDadosClima.querySelector(".dados__clima");

    if (elemento) {
      body.style.backgroundImage = "";
      elemento.remove();
      return;
    }
  }

  _mostrandoDadosUI(dadosClima) {
    const html = `
      <div class="dados__clima">

        <h2 class="nome__cidade">${dadosClima.cidade}</h2>

        <div class="dados__principal">
          <img src="img/condicaoTempo/${dadosClima.condicaoTempo}.svg" alt="imagem de ${dadosClima.condicaoTempo}" class="img__condicao-tempo">

          <div class="dados__tempo">
            <p class="temperatura">${dadosClima.temperatura}</p>
            <p class="condicao__tempo">${dadosClima.condicaoTempo}</p>
          </div>
        </div>
        
        <div class="area__dados-complementares">
          <div class="area__dados">
            <p class="titulo__area-dados">Máx:</p>
            <p class="temp__max"><i class="fa-solid fa-temperature-arrow-up icone icone__temp-max"></i> ${dadosClima.tempMaxima}</p>
          </div>
  
          <div class="area__dados">
            <p class="titulo__area-dados">Mín:</p>
            <p class="temp__min"> <i class="fa-solid fa-temperature-arrow-down icone icone__temp-min"></i> ${dadosClima.tempMinima}</p>
          </div>
          
          <div class="area__dados">
            <p class="titulo__area-dados">Vento:</p>
            <p class="vento"> ${dadosClima.vento} <i class="fa-solid fa-wind icone icone__vento"></i> </p>
          </div>
          
          <div class="area__dados">
            <p class="titulo__area-dados">Probabilidade de Chuva:</p>
            <p class="probabilidade__chuva"><i class="fas fa-cloud-rain icone icone__chuva"></i> ${dadosClima.probabilidadeDeChuva}</p>
          </div>

          <div class="area__dados">
            <p class="titulo__area-dados">Umidade</p>
            <p class="umidade"><i class="fas fa-droplet icone icone__agua"></i> ${dadosClima.umidade}</p>
          </div>

        </div>
    `;

    body.style.backgroundImage = `url(./img/${dadosClima.condicaoTempo}.webp)`;

    if (
      dadosClima.condicaoTempo === "Nublado" ||
      dadosClima.condicaoTempo === "Chuva" ||
      dadosClima.condicaoTempo === "Noite"
    ) {
      containerDadosClima.classList.remove("fundo__branco");
      containerDadosClima.classList.add("fundo__preto");
    }

    if (dadosClima.condicaoTempo === "Ensolarado") {
      containerDadosClima.classList.add("fundo__branco");
      containerDadosClima.classList.remove("fundo__preto");
    }

    containerDadosClima.insertAdjacentHTML("beforeend", html);
  }

  _condicaoTempo(codigoClima, diaOuNoite) {
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
  }

  _formatandoDadosClima(dadosClima, nomeCidade) {
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
      condicaoTempo: this._condicaoTempo(
        dadosClima.current_weather.weathercode,
        dadosClima.current_weather.is_day ? "Dia" : "Noite"
      ),
      diaDaSemana: this.#diasDaSemana[new Date().getDay()],
      umidade:
        dadosClima.hourly.relativehumidity_2m[0] +
        dadosClima.hourly_units.relativehumidity_2m,
      cidade: nomeCidade,
    };

    return dados;
  }

  _getPosition() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  }

  async _localizacaoGpsNavegador() {
    const position = await this._getPosition();
    const { latitude: lat, longitude: lon } = position.coords;
    const coords = { lat, lon };
    this._clima(coords);
  }

  async _eventosAreaPesquisa(e) {
    e.preventDefault();

    if (e.target.closest(".icone__lupa")) {
      const nomeCidadePesquisada = inputPesquisa.value;

      if (!nomeCidadePesquisada || nomeCidadePesquisada.length < 3)
        return this._mensagemErro("Cidade inválida");

      const coordsCidade = await this._coordsCidade(nomeCidadePesquisada);
      this._clima(coordsCidade);
    }
  }

  async _clima(coords) {
    const dadosClimaAtual = await this._climaAtual(coords);
    const nomeCidadeFormatado = await this._coordsLocalizacao(coords);
    const climaAtual = this._formatandoDadosClima(
      dadosClimaAtual,
      nomeCidadeFormatado
    );
    inputPesquisa.value = this._limparMensagemTela();

    this._removerElementoDaTela();
    this._mostrandoDadosUI(climaAtual);
  }

  async _coordsCidade(cidade) {
    try {
      const coordsCidade = await fetch(
        `https://api.geoapify.com/v1/geocode/search?text=${cidade}&apiKey=b3802fe2c77841159c7cf24a61b31dc1`
      );

      if (!coordsCidade.ok) throw new Error("Cidade digata inválida");

      const coordsDadosCidade = await coordsCidade.json();

      const { lat, lon } = coordsDadosCidade?.features[0]?.properties;

      return { lat, lon };
    } catch (err) {
      this._mensagemErro(err.message);
    }
  }

  async _coordsLocalizacao(coords) {
    try {
      const { lat, lon } = coords;

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
      this._mensagemErro(err.message);
    }
  }

  async _climaAtual(coords) {
    try {
      const { lat, lon } = coords;

      const clima = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,daylight_duration,sunshine_duration,uv_index_max,winddirection_10m_dominant&hourly=temperature_2m,rain,soil_moisture_0_to_1cm,relativehumidity_2m,precipitation_probability,wind_speed_10m,wind_direction_10m&current_weather=true`
      );

      if (!clima.ok) throw new Error("Erro em achar clima");

      const dadosClima = await clima.json();

      return dadosClima;
    } catch (err) {
      this._mensagemErro(err.message);
    }
  }
}

const app = new App();
