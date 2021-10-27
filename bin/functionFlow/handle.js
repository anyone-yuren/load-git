const fs = require('fs')
const config = require('../config')
const { utils, print, setData, shell } = require('../utils')
const loading = require('loading-cli')
const { copyFile } = require('../utils/setData')

// 加载动画
const load = loading('')
// 是否在当前文件下
let isProject = false
// 默认没有此项目文件和git文件
let isExist = false
// 同名文件是否拥有Git文件
let isGit = false

// * 成功处理
const successOn = resolve => {
  return data => {
    load.succeed()
    console.log(data.tostring())
    resolve(data)
  }
}

// * 错误处理
const errorOn = reject => {
  return data => {
    load.fail()
    reject(data)
  }
}

/**
 * todo 路径校验和 '.git' 文件
 */
exports.pathCheck = (name) => {
  return new Promise((resolve) => {
    // 判断是否是此项目下
    try {
      isProject = fs.statSync(`.git`).isDirectory()
    } catch (error) {
      // 没有git文件
      isProject = false
    }

    try {
      isExist = fs.statSync(name).isDirectory()
      try {
        isGit = fs.statSync(`./${name}/.git`).isDirectory()
      } catch (error) {
        // 没有git文件
        isGit = false
      }
    } catch (error) {
      // 没有项目文件
      isExist = false
    }
    resolve(true)
  })
}

/**
 * todo 清除旧存储
 */
exports.clearStashCode = (name) => {
  return new Promise((resolve, reject) => {
    if (isProject) {
      print.note('清除旧存储...')
      print.order(shell.gitClearStash())
      load.start()
      utils
        .enOrderByPath(config.runPath(isProject, name), shell.gitClearStash())
        .then(successOn(resolve), errorOn(reject))
    } else {
      resolve(true)
    }
  })
}

/**
 * todo 存储当前更改
 */
exports.stashCode = (name) => {
  return new Promise((resolve, reject) => {
    if (isProject) {
      print.note('存储当前更改...')
      const stashName = setData.formatTime(new Date(), 'yyyy-MM-dd HH:mm:ss')
      print.order(shell.gitStash(stashName))
      load.start()
      utils
        .enOrderByPath(config.runPath(isProject, name), shell.gitStash(stashName))
        .then(successOn(resolve), errorOn(reject))
    } else {
      resolve(true)
    }
  })
}

/**
 * todo 拉取代码/更新代码
 * @param {*} name 项目名称
 * @param {*} gitUrl git 地址
 * @param {*} branch git 分支
 * @returns 
 */
exports.fetchCode = (name, gitUrl, branch) => {
  return new Promise((resolve, reject) => {
    let order
    if (isProject) {
      // 在项目目录下打开
      print.tip(`已拥有项目代码，开始切换并更新 ${branch} 分支代码...`)
      // 切换分支
      print.order(shell.gitCheckout(branch))
      utils.enOrder(shell.gitCheckout(branch), true).then(() => {
        // 开始更新
        load.start()
        print.order(shell.gitPull())
        utils
          .enOrder(shell.gitPull())
          .then(successOn(resolve), errorOn(reject), true)
      })
    } else if (isExist && isGit) {
      // 在父级目录下并且拉过代码
      print.tip(`当前子文件已拥有项目代码，开始切换并更新 ${branch} 代码...`)

      // 切换分支
      print.order(shell.gitCheckout(branch))
      utils
        .enOrderByPath(`${name}`, shell.gitCheckout(branch), true)
        .then(() => {
          // 开始更新
          load.start()

          print.order(shell.gitPull())
          utils
            .enOrderByPath(`${name}`, shell.gitPull(), true)
            .then(successOn(resolve), errorOn(reject))
        })
    } else if (isExist && !isGit) {
      // 在目录下有一个空的同名文件
      print.tip('清空相同项目名称无效文件夹（无 ".git" 文件)...')
      load.start()
      utils.deleteFolderSync(`${name}`)
      load.succeed()

      print.tip(`删除完毕！开始获取项目 ${branch} 分支代码...`)
      order = shell.gitClone(branch, gitUrl)
      print.order(order)
      load.start()
      utils.enOrder(order, true).then(successOn(resolve), errorOn(reject))
    } else {
      // 在当前目录没有项目代码，开始获取代码
      print.tip(`开始获取 ${branch} 分支代码...`)
      order = shell.gitClone(branch, gitUrl)
      print.order(order)
      load.start()
      utils.enOrder(order, true).then(successOn(resolve), errorOn(reject))
      load.succeed()
    }
  })
}

/**
 * @description: 
 * @param {*} name 项目名称
 * @param {*} gitUrl git 地址
 * @return {*}
 */
exports.getShortLog = (name,gitUrl) => {
  return new Promise((resolve, reject) => {
    print.tip(`开始获取 ${name} 代码的贡献者数据...`)
    load.start()
   utils.enOrder('git shortlog --numbered', true, true).then((data) => {
      console.log(data.tostring())
      resolve(data)
    })
    load.succeed()
  })
}

/**
 * todo 校验分支是否切换成功
 * @param {*} name 项目名称
 * @param {*} branch git 分支
 * @returns 
 */
exports.checkoutTest = (name, branch) => {
  return new Promise((resolve, reject) => {
    print.tip(`分支检测中...`)
    load.start()
    print.order(shell.gitBranch())
    utils
      .enOrderByPath(config.runPath(isProject, name), shell.gitBranch(), false, true)
      .then((info) => {
        const res = info[0].split('\n')
        const targetArr = res.filter(e => e.includes('*'))
        const target = (targetArr[0].split('* '))[targetArr.length]
        if (branch === target) {
          print.tip(`检测通过！目标分支${branch}，当前分支${target}`)
          load.start()
          resolve(true)
        } else {
          load.start()
          reject(`检测失败！目标分支${branch}，当前分支${target}。请查看【git checkout dev】命令的【输出/日志】，进行错误排查。`)
        }

      }, errorOn(reject))
  })
}

/**
 * todo 开始 yarn
 * @param {string} name 项目名称
 * @returns 
 */
exports.yarnCode = name => {
  return new Promise((resolve, reject) => {
    print.tip('开始安装依赖包（若是首次安装，需要等待几分钟）...')
    print.note('如果2分钟没反应，请按一下 "空格" 键，检查工具是否卡死。')
    print.order(shell.yarn())
    load.start()
    utils
      .enOrderByPath(config.runPath(isProject, name), shell.yarn(), true)
      .then(successOn(resolve), errorOn(reject))
  })
}

exports.cpFile = name => {
  const moveFile = {
    fromPath: 'public/popper.js',
    toPath: 'node_modules/element-ui/lib/utils/popper.js'
  }
  print.tip('开始移动 public/popper.js 文件到 node_modules 模块')
  copyFile(`${config.runPath(isProject, name)}/${moveFile.fromPath}`, `${config.runPath(isProject, name)}/${moveFile.toPath}`)
  print.tip(`移动完毕!`)
}

/**
 * todo 开始 build
 * @param {string} name 项目名称
 * @param {string} buildOrder build命令
 * @returns 
 */
exports.buildCode = (name, buildOrder) => {
  return new Promise((resolve, reject) => {
    print.tip('开始编译...')
    print.note('如果2分钟没反应，请按一下 "空格" 键，检查工具是否卡死。')
    print.order(shell.build(buildOrder))
    load.start()
    utils
      .enOrderByPath(
        config.runPath(isProject, name),
        shell.build(buildOrder),
        true
      )
      .then(successOn(resolve), errorOn(reject))
  })
}

/**
 * todo 检测是否含有某个文件夹
 * @param {string} projectName 项目名称
 * @param {string} fileName 文件名称
 * @returns 
 */
const hasFolder = (projectName, fileName) => {
  let hasDist = false
  try {
    // 当前使用是如果拥有dist文件就算编译完成
    hasDist = fs
      .statSync(`${config.runPath(isProject, projectName)}/${fileName}`)
      .isDirectory()
  } catch (error) {
    hasDist = false
  }
  return hasDist ? true : false
}
exports.hasFolder = hasFolder

/**
 * todo 安装依赖是否成功
 * @param {string} name 项目名称
 * @param {function} successCallBack 成功回调
 * @param {function} failureCallBack 失败回调
 * @returns 
 */
exports.yarnEndTest = (name, successCallBack = undefined, failureCallBack = undefined) => {
  return new Promise((resolve, reject) => {
    // 编译需要检测的是 dist 文件夹
    const hasFile = hasFolder(name, 'node_modules')
    if (hasFile) {
      successCallBack && successCallBack()
      resolve(true)
    } else {
      failureCallBack && failureCallBack()
      reject('依赖安装失败，请进行错误排查！')
    }
  })
}

/**
 * todo 检测编译是否成功
 * @param {string} name 项目名称
 * @param {function} successCallBack 成功回调
 * @param {function} failureCallBack 失败回调
 * @returns 
 */
exports.buildEndTest = (name, successCallBack = undefined, failureCallBack = undefined) => {
  return new Promise((resolve, reject) => {
    // 编译需要检测的是 dist 文件夹
    const hasFile = hasFolder(name, 'dist')
    if (hasFile) {
      successCallBack && successCallBack()
      resolve(true)
    } else {
      failureCallBack && failureCallBack()
      reject('编译失败，请进行错误排查（包括依赖安装是否完整）！')
    }
  })
}

/**
 * todo 编译成功之后开始部署文件到指定目录
 * @param {string} name 项目名称
 * @param {string} toPath  指定安装路径
 * @param {string} deployName 目标目录名称（无则新增）
 * @returns 
 */
exports.cpCode = (name, toPath, deployName) => {
  return new Promise((resolve, reject) => {
    print.tip('准备部署，源路径：')
    print.order(config.runPath(isProject, name) + '/dist')
    print.tip('目标路径：')
    print.order(toPath + '/dist')

    print.tip('开始清除旧文件并转移文件...')
    load.start()
    utils.deleteFolderSync(`${toPath}/${deployName}`)
    // 无则创建这个文件
    try {
      fs.statSync(`${toPath}/${deployName}`).isDirectory()
    } catch (error) {
      fs.mkdirSync(`${toPath}/${deployName}`)
    }
    load.succeed()

    new Promise((res, rej) => {
      try {
        setData.setDir(
          `${config.runPath(isProject, name)}/dist`,
          `${toPath}/${deployName}`
        )
        res(true)
      } catch (error) {
        rej(error)
      }
    })
      .then(data => {
        print.tip('文件转移完毕！')
        setTimeout(() => {
          resolve(data)
        })
      })
      .catch(err => {
        reject(err)
      })
  })
}
