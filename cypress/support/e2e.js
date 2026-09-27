const errosConhecidosDoBlog = [
  /imagesLoaded is not a function/i,
  /ResizeObserver loop/i,
  /Script error/i,
]

Cypress.on('uncaught:exception', (err) => {
  const mensagem = err && err.message ? err.message : String(err)
  const conhecido = errosConhecidosDoBlog.some((padrao) => padrao.test(mensagem))

  if (conhecido) {
    return false
  }
})

require('./commands')
