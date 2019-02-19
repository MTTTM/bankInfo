var fs = require('fs');
var path = require('path');
var keyObj = require("./index.js")
console.log("key", keyObj)

let join = require('path').join;
 let result = [];
/**
  移动文件和修正文件名
*/
function reName(fPath, stats) {
    if (stats.isFile()) {
        // result.push(fPath.replace(/icon\\/, ""));
        let name = fPath.replace(/icon\\/, "")
        //如果是非中文名字，改名
        // console.log("===",name,name.replace(/\.png/,""))
        if (keyObj[name.replace(/\.png/, "")]) {
            result.push(fPath.replace(/icon\\/, ""));
            //修改文件名（如路径相同文件不同）
            fs.rename('./icon/' + name, './newIcon/' + name, function(err) {
                if (err) {
                    console.log("error", err)
                    throw err;
                }
            })
        } else {
            for (let k in keyObj) {
                if (keyObj[k] == name.replace(/\.png/, "")) {
                    result.push(k + ".png");
                    fs.rename('./icon/' + name, './newIcon/' + k + ".png", function(err) {
                        if (err) {
                            throw err;
                        }
                    })
                    break;
                }
            }
        }

    }
}
/**
  result  数组
*/
function WritheFile(result) {
    let arr=result;
    let str="";
    arr.forEach(item=>{
      let code=item.replace(/\.png/g,"");
       str+=`
            .cm-bank-logo-${code}{
               background:url("./newIcon/${item}")
            }
       `;
    });
    fs.writeFile('./icons.css', str, { 'flag': 'a' }, function(err) {
        if (err) {
            throw err;
        }
    });
}
/**
 * 
 * @param startPath  起始目录文件夹路径
 * @returns {Array}
 */
function findSync(startPath) {
   
    function finder(path) {
        let files = fs.readdirSync(path);
        files.forEach((val, index) => {
            let fPath = join(path, val);
            let stats = fs.statSync(fPath);
            reName(fPath, stats);
        });

    }
    finder(startPath);
    WritheFile(result);
    return result;
}
let fileNames = findSync('./icon');
console.log("fileNames", fileNames)