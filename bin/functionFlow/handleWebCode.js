const { print } = require('../utils')
const {
  pathCheck,
  clearStashCode,
  stashCode,
  fetchCode,
  checkoutTest,
  yarnCode,
  yarnEndTest,
  cpFile,
  buildCode,
  buildEndTest
} = require('./handle')

/**
 * todo 处理 code 主函数
 * @param name ( String ) 项目名称
 * @param gitUrl ( String ) 仓库路径 http/ssh/....
 * @param branch ( String ) 分支 master/...
 * @param buildOrder ( String ) 编译命令 build:pc
 */
const handleWebCode = async (name, gitUrl, branch, buildOrder) => {
  try {
    await pathCheck(name)
    await clearStashCode(name)
    await stashCode(name)
    await fetchCode(name, gitUrl, branch)
    await checkoutTest(name, branch)
    await yarnCode(name)
    await yarnEndTest(name)
    // 处理自己修改 elementUI 的问题
    cpFile(name)
    await buildCode(name, buildOrder)
    await buildEndTest(name)
    print.photo('WEB端流程')
  } catch (err) {
    print.error(err.toString())
    print.red('WEB端流程出错！')
  }
}

module.exports = handleWebCode
