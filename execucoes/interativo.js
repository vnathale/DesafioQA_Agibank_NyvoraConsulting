const { rodarCypress, gerarRelatorio } = require('./lib/cypress')

const statusTestes = rodarCypress('interativo', { browser: 'electron', interativo: true })
gerarRelatorio('interativo')

process.exit(statusTestes)
