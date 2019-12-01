'use strict'
const debug = require('debug')('daceverse:db:setup')
const db = require('./index')
const inquirer = require('inquirer')

const prompt = inquirer.createPromptModule()
const setup = async () => {
  const answer = await prompt([
    {
      type: 'confirm',
      name: 'setup',
      message: 'This will destroy your database, are you sure?'
    }
  ])

  if (!answer.setup) {
    return console.log('nothing Happened! ')
  }

  const config = {
    database: process.env.DB_NAME || 'daceverse',
    usernam: process.env.DB_USER || 'dacevedo',
    password: process.env.DB_PASS || 'shikari1993',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'postgres',
    logging: s => debug(s),
    setup: true
  }
  await db(config).catch(handleFatalError)
  process.exit(0)
}

const handleFatalError = (err) => {
  console.error(err.message)
  console.error(err.stack)
  process.exit(1)
}

setup()
