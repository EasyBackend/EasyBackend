#!/usr/bin/env node
import * as inquirer from 'inquirer'
import { createProject } from './create-project'
import { parseArgs } from './init-git'
import { createServerQuestions } from './init-questions'

const promptForMissingOptions = async (options: {
  git: any
  template: any
  runInstall: boolean
  skipPrompts?: any
}) => {
  const defaultTemplate = 'Typescript'
  if (options.skipPrompts) {
    return {
      ...options,
      template: options.template || defaultTemplate,
    }
  }
  if (!options.template) {
    createServerQuestions.push({
      type: 'list',
      name: 'template',
      message: 'Please choose which project template to use',
      choices: ['Typescript'],
      default: defaultTemplate,
    })
  }
  if (!options.git) {
    createServerQuestions.push({
      type: 'confirm',
      name: 'git',
      message: 'Initialize a git repository?',
      default: false,
    })
  }
  const answers = await inquirer.prompt(createServerQuestions)
  return {
    ...options,
    template: options.template || answers.template,
    git: options.git || answers.git,
    database: answers.database,
    databaseUri: answers.databaseUri,
    implementation: answers.implementation,
    level: answers.level,
    projectName: answers.projectName,
  }
}

export const initialCli = async (rawArgs: string[]) => {
  const spec = {
    '--git': Boolean,
    '--install': Boolean,
    '-g': '--git',
    '-y': '--yes',
    '-i': '--install',
  }
  const args = parseArgs(rawArgs, spec)
  let options = {
    git: args['--git'] || false,
    template: args._[0],
    runInstall: args['--install'] || false,
  }
  options = await promptForMissingOptions(options)
  await createProject(options)
}
