const path = require('path')

// todo 本地 log 存储位置
const logPath = () => {
  const dirnameLog = __dirname.split(path.sep)
  dirnameLog.pop()
  return `${dirnameLog.join('\\')}\\log`
}

// todo 命令跨文件运行的路径
const runPath = (isProject, projectName) => {
  return isProject ? '.' : `./${projectName}`
}

module.exports = {
  logPath,
  runPath
}
