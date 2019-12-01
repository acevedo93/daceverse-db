'use strict'
const AgentFixture = require('./agent.fixture')
const metric = {
  id: 1,
  agentId: AgentFixture.single.uuid,
  type: 'fixture',
  value: 'dodorian'
}

const metrics = [
  metric,
  extend(metric, {
    id: 2,
    agentId: 1,
    type: 'fixture',
    value: 'dodorian'
  }),
  extend(metric, {
    id: 3,
    agentId: 3,
    type: 'fixture',
    value: 'dodorian'
  })
]
const MetricDontExist = {
  agentId: 1,
  type: 'fixture',
  value: 900
}

function extend (obj, values) {
  const clone = Object.assign({}, obj)
  return Object.assign(clone, values)
}

function getAgentId (uuid) {
  return AgentFixture.byuuid(uuid).id || false
}

function findByAgentuuid (uuid, type = null) {
  const id = getAgentId(uuid)
  if (id) {
    const metricsByAgent = metrics.filter(m => m.agentId === id)
    if (!type) {
      return metricsByAgent
    }
    return metricsByAgent.filter(m => m.type === type)
  }
  return []
}

function findByTypeAgentUuid (type, uuid) {
  const finalMetrics = findByAgentuuid(uuid, type)
  if (finalMetrics) {
    return finalMetrics
  }
  return []
}

module.exports = {
  single: metric,
  all: metrics,
  newMetric: MetricDontExist,
  findById: id => metrics.filter(a => a.agentId === id).shift(),
  findByAgentuuid,
  findByTypeAgentUuid
}
