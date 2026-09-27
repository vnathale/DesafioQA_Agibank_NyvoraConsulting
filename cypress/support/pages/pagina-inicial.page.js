const { seletores } = require('../seletores')
const { literalParaCypress } = require('../texto')

const paginaInicial = {
  visitar() {
    cy.visit('/')
    cy.esperarVariacaoDeCache()
    cy.get(seletores.lupa).filter(':visible').should('have.length.at.least', 1)
    cy.prepararBusca()
  },

  abrirBusca() {
    cy.sincronizarLupa()
    cy.get(seletores.lupa)
      .filter(':visible')
      .then(($icones) => {
        const alvo = [...$icones].find((el) => typeof el.onclick === 'function')
        cy.wrap(alvo).click()
      })
    cy.get(seletores.overlay).should('be.visible')
    cy.get(seletores.campoBusca)
      .should('be.visible')
      .and('have.attr', 'placeholder', 'Digite sua busca')
  },

  pesquisar(termo) {
    this.abrirBusca()
    cy.get(seletores.campoBusca).type(literalParaCypress(termo))
    cy.get(seletores.botaoPesquisar).click()
  },

  fecharBuscaPeloTeclado() {
    cy.get(seletores.campoBusca).type('{esc}')
    cy.get(seletores.overlay).should('not.be.visible')
  },
}

module.exports = { paginaInicial }
