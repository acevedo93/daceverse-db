
module.exports = function setupAgent (AgentModel) {
  const findById = (id) => {
    return AgentModel.findById(id)
  }

  const createOrUpdate = async (agent) => {
    const cond = {
      where: {
        uuid: agent.uuid
      }
    }
    const existingAgent = await AgentModel.findOne(cond)
    if (existingAgent) {
      const updated = await AgentModel.update(agent, cond)
      return updated ? AgentModel.findOne(cond) : existingAgent
    }

    return AgentModel.create(agent)
  }

  const findAll = () => {
    return AgentModel.findAll()
  }

  const findConnected = () => {
    return AgentModel.findAll({
      where: {
        connected: true
      }
    })
  }
  const findByUserName = (username) => {
    return AgentModel.findAll({
      where: {
        username
      }
    })
  }

  return {
    createOrUpdate,
    findById,
    findAll,
    findConnected,
    findByUserName
  }
}
