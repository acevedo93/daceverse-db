'use strict'

const defaults = require('defaults')

const setupConfigTestDb = (config) => (
  defaults(config, {
    dialect: 'sqlite',
    pool: {
      max: 10,
      min: 0,
      idle: 1000
    },
    query: {
      raw: true
    }
  })
)
module.exports = setupConfigTestDb
