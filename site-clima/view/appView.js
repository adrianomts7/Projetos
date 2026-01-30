class AppView {
  #containerDadosClima = document.querySelector('.container__dados-clima');
  #body = document.querySelector('body');
  #mensagem = document.querySelector('.mensagem');
  #inputPesquisa = document.querySelector('.input__buscar-cidade');
  #iconeLupa = document.querySelector('.icone__lupa');
  #formPesquisa = document.querySelector('.form__pesquisa');

  eventoClickLupa(handler) {
    this.#iconeLupa.addEventListener('click', (e) => {
      e.preventDefault();
      handler(this.#inputPesquisa.value);
    })
  }

  render(dadosClima) {
    const html = this.#template(dadosClima);
    this.#mudarImagemDeFundoCondicaoTempo(dadosClima);
    this.#adicionarDadosClimaUi(html);
  }

  #template(dadosClima) {
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
    return html;
  }
  
  #mudarImagemDeFundoCondicaoTempo(dadosClima) {
    this.#body.style.backgroundImage = `url(./img/${dadosClima.condicaoTempo}.webp)`;
    if (
      dadosClima.condicaoTempo === "Nublado" ||
      dadosClima.condicaoTempo === "Chuva" ||
      dadosClima.condicaoTempo === "Noite"
    ) {
      this.#containerDadosClima.classList.remove("fundo__branco");
      this.#containerDadosClima.classList.add("fundo__preto");
    }
    
    if (dadosClima.condicaoTempo === "Ensolarado") {
      this.#containerDadosClima.classList.add("fundo__branco");
      this.#containerDadosClima.classList.remove("fundo__preto");
    }
  }

  #adicionarDadosClimaUi(htmlDadosClima) {
    this.#containerDadosClima.insertAdjacentHTML("beforeend", htmlDadosClima);
  }

  limparContainerDadosClima() {
    const el = this.#containerDadosClima.querySelector('.dados__clima');
    if (el) el.remove();
  }

  limparInputPesquisa() {
    this.#inputPesquisa.value = '';
  }

  limpandoMensagem() {
    this.#mensagem.textContent = '';
  }

  mensagemError(mensagem) {
    this.#mensagem.textContent = mensagem;
    this.#mensagem.style.color = '#c92a2a';
    
    setTimeout(() => {
      this.limpandoMensagem();
      this.#mensagem.style.color = '#3B82F6';
    }, 3000);
    
  }

};

export default new AppView;