'use strict'
const debug = require('debug')
const setupDatabase = require('./src/')

const config = {
  database: process.env.DB_NAME || 'daceverse',
  usernam: process.env.DB_USER || 'dacevedo',
  password: process.env.DB_PASS || 'shikari1993',
  host: process.env.DB_HOST || '127.0.0.1',
  dialect: 'postgres',
  logging: s => debug(s),
  setup: true
}

const initExample = async () => {
  const { Agent, Metric } = await setupDatabase(config).catch(err => console.log(err))
  // test methods
  const agent = {
    id: 2,
    uuid: 'yXyGFDSGF',
    name: 'fixture',
    username: 'dodorian',
    hostname: 'test-host',
    pid: 0,
    connected: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
  Agent.createOrUpdate(agent).then(res => console.log('---create agen', res))
  Agent.findAll().then(res => console.log('---create agen', res))
}

initExample()
