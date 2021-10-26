#!/usr/bin/env node
const program = require('commander')
const chalk = require('chalk')
const handlePcCode = require('./functionFlow/handlePcCode')
const { print } = require('./utils')

program
  // 版本信息
  .version('0.2', '-v, --version')
  .name('智慧投行 PC 端编译工具')
  // 选择名 项目名称 git地址 分支名
  .usage('buildPC [name] [gitUrl] [branch]')
  .parse(process.argv)

// todo 全局入口
const resolve = program => {
  // 没有匹配任何选项的参数会被放到数组 args 中
  const [name, gitUrl, branch, ...args] = program.args
  if (!name || !gitUrl || !branch) {
    console.log(
      chalk.red('请完整输入三个参数：') +
        chalk.bgGreen(chalk.black(' 项目名称 ')) +
        ' ' +
        chalk.bgGreen(chalk.black(' git地址 '))+
        ' ' +
        chalk.bgGreen(chalk.black(' 分支名 '))
    )
    return
  }

  // todo 执行主流程
  process.env.equipment = 'pc'
  print.programStart(`${name} ${gitUrl} ${branch} `)
  handlePcCode(name, gitUrl, branch)
}

resolve(program)
