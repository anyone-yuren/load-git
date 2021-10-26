#!/usr/bin/env node
const program = require('commander')
const chalk = require('chalk')
const handleWebCode = require('./functionFlow/handleWebCode')
const { print } = require('./utils')

program
  // 版本信息
  .version('0.2', '-v, --version')
  .name('智慧投行 PC 端编译工具')
  // 选择名 项目名称 选项描述 默认值
  .usage('buildWeb [name] [gitUrl] [branch] [buildOrder]')
  .parse(process.argv)

// todo 全局入口
const resolve = program => {
  // 没有匹配任何选项的参数会被放到数组 args 中
  const [name, gitUrl, branch, buildOrder, ...args] = program.args
  if (!name || !gitUrl|| !branch || !buildOrder) {
    console.log(
      chalk.redBright('请完整输入四个参数：') +
        chalk.bgGreen(chalk.black(' 项目名称 ')) +
        ' ' +
        chalk.bgGreen(chalk.black(' git地址 ')) +
        ' ' +
        chalk.bgGreen(chalk.black(' 分支名 '))+
        ' ' +
        chalk.bgGreen(chalk.black(' 编译命令 '))
    )
    return
  }
  // todo 执行主流程
  process.env.equipment = 'web'
  print.programStart(`${name} ${gitUrl} ${branch} ${buildOrder} `)
  handleWebCode(name, gitUrl, branch, buildOrder)
}

resolve(program)
