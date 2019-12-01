'use strict'
const setupDatabase = require('./lib/db')
const setupMetricModel = require('./models/metric')
const setupAgentModel = require('./models/agent')
const setupConfigTestDb = require('./tests/helpers')
const AgentController = require('./controlers/agent.ctrl')
const MetricController = require('./controlers/metric.ctrl')
module.exports = async (config) => {
  // si config no esta definido es necesario configurar una
  // de pruebas
  config = setupConfigTestDb(config)
  const sequelize = setupDatabase(config)
  const AgentModel = setupAgentModel(config)
  const MetricModel = setupMetricModel(config)
  // un modelo tiene muchas metricas y una metric pertecene a un agente
  AgentModel.hasMany(MetricModel)
  MetricModel.belongsTo(AgentModel)

  await sequelize.authenticate()

  if (config.setup) {
    await sequelize.sync({ force: true })
  }
  const Agent = AgentController(AgentModel)
  const Metric = MetricController(MetricModel, AgentModel)
  return {
    Agent,
    Metric
  }
}
