/*
* Usage:
* node main.js -clean d:\myproject\assets d:\out.txt
* node main.js -size d:\myproject\assets d:\out.txt
* node main.js -mem d:\myproject\assets d:\out.txt
*/
const AssetCleaner = require('./AssetCleaner');
const AssetSize = require('./AssetSize');

let command = process.argv[2];
let sourceFile = process.argv[3];
let destFile = process.argv[4];
global._delete = process.argv.includes('-d') || process.argv.includes('-delete') // 删除未引用的资源
global._excludes = process.argv.filter(n => n.includes('-e=') || n.includes('-excludes=')).map(node => { // 删除未引用的资源时，需要排除的文件或路径，支持字符串或正则
    let _i = node.replace('-e=', '')
    if (_i !== node) return _i
    _i = node.replace('-excludes=', '')
    if (_i !== node) return _i
    return ''
})[0]

let Version = 'AssetCleaner 1.1';
let parseCommand = function(cmd) {
    if (!cmd || cmd.length <= 0) {
        console.error('main: command is invalid');
        return;
    }

    switch (cmd) {
        case '-clean':
            AssetCleaner.start(sourceFile, destFile);
            break;
        case '-size':
            AssetSize.start(sourceFile, destFile);
            break;
        default:
            let strHelp = Version + '\n' + 
                        'Usage: node main.js <command>\n'+
                        'Examples:\n' +
                        '  node main.js -clean d:/myproject/assets d:/out.txt\n' +
                        '  node main.js -size d:/myproject/assets d:/out.txt';
            console.log(strHelp);
            break;
    }

};

parseCommand(command);
