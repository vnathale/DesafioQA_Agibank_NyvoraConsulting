const { rodarCypress, gerarRelatorio } = require('./lib/cypress')

const statusTestes = rodarCypress('headed', { browser: 'electron', headed: true })
const statusRelatorio = gerarRelatorio('headed')

process.exit(statusTestes === 0 ? statusRelatorio : statusTestes)
