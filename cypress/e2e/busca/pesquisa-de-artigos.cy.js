const { epic, feature, story, severity, link, parameter } = require('allure-js-commons')
const { paginaInicial } = require('../../support/pages/pagina-inicial.page')
const { paginaResultados } = require('../../support/pages/pagina-resultados.page')

function contexto(historia, gravidade) {
  epic('Blog do Agi')
  feature('Pesquisa de artigos')
  story(historia)
  severity(gravidade)
  link('https://blog.agibank.com.br/', 'Blog do Agi')
}

describe('Pesquisa de artigos pela lupa', () => {
  beforeEach(() => {
    cy.fixture('busca').as('busca')
    paginaInicial.visitar()
  })

  it('encontra artigos quando o termo existe no blog', function () {
    contexto('Termo existente', 'critical')
    parameter('termo', this.busca.termoComResultado)

    paginaInicial.pesquisar(this.busca.termoComResultado)

    paginaResultados.deveRefletirOTermo(this.busca.termoComResultado)
    paginaResultados.deveListarArtigosRelacionados(this.busca.termoComResultado)
  })

  it('informa que não há artigos quando o termo não existe', function () {
    contexto('Termo inexistente', 'critical')
    parameter('termo', this.busca.termoSemResultado)

    paginaInicial.pesquisar(this.busca.termoSemResultado)

    paginaResultados.deveRefletirOTermo(this.busca.termoSemResultado)
    paginaResultados.deveInformarAusenciaDeResultados()
  })

  it('abre a busca pela lupa e permite sair sem pesquisar', function () {
    contexto('Abrir e sair da lupa', 'normal')

    paginaInicial.abrirBusca()
    paginaInicial.fecharBuscaPeloTeclado()

    cy.location('pathname').should('eq', '/')
    cy.location('search').should('eq', '')
    cy.location('hash').should('eq', '')
  })
})
