const fs = require('fs')
const path = require('path')
const config = require('../config')

/**
 * @param { date } time 需要转换的时间
 * @param { String } fmt 需要转换的格式 如 yyyy-MM-dd、yyyy-MM-dd HH:mm:ss
 */
const formatTime = (time, fmt) => {
  if (!time) return ''
  else {
    const date = new Date(time)
    const o = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'H+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds(),
      'q+': Math.floor((date.getMonth() + 3) / 3),
      S: date.getMilliseconds()
    }
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        (date.getFullYear() + '').substr(4 - RegExp.$1.length)
      )
    for (const k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length === 1
            ? o[k]
            : ('00' + o[k]).substr(('' + o[k]).length)
        )
      }
    }
    return fmt
  }
}
/**
 * todo log 写入（当天数据创建为一个 log 文件）
 * @param { order }  String 执行的命令
 * @param { overErr } Boolean 报错继续执行
 */
const setLog = (info, noTime = false) => {
  const date = new Date()
  // log 文件名称
  const logName = `${formatTime(date, 'yyyy-MM-dd')}-${process.env.equipment}-log`
  // log 字段日期
  const itemTime = noTime ? '' : `${formatTime(date, 'yyyy-MM-dd HH:mm:ss')}`

  try {
    fs.statSync(config.logPath()).isDirectory()
  } catch (error) {
    fs.mkdirSync(config.logPath())
  }

  fs.writeFileSync(
    `${config.logPath()}\\${logName}.log.txt`,
    '\r\n' + itemTime + ' ' + info,
    { flag: 'as+' },
    err => {
      if (err) {
        console.log(err)
        return
      }
    }
  )
}

const copyFile = (from, to) => {
  try {
    const data = fs.readFileSync(from)
    fs.writeFileSync(to, data.toString())
  } catch (err) {
    console.log(err)
    throw err
  }
}

// todo 将文件移到指定目录
const setDir = (from, to) => {
  const fromPath = path.resolve(from)
  const toPath = path.resolve(to)
  fs.access(toPath, function (err) {
    if (err) {
      fs.mkdirSync(toPath)
    }
  })
  fs.readdir(fromPath, function (err, paths) {
    if (err) {
      console.log(err)
      return
    }
    paths.forEach(function (item) {
      const newFromPath = fromPath + '/' + item
      const newToPath = path.resolve(toPath + '/' + item)

      fs.stat(newFromPath, function (err, stat) {
        if (err) return
        if (stat.isFile()) {
          copyFile(newFromPath, newToPath)
        }
        if (stat.isDirectory()) {
          setDir(newFromPath, newToPath)
        }
      })
    })
  })
}

module.exports = { setDir, copyFile, setLog, formatTime }
