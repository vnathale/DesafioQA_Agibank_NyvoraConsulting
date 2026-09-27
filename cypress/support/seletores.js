/**
 * Mapa único da interface da pesquisa.
 * O id `ast-seach-full-screen-form` é o publicado pelo tema Astra (grafia "seach").
 */
const seletores = {
  lupa: 'a.astra-search-icon',
  overlay: '#ast-seach-full-screen-form',
  campoBusca: '#ast-seach-full-screen-form input[name="s"]',
  botaoPesquisar: '#ast-seach-full-screen-form #search_submit',
  tituloResultados: 'h1.page-title',
  artigos: 'article',
}

module.exports = { seletores }
