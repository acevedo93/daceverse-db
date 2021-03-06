'use strict'

let db = null
const test = require('ava')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const agentFixtures = require('./fixtures/agent.fixture')

const config = {
  // disable loggin
  logging: function () {}
}
let sandbox = null
const MetricStub = {
  belongsTo: sinon.spy()
}

const single = { ...agentFixtures.single }
const newAgent = { ...agentFixtures.newAgent }
const id = 1
const uuid = 'yyy-yyy-yyy'
const username = 'dodorian'
const uuidArgs = {
  where: {
    uuid
  }
}
const ArgsConnected = {
  where: {
    connected: true
  }
}
const ArgsUserName = {
  where: {
    username
  }
}

let AgentStub = null
// -------------------------------//
test.beforeEach(async () => {
  sandbox = sinon.createSandbox()

  AgentStub = {
    hasMany: sandbox.spy()
  }
  // find By Id
  AgentStub.findById = sandbox.stub()
  AgentStub.findById.withArgs(id).returns(Promise.resolve(agentFixtures.findById(id)))
  // createOrupdate when user exists
  AgentStub.findOne = sandbox.stub()
  AgentStub.findOne.withArgs(uuidArgs).returns(Promise.resolve(agentFixtures.byuuid(uuid)))

  AgentStub.update = sandbox.stub()
  AgentStub.update.withArgs(single, uuidArgs).returns(Promise.resolve(single))
  AgentStub.create = sandbox.stub()
  AgentStub.create.withArgs(newAgent).returns(Promise.resolve(newAgent))
  // find all
  AgentStub.findAll = sandbox.stub()
  AgentStub.findAll.withArgs().returns(Promise.resolve(agentFixtures.all))
  AgentStub.findAll.withArgs(ArgsConnected).returns(Promise.resolve(agentFixtures.connected))
  AgentStub.findAll.withArgs(ArgsUserName).returns(Promise.resolve(agentFixtures.userName))
  const setupDatabase = proxyquire('../', {
    './models/agent': () => AgentStub,
    './models/metric': () => MetricStub
  })
  db = await setupDatabase(config)
})

test.afterEach(t => {
  sandbox && sandbox.restore()
})

test.serial('make it pass', t => {
  t.pass()
})

test.serial('Agent', t => {
  t.truthy(db.Agent, 'Agent service should exist')
})

test.serial('Setup', t => {
  t.true(AgentStub.hasMany.called, 'AgentModel.hasmany was executed')
  t.true(AgentStub.hasMany.calledWith(MetricStub), 'argument is full correct')
  t.true(MetricStub.belongsTo.called, 'metricModel.belongsTo was executed')
  t.true(MetricStub.belongsTo.calledWith(AgentStub), 'argument is full correct')
})
test.serial('Agent#findById', async t => {
  const agent = await db.Agent.findById(id)
  t.true(AgentStub.findById.called, 'find by id is should be called')
  t.true(AgentStub.findById.calledOnce, 'find by id is should be calledOnce')
  t.true(AgentStub.findById.calledWith(id))
  t.deepEqual(agent, agentFixtures.findById(id), 'should be the same')
})
test.serial('Agent#createOrUpdate - when agent exists', async t => {
  const agent = await db.Agent.createOrUpdate(single)
  t.true(AgentStub.findOne.called, 'should be call')
  t.true(AgentStub.findOne.calledTwice, 'should be call 2 times')
  t.true(AgentStub.update.calledOnce, 'update should be calle once')
  t.deepEqual(agent, single, 'Agent should be equal to single')
})
test.serial('Agent#findAll', async t => {
  const agents = await db.Agent.findAll()
  t.true(AgentStub.findAll.called, 'findAll should be called on model')
  t.true(AgentStub.findAll.calledOnce, 'findAll should be called once')
  t.true(AgentStub.findAll.calledWith(), 'findAll should be called without args')
  t.deepEqual(agents, agentFixtures.all, 'agents should be the same')
  t.is(agents.length, agentFixtures.all.length, 'should be the same length')
})
test.serial('Agents#findConnected', async t => {
  const agents = await db.Agent.findConnected()
  t.true(AgentStub.findAll.called, 'findAll should be called ')
  t.true(AgentStub.findAll.calledOnce, 'findAll should be called once')
  t.deepEqual(agents, agentFixtures.connected, 'should be equal')
})

test.serial('Agents#findByUsername', async t => {
  const agents = await db.Agent.findByUserName(username)
  t.true(AgentStub.findAll.called, 'findAll should be called on model')
  t.true(AgentStub.findAll.calledOnce, 'findAll should be called once')
  t.true(AgentStub.findAll.calledWith(ArgsUserName), 'findAll should be called with username args')
  t.deepEqual(agents, agentFixtures.userName, 'should be equal')
})

test.serial('Agent#createOrUpdate - new', async t => {
  const agent = await db.Agent.createOrUpdate(newAgent)

  t.true(AgentStub.findOne.called, 'findOne should be called on model')
  t.true(AgentStub.findOne.calledOnce, 'findOne should be called once')
  t.true(AgentStub.findOne.calledWith({
    where: { uuid: newAgent.uuid }
  }), 'findOne should be called with uuid args')
  t.true(AgentStub.create.called, 'create should be called on model')
  t.true(AgentStub.create.calledOnce, 'create should be called once')
  t.true(AgentStub.create.calledWith(newAgent), 'create should be called with specified args')

  t.deepEqual(agent, newAgent, 'agent should be the same')
})
