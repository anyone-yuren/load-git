const { pathCheck, clearStashCode, stashCode, checkoutTest, fetchCode } = require('./handle')
const { print } = require('../utils')

/**
 * todo 处理 code 主函数
 * @param {String} name 项目名称
 * @param {String} gitUrl 仓库路径
 * @param {String} branch 分支
 */
const handlePcCode = async (name, gitUrl, branch) => {
  try {
    await pathCheck(name)
    await clearStashCode(name)
    await stashCode(name)
    await fetchCode(name, gitUrl, branch)
    await checkoutTest(name, branch)
    print.photo('PC端流程')
  } catch (err) {
    print.error(err.toString())
    print.red('PC端流程出错！')
  }
}

module.exports = handlePcCode
