'use strict'

const agent = {
  id: 1,
  uuid: 'yyy-yyy-yyy',
  name: 'fixture',
  username: 'dodorian',
  hostname: 'test-host',
  pid: 0,
  connected: true,
  createdAt: new Date(),
  updatedAt: new Date()
}

const agents = [
  agent,
  extend(agent, {
    id: 2,
    uuid: 'yyy-yyy-yyy',
    name: 'fixture2',
    username: 'dodorian',
    hostname: 'test-host',
    pid: 0,
    connected: false,
    createdAt: new Date(),
    updatedAt: new Date()
  }),
  extend(agent, {
    id: 3,
    uuid: 'xxx-xxx-xxx'
  })
]
const AgentDontExist = {
  id: 3,
  uuid: 'fff-fff-ff',
  name: 'fixture2¿43',
  username: 'dodorian',
  hostname: 'test-host',
  pid: 0,
  connected: true,
  createdAt: new Date(),
  updatedAt: new Date()
}

function extend (obj, values) {
  const clone = Object.assign({}, obj)
  return Object.assign(clone, values)
}

module.exports = {
  single: agent,
  all: agents,
  newAgent: AgentDontExist,
  connected: agents.filter(a => a.connected),
  userName: agents.filter(a => a.platzi === 'dodorian'),
  findById: id => agents.filter(a => a.id === id).shift(),
  byuuid: uuid => agents.filter(a => a.uuid === uuid).shift()
}
