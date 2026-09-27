const { paginaInicial } = require('../../support/pages/pagina-inicial.page')
const { paginaResultados } = require('../../support/pages/pagina-resultados.page')

describe('Pesquisa de artigos pela lupa', () => {
  beforeEach(() => {
    cy.fixture('busca').as('busca')
    paginaInicial.visitar()
  })

  it('encontra artigos quando o termo existe no blog', function () {
    paginaInicial.pesquisar(this.busca.termoComResultado)

    paginaResultados.deveRefletirOTermo(this.busca.termoComResultado)
    paginaResultados.deveListarArtigosRelacionados(this.busca.termoComResultado)
  })

  it('informa que não há artigos quando o termo não existe', function () {
    paginaInicial.pesquisar(this.busca.termoSemResultado)

    paginaResultados.deveRefletirOTermo(this.busca.termoSemResultado)
    paginaResultados.deveInformarAusenciaDeResultados()
  })

  it('abre a busca pela lupa e permite sair sem pesquisar', function () {
    paginaInicial.abrirBusca()
    paginaInicial.fecharBuscaPeloTeclado()

    cy.location('pathname').should('eq', '/')
    cy.location('search').should('eq', '')
    cy.location('hash').should('eq', '')
  })
})
