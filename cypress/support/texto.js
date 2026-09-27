function normalizar(valor) {
  return String(valor)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

function literalParaCypress(termo) {
  return String(termo).replace(/{/g, '{{}')
}

module.exports = { normalizar, literalParaCypress }
