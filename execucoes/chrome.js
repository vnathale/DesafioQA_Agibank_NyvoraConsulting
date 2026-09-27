const { rodarCypress, gerarRelatorio } = require('./lib/cypress')

const statusTestes = rodarCypress('chrome', { browser: 'chrome', headed: false })
const statusRelatorio = gerarRelatorio('chrome')

process.exit(statusTestes === 0 ? statusRelatorio : statusTestes)
