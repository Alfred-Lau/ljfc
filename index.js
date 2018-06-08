var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
var readline = require('readline')
var fs = require('fs')

const nrm = spawn('nrm', ['ls']);
const rl = readline.createInterface({ input: nrm.stdout })
const CWD = process.cwd()

function getDirList(path) {
  return new Promise((resolve, reject) => {
    fs.readdir(path, function (err, files) {
      let dirListArr = []
      if (err) {
        return;
      }

      files.forEach(function (file) {
        const path = `${__dirname}/${file}`
        const stats = fs.statSync(path)

        if (stats.isDirectory()) {
          dirListArr.push({
            name: file,
            path,
          })
        }
      })
      if (!dirListArr.length) {
        reject()
      }
      resolve(dirListArr)
    })
  })
}

doRefresh = ({path,name}) => {
  console.info(`start to pull for ${name}`)
  exec(`cd ${path} && git pull`, (error, stdout, stderr) => {
    if (error) {
      console.log(error)
      return;
    }
    console.log(`${name}: ${stdout}`);
  });
}

rl.on('line', (line) => {
  if (line.includes('* taobao')) {
    console.info('淘宝源启用');
    getDirList(CWD).then((lists) => {
      lists.forEach((item) => {
        doRefresh(item)
      })
    })
    return true;
  }
  return false;
});

// 捕获标准输出并将其打印到控制台 
nrm.stdout.on('data', function (data) {

});

// 捕获标准错误输出并将其打印到控制台 
nrm.stderr.on('data', function (data) {
});

// 注册子进程关闭事件 
nrm.on('exit', function (code, signal) {
});