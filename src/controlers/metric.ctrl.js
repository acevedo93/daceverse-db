'use strict'

module.exports = function MetricController (MetricModel, AgentModel) {
  async function findByAgentUuid (uuid) {
    const query = {
      attributes: ['type'],
      group: ['type'],
      include: [{
        attributes: [],
        model: AgentModel,
        where: {
          uuid
        }
      }],
      raw: true
    }

    return MetricModel.findAll(query)
  }

  async function findByTypeAgentUuid (type, uuid) {
    const query = {
      attributes: ['id', 'type', 'value', 'createdAt'],
      where: {
        type
      },
      limit: 20,
      order: [['createdAt', 'DESC']],
      include: [{
        attributes: [],
        model: AgentModel,
        where: {
          uuid
        }

      }],
      raw: true
    }
    return MetricModel.findAll(query)
  }
  async function create (uuid, metric) {
    const agent = await AgentModel.findOne({
      where: { uuid }
    })
    if (agent) {
      metric = { ...metric, agentId: agent.id }
      const result = await MetricModel.create(metric)
      return result.toJSON()
    }
    return false
  }
  return {
    create: create,
    findByAgentUuid: findByAgentUuid,
    findByTypeAgentUuid: findByTypeAgentUuid
  }
}
