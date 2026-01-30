import { localizacaoGpsNavegador, climaAtual, formatandoDadosClima, coordsCidade, coordsNomeCidadeFormatado } from '../model/appModel.js';
import view from '../view/appView.js';

const posicaoUsuarioGps = async function() {
  try {
    const { lat, lon } = await localizacaoGpsNavegador();
    const clima = await climaAtual(lat, lon);
    const nomeCidade = await coordsNomeCidadeFormatado(lat, lon);
    const dadosClima = formatandoDadosClima(clima, nomeCidade);
    setTimeout(() => view.limpandoMensagem(), 7000);
    view.render(dadosClima);
  } catch(err) {
    view.mensagemError(err);
  }
}

const buscarCidade = async function(nomeCidade) { 
  try {
    const {lat, lon} = await coordsCidade(nomeCidade);
    const climaCidade = await climaAtual(lat, lon);
    
    nomeCidade = await coordsNomeCidadeFormatado(lat, lon);
    const dadosClima = formatandoDadosClima(climaCidade, nomeCidade);
    
    view.limparInputPesquisa();
    view.limpandoMensagem();
    view.limparContainerDadosClima();
    view.render(dadosClima);
  } catch (err) {
    view.mensagemError(err);
  }
}

const init = function() {
  view.eventoClickLupa(buscarCidade);
  posicaoUsuarioGps();
};

init();