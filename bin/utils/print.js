const chalk = require('chalk')
const { setLog } = require('./setData')

// todo 程序开始
const programStart = (message) => {
  setLog(``, true)
  setLog(`**************  程序开始: ${message}  **************`, true)
  setLog(``, true)
}

// todo 神兽
const photo = (message) => {
  setTimeout(() => {
    setLog(``, true)
    setLog(`************************************************* 程序执行结束 ******************************************`, true)
    setLog(``, true)
    setLog(``, true)
    setLog(``, true)
    console.log('')
    console.log(
      chalk.cyan(
        `
       　 ┏┓　   ┏┓+ +
       　┏┛┻━━━━━┛┻━━┓ + +
       　┃　　　　　　┃ 　
       　┃　　　　　  ┃++ + + +
        ████ ━ ████   ┃+
       　┃　　　　　 　┃ +
       　┃　　┻　　　  ┃
       　┃　　　　　　 ┃ + +
       　┗━┓　　　┏━┛
      　　　┃　　　┃　+ + + 　　　　　　　　　
      　　　┃　　　┃ 
      　　　┃　　　┃ +      ${message || '程序'}执行完毕
      　　　┃　　　┃ + 
      　　　┃　　　┃        欢迎再次光临
      　　　┃　　　┃　　+　　 　　　    　　　
      　　　┃　 　　┗━━━┓ + +
      　　　┃ 　　　　　　　┣┓
      　　　┃ 　　　　　　　┏┛
      　　　┗┓┓┏━┳┓┏┛ + + + +
      　　　　┃┫┫　┃┫┫
      　　　　┗┻┛　┗┻┛+ + + +
    `
      )
    )
    console.log('')
  }, 1000)
}

// todo 当前运行命令的颜色（紫底+白）
const order = code => {
  setLog(`${code}`)
  console.log('')
  console.log(chalk.bgMagentaBright(chalk.bold(code)))
  console.log('')
}

// todo 提示（绿色）
const tip = info => {
  setLog(info)
  console.log('')
  console.log(chalk.green(info))
}

// todo 注意（黄色）
const note = info => {
  setLog(info)
  console.log('')
  console.log(chalk.cyan(info))
}

// todo 代码成功执行完毕（绿底）
const success = (info = null) => {
  setLog(info)
  console.log('')
  console.log(info + chalk.bgGreen('  命令执行完毕'))
  console.log('')
}

// todo 错误信息输出（红色带文字）
const error = info => {
  setLog(info)
  console.log('')
  console.log(chalk.redBright('错误:  ' + info))
  console.log('')
}
// todo 红色
const red = info => {
  setLog(info)
  console.log('')
  console.log(chalk.redBright(info))
  console.log('')
}

// todo 日志输出
const info = info => {
  setLog(info)
  console.log(info)
}

// todo buffer 日志输出
const bufferInfo = info => {
  setLog(info)
  console.log(info)
}

const print = {
  programStart,
  photo,
  order,
  tip,
  red,
  error,
  note,
  success,
  info,
  bufferInfo
}

module.exports = print
