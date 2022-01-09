const inquirer = require('inquirer');
const { exec } = require('child_process');
const fs = require('fs');
const { TS_NAME, JS_NAME, CRA_NAME, NEXT_NAME, NPM_NAME, YARN_NAME } = require('./constants')
const createConfig = require('./createConfig')

const run = async () => {
  const response = await inquirer.prompt([
    {
      type: 'rawlist',
      name: 'language',
      message: 'Linguagem',
      choices: [TS_NAME, JS_NAME],
    },
    {
      type: 'rawlist',
      name: 'framwork',
      message: 'Framework utilizado',
      choices: [CRA_NAME, NEXT_NAME],
    },
    {
      type: 'rawlist',
      name: 'manager',
      message: 'Gerenciador de pacotes',
      choices: [YARN_NAME, NPM_NAME],
    },
  ])
  createConfig(response)
}

run()