/*
 * @Author: your name
 * @Date: 2021-10-26 20:18:18
 * @LastEditTime: 2021-10-27 16:57:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \pc-build-cli\bin\utils\utils.js
 */
const fs = require('fs')
const path = require('path')
const { spawn } = require('child_process')
const print = require('./print')

const getVersion = (order) => {
  return new Promise((resovle, reject) => {
      childProcess.exec(`${order}`, { encoding: 'utf-8' }, (stdout, error, status, output) => {
          error ? reject(error) : resovle(stdout)
      });
  })
}

/**
 * todo 运行命令
 * @param { order } String 执行的命令
 * @param { overErr } Boolean 报错继续执行
 * @param { returnInfo } Boolean 结束是否返回数据数据内容
 */
const enOrder = (order, overErr = false, returnInfo = false) => {
  return new Promise((resolve, reject) => {
    if (!order) reject('命令不能为空！')
    try {
      console.log(order);
      const child = spawn(order, {
        shell: true
      })
      child.stdout.on('data', data => {
        print.info(data.toString())
      })
      child.stderr.on('data', data => {
        // 错误格式处理
        if (overErr) {
          print.red(data.toString())
        } else {
          reject(data.toString())
        }
      })
      child.on('close', data => {
        resolve(returnInfo ? data : true)
      })
      
    } catch (error) {
      console.log(error)
    }
  })
}

/**
 * todo 指定路径-运行命令
 * @param { path } String 要运行的目录
 * @param { order  } String 执行的命令
 * @param { overErr } Boolean 报错继续执行
 * @param { returnInfo } Boolean 结束是否返回数据数据内容
 */
const enOrderByPath = (path, order, overErr = false, returnInfo = false) => {
  return new Promise((resolve, reject) => {
    if (!order) reject('命令不能为空！')
    const res = []
    const child = spawn(order, {
      shell: true,
      cwd: path || './'
    })
    child.stdout.on('data', data => {
      res.push(data.toString())
      print.info(data.toString())
    })
    child.stderr.on('data', data => {
      // 错误格式处理
      if (overErr) {
        print.red(data.toString())
      } else {
        reject(data.toString())
      }
    })
    child.on('close', data => {
      resolve(returnInfo ? res : true)
    })
  })
}

// todo 同步删除目标路径下的所有文件和文件夹
const deleteFolderSync = path => {
  var files = []
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path)
    files.forEach((file, index) => {
      var curPath = path + '/' + file
      if (fs.statSync(curPath).isDirectory()) {
        deleteFolderSync(curPath)
      } else {
        fs.unlinkSync(curPath)
      }
    })
    fs.rmdirSync(path)
  }
}

const utils = {
  enOrder,
  enOrderByPath,
  deleteFolderSync,
  getVersion
}

module.exports = utils
