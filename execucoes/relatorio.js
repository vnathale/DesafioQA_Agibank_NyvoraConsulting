const fs = require('fs')
const path = require('path')
const { resultadosDoModo, relatorioDoModo, gerarRelatorio, abrirRelatorio, executar, allureBin, raiz } = require('./lib/cypress')

const modo = process.argv[2]

if (modo) {
  const status = gerarRelatorio(modo)
  if (status !== 0) {
    process.exit(status)
  }
  process.exit(abrirRelatorio(relatorioDoModo(modo)))
}

const modos = fs
  .readdirSync(path.join(raiz, 'execucoes'), { withFileTypes: true })
  .filter((entrada) => entrada.isDirectory() && entrada.name !== 'lib' && entrada.name !== 'consolidado')
  .map((entrada) => entrada.name)
  .filter((nome) => fs.existsSync(resultadosDoModo(nome)))

if (modos.length === 0) {
  console.error('Nenhuma execução encontrada. Rode npm test antes de abrir o relatório.')
  process.exit(1)
}

const destino = path.join(raiz, 'execucoes', 'consolidado', 'allure-report')
fs.rmSync(destino, { recursive: true, force: true })

const status = executar(allureBin, [
  'awesome',
  ...modos.map((nome) => resultadosDoModo(nome)),
  '--output',
  destino,
  '--name',
  'Pesquisa de artigos — consolidado',
  '--lang',
  'pt',
])

if (status !== 0) {
  process.exit(status)
}

process.exit(abrirRelatorio(destino))
