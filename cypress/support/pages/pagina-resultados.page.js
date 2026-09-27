const { seletores } = require('../seletores')
const { normalizar } = require('../texto')

const paginaResultados = {
  deveRefletirOTermo(termo) {
    cy.location('search').should((consulta) => {
      const parametros = new URLSearchParams(consulta)
      expect(parametros.get('s'), 'parâmetro s da URL').to.eq(termo)
    })

    cy.get(seletores.tituloResultados)
      .should('be.visible')
      .and('contain', termo)
  },

  deveListarArtigosRelacionados(termo) {
    cy.get(seletores.artigos).should('have.length.at.least', 1)

    cy.get(seletores.artigos).then(($artigos) => {
      const texto = [...$artigos].map((artigo) => artigo.innerText).join(' ')
      expect(normalizar(texto), 'conteúdo dos artigos').to.include(normalizar(termo))
    })
  },

  deveInformarAusenciaDeResultados() {
    cy.get(seletores.artigos).should('have.length', 0)
    cy.contains('Lamentamos, mas nada foi encontrado para sua pesquisa').should('be.visible')
  },
}

module.exports = { paginaResultados }
