const fs = require('fs');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin
});

let oldfilename = '';

console.log('输入被复制的模块名');
rl.on('line', (cmd) => {
  fs.readdir(cmd, (err) => {//检测模块是否存在
    if(err) {
      console.log('模块名不存在');
      return;
    } else {
      oldfilename = cmd;
      console.log('输入新的模块名,输入quit退出');
      rl.close();
      const _rl = readline.createInterface({
        input: process.stdin
      });
      _rl.on('line', (cmd) => {
        if (cmd === 'quit') {
          _rl.close();
          return;
        }
        let newfilename = cmd;
        mkDir(oldfilename, newfilename);
      })
    }
  })
});

let mkDir = (oldfilename, newfilename) => { //oldfilename: 被复制的文件名,newfilename: 复制的文件名
  let ext = ['component', 'module', 'routing', 'service', ''];
  fs.mkdir(newfilename, (err) => {
    if(err) {
      console.log(err);
      return;
    } else {
      fs.mkdir(newfilename + '/views', (err) => {
        if(err) {
          console.log(err);
        } else {
          console.log('createDir');
          copyViews(oldfilename, newfilename, 'html');
          copyViews(oldfilename, newfilename, 'css');
          for (let i in ext) {
            copyTs(oldfilename, newfilename, ext[i]);
          };
        }
      })
    }
  })
};

let copyViews = (oldfilename, newfilename, ext) => {//复制html, css文件
  fs.readFile('./' + oldfilename + '/views/' + oldfilename + '.' + ext, 'utf-8', (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    fs.writeFile('./' + newfilename + '/views/' + newfilename + '.' + ext, data, 'utf-8', (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log('create file ' + newfilename + 'success!');
      }
    });
  })
};

let copyTs = (oldfilename, newfilename, ext) => {//复制TS文件
  let url = '';
  let fileUrl = '';
  if (ext == '') {
    url = './' + oldfilename + '/' + oldfilename + '.ts';
    fileUrl = './' + newfilename + '/' + newfilename + '.ts';
  } else {
    url = './' + oldfilename + '/' + oldfilename + '.' + ext + '.ts';
    fileUrl = './' + newfilename + '/' + newfilename + '.' + ext + '.ts';
  }
  fs.readFile(url, 'utf-8', (err, data) => {
    let replaceDate = replace(oldfilename, newfilename, data);
    fs.mkdir(newfilename, (err) => {
      fs.writeFile(fileUrl, replaceDate, 'utf-8', (err) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log('create ' + newfilename + '.' + ext + '.ts success')
      });
    })
  })
};


let replace = (oldfilename, newfilename ,data) => {
  let upoldfilename = toUP(oldfilename);
  let upnewfilename = toUP(newfilename);
  let down = data.replace(oldfilename, newfilename);
  return down.replace(upoldfilename, upnewfilename);
}

let toUP = (filename) => {
  let up = filename.split('')[0].toUpperCase();
  let file = filename.split('');
  file[0] = up;
  return file.join('');
}