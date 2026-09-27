const fs = require('fs')
const path = require('path')
const { spawnSync } = require('child_process')

const raiz = path.resolve(__dirname, '../..')
const allureBin = path.join(raiz, 'node_modules', 'allure', 'cli.js')
const cypressBin = path.join(raiz, 'node_modules', 'cypress', 'bin', 'cypress')

function pastaDoModo(modo) {
  return path.join(raiz, 'execucoes', modo)
}

function resultadosDoModo(modo) {
  return path.join(pastaDoModo(modo), 'allure-results')
}

function relatorioDoModo(modo) {
  return path.join(pastaDoModo(modo), 'allure-report')
}

function executar(binario, args, env) {
  const resultado = spawnSync(process.execPath, [binario, ...args], {
    cwd: raiz,
    env: { ...process.env, ...env },
    stdio: 'inherit',
  })

  if (resultado.error) {
    console.error(resultado.error.message)
    return 1
  }

  return resultado.status === null ? 1 : resultado.status
}

function limparResultados(modo) {
  fs.rmSync(resultadosDoModo(modo), { recursive: true, force: true })
  fs.mkdirSync(resultadosDoModo(modo), { recursive: true })
}

function temResultados(modo) {
  const pasta = resultadosDoModo(modo)
  if (!fs.existsSync(pasta)) {
    return false
  }

  return fs.readdirSync(pasta).some((arquivo) => arquivo.endsWith('-result.json'))
}

function garantirBinario() {
  if (executar(cypressBin, ['verify']) === 0) {
    return 0
  }

  console.log('O binário do Cypress está ausente ou incompleto. A reinstalação começa agora e pode levar alguns minutos.')
  return executar(cypressBin, ['install', '--force'])
}

function rodarCypress(modo, { browser, headed, interativo }) {
  if (garantirBinario() !== 0) {
    return 1
  }

  limparResultados(modo)

  const args = interativo ? ['open'] : ['run', '--browser', browser]
  if (headed && !interativo) {
    args.push('--headed')
  }

  return executar(cypressBin, args, {
    ALLURE_RESULTS_DIR: resultadosDoModo(modo),
    EXECUCAO_MODO: modo,
    EXECUCAO_NAVEGADOR: browser,
  })
}

function gerarRelatorio(modo) {
  const resultados = resultadosDoModo(modo)
  if (!temResultados(modo)) {
    console.error('Os testes não geraram resultado. O relatório Allure não foi criado.')
    return 1
  }

  fs.rmSync(relatorioDoModo(modo), { recursive: true, force: true })

  return executar(allureBin, [
    'awesome',
    resultados,
    '--output',
    relatorioDoModo(modo),
    '--name',
    `Pesquisa de artigos — ${modo}`,
    '--lang',
    'pt',
  ])
}

function abrirRelatorio(diretorio) {
  return executar(allureBin, ['open', diretorio])
}

module.exports = {
  raiz,
  pastaDoModo,
  resultadosDoModo,
  relatorioDoModo,
  rodarCypress,
  gerarRelatorio,
  abrirRelatorio,
  executar,
  allureBin,
}
