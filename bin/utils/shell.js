/*
 * @Author: your name
 * @Date: 2021-10-26 20:18:18
 * @LastEditTime: 2021-10-27 17:11:46
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \pc-build-cli\bin\utils\shell.js
 */
// todo 查看所有文件
const ls = () => 'Dir'

// ! 删除对应文件夹与内容(window 平台命令有不同) —— 暂时无法通过 shell 执行
// file 表示目标文件，多个文件用逗号隔开
const deleteDir = (path, file) => `rm ${path} -include${file} -Force -Recurse `

// ! 清空文件夹 —— 暂时无法通过 shell 执行
const cleatDir = path => ` Get-ChildItem "${path}" | Remove-Item -Recurse `

// ! 复制文件从 fromPath 到 toPath  —— 暂时无法通过 shell 执行
const cpFile = (fromPath, toPath) => `Copy-Item -Path "${fromPath}" -Destination "${toPath}" -Recurse -Force`

// todo 存储修改代码
const gitStash = (name) => `git stash save ${name}`

// todo 清除存储代码
const gitClearStash = () => `git stash clear`

// todo 获取 git 代码
const gitClone = (branch, gitPath) => `git clone -b ${branch} ${gitPath}`

// todo 更新最新代码
const gitPull = () => `git pull`

// todo 切换分支
const gitCheckout = branch => `git checkout ${branch}`

// todo 针对分支操作
const gitBranch = (command = null) => command ? `git branch ${command}` : 'git branch'

// todo 安装依赖包
const yarn = () => 'yarn'

// todo 编译
const build = order => `yarn ${order}`

// 获取维护者信息
const shortLog = () => `git shortlog --numbered`

const shell = {
  ls,
  deleteDir,
  cleatDir,
  gitStash,
  gitClearStash,
  gitClone,
  gitCheckout,
  gitBranch,
  gitPull,
  yarn,
  build,
  cpFile,
  shortLog
}

module.exports = shell
