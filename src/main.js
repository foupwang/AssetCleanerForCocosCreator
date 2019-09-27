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
