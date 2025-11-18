import { traduzirTexto } from './TraducaoApi';

const cacheMemoria = {};

export async function buscarLivros(query) {
  try {
    if (!query?.trim()) return [];

    // Coleta as informações do livro e salva na variável
    const chaveCache = `livros_${query.toLowerCase().trim()}`;

    // Verifica se o livro aberto possui informação em cache
    if (cacheMemoria[chaveCache]) {
      console.log('📚 Retornando do cache em memória:', chaveCache);
      return cacheMemoria[chaveCache];
    }

    const response = await fetch(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=10`
    );
    const data = await response.json();

    /*  
      Traduz título e autor e carregando posters e utilizando 
      o Promise.all para traduzir em paralelo/simultâneo (Melhorando o desempenho das traduções)
    */
    const livrosTraduzidos = await Promise.all(
      (data.docs || []).map(async (livro) => {
        const tituloTraduzido = await traduzirTexto(livro.title);
        const autorTraduzido = livro.author_name
          ? await traduzirTexto(livro.author_name[0])
          : 'Autor desconhecido';

        return {
          ...livro,
          tituloTraduzido,
          autorTraduzido,
          capa: livro.cover_i
            ? `https://covers.openlibrary.org/b/id/${livro.cover_i}-L.jpg`
            : null,
        };
      })
    );

    cacheMemoria[chaveCache] = livrosTraduzidos;


    return livrosTraduzidos;
  } catch (error) {
    console.error('Erro ao buscar livros:', error);
    throw error;
  }
}

export async function carregarLivrosPadrao(listaDeTitulos) {
  try {
    const todos = await Promise.all(listaDeTitulos.map(buscarLivros));
    // Achata a lista de resultados (cada termo retorna uma lista)
    return todos.flat();
  } catch (error) {
    console.error('Erro ao carregar livros padrão:', error);
    throw error;
  }
}
