'use strict'
const test = require('ava')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const agentFixtures = require('./fixtures/agent.fixture')
const metricFixtures = require('./fixtures/metric.fixture')
let sandbox = null
const uuid = 'yyy-yyy-yyy'
const type = 'fixture'
const config = {
  // este objeto de configuracion se le pasa a la base solo como base
  // la configuracion de la base de prueba se genera en index validando que tiene esa config
  logging: function () {}
}
const uuidArgs = {
  where: { uuid }
}

const AgentStub = {
  hasMany: sinon.spy()
}
const findAllArgs = {
  attributes: ['type'],
  group: ['type'],
  include: [{
    attributes: [],
    model: AgentStub,
    where: {
      uuid
    }
  }],
  raw: true
}
// agent stub
const findByTypeUuidArgs = {
  attributes: ['id', 'type', 'value', 'createdAt'],
  where: {
    type
  },
  limit: 20,
  order: [['createdAt', 'DESC']],
  include: [{
    attributes: [],
    model: AgentStub,
    where: {
      uuid
    }

  }],
  raw: true
}

const newMetric = {
  type: 'fixture',
  value: 900
  // createdAt: new Date(),
  // updatedAt: new Date()
}

let MetricStub = null
let db = null
test.beforeEach(async () => {
  sandbox = sinon.createSandbox()
  MetricStub = {
    belongsTo: sandbox.spy()
  }
  // metric stub
  MetricStub.create = sandbox.stub()
  MetricStub.create.withArgs().returns(Promise.resolve({
    toJSON () {
      return metricFixtures.newMetric
    }
  }))

  // find by type and uuid
  MetricStub.findAll = sandbox.stub()
  MetricStub.findAll.withArgs().returns(Promise.resolve(metricFixtures.all))
  MetricStub.findAll.withArgs(findByTypeUuidArgs).returns(Promise.resolve(metricFixtures.findByTypeAgentUuid(type, uuid)))
  // find by agent uuid
  MetricStub.findAll.withArgs(findAllArgs).returns(Promise.resolve(metricFixtures.findByAgentuuid(uuid)))
  // agent stub
  AgentStub.findOne = sandbox.stub()
  AgentStub.findOne.withArgs(uuidArgs).returns(Promise.resolve(agentFixtures.byuuid(uuid)))
  // obtenemos el modulo de configuracion de base de datos
  const setupDatabase = proxyquire('../', {
    './models/agent': () => AgentStub,
    './models/metric': () => MetricStub
  })
  db = await setupDatabase(config)
})

test.afterEach(async () => {
  sandbox && sandbox.restore()
})
test.serial('make it pass', t => {
  t.pass()
})

test.serial('metric exist', t => {
  t.truthy(db.Metric, 'Metric service should exist')
})

test.serial('setup', t => {
  t.true(AgentStub.hasMany.called, 'shoyuld be execute')
  t.true(MetricStub.belongsTo.called, 'should be execute')
  t.true(AgentStub.hasMany.calledWith(MetricStub), 'Argument should be the MetricModel')
  t.true(MetricStub.belongsTo.called, 'belongsTo was executed')
  t.true(MetricStub.belongsTo.calledOnce, 'belongsTo was executed once')
  t.true(MetricStub.belongsTo.calledWith(AgentStub), 'Argument should be the AgentStub')
})

test.serial('Metric#create', async t => {
  // creacion de metrica
  // la diferencia entre new Metric y metricFixture.newMetric
  // es que cuando usamos newMetric el id del cliente aun no fue agregado al objeto
  const metric = await db.Metric.create(uuid, newMetric)
  t.true(AgentStub.findOne.called, 'findONe should be called one')
  t.true(AgentStub.findOne.calledOnce, 'findONe called once')
  t.true(AgentStub.findOne.calledWith(uuidArgs), 'find One should be calle with uuid argument')
  t.true(MetricStub.create.called, 'should be called')
  t.true(MetricStub.create.calledOnce, 'create should be called once')
  t.true(MetricStub.create.calledWith(metricFixtures.newMetric), 'create should be called with specified newMetric Args')
  t.deepEqual(metric, metricFixtures.newMetric, 'metric should be the same')
})

test.serial('Metric#findByAgentUuid', async t => {
  const metric = await db.Metric.findByAgentUuid(uuid)
  t.true(MetricStub.findAll.called, 'find all should be called')
  t.true(MetricStub.findAll.calledOnce, 'findAll should be called once')
  t.true(MetricStub.findAll.calledWith(findAllArgs), 'findAll should be called without args')
  t.deepEqual(metric, metricFixtures.findByAgentuuid(uuid))
})

test.serial('Metric#findByTypeAgentUuid', async t => {
  const metric = await db.Metric.findByTypeAgentUuid(type, uuid)
  t.true(MetricStub.findAll.called, 'find all should be called')
  t.true(MetricStub.findAll.calledOnce, 'findAll should be called once')
  t.true(MetricStub.findAll.calledWith(findByTypeUuidArgs), 'find all with arguments')
  t.deepEqual(metric, metricFixtures.findByTypeAgentUuid(type, uuid))
})
