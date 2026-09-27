const { rodarCypress, gerarRelatorio } = require('./lib/cypress')

const statusTestes = rodarCypress('headless', { browser: 'electron', headed: false })
const statusRelatorio = gerarRelatorio('headless')

process.exit(statusTestes === 0 ? statusRelatorio : statusTestes)
