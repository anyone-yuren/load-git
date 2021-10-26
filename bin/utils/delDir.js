const fs = require('fs')

/**
 * todo 清空当前文件夹内容（保留文件夹）
 * @param path ( String ) 删除地址
 */

const delDirDeep = path => {
  let files = []
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path)
    files.forEach((file, index) => {
      let curPath = path + '/' + file
      if (fs.statSync(curPath).isDirectory()) {
        delDirDeep(curPath) //递归删除文件夹
      } else {
        fs.unlinkSync(curPath) //删除文件
      }
    })
    fs.rmdirSync(path)
  }
}

// todo 导出入口
/**
 * todo 执行命令
 * @param path ( String ) 路径
 * @param saveFile ( Boolean ) 是否保留文件夹
 *
 */
const delDir = (path, saveFile) => {
  return new Promise(async () => {
    console.log('删除旧文件')
    await delDirDeep(path)
    if (saveFile) {
      fs.mkdirSync(path) // 清空了之后创建当前文件夹
    }
  })
}

module.exports = { delDir }
