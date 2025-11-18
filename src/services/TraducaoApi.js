import axios from 'axios';

const cache = {};

export async function traduzirTexto(texto) {
  
  if (!texto) return texto;

  // Cria uma chave única para o cache (texto normalizado)
  const cacheKey = texto.trim().toLowerCase();


  if (cache[cacheKey]) {
   
    return cache[cacheKey];
  }

  let traducaoFinal = '';

  
  if (texto.length <= 500) {
    traducaoFinal = await traduzirParte(texto);
  } else {
    
    const partes = [];
    for (let i = 0; i < texto.length; i += 500) {
      partes.push(texto.slice(i, i + 500)); 
    }

    // Traduz todas as partes simultaneamente
    const traducoes = await Promise.all(partes.map(parte => traduzirParte(parte)));

    traducaoFinal = traducoes.join(' ');
  }

  cache[cacheKey] = traducaoFinal;

  return traducaoFinal;
}

async function traduzirParte(texto) {
  try {
    // Faz uma requisição GET para traduzir o texto
    const response = await axios.get('https://api.mymemory.translated.net/get', {
      params: {
        q: texto,          
        langpair: 'en|pt',
      },
    });

    
    return response.data.responseData.translatedText || texto;
  } catch (error) {
    
    console.error('Erro ao traduzir parte do texto:', error);
    return texto;
  }
}
