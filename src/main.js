/*
* Usage:
* node main.js -clean d:\myproject\assets d:\out.txt
* node main.js -size d:\myproject\assets d:\out.txt
* node main.js -mem d:\myproject\assets d:\out.txt
*/
const AssetCleaner = require('./AssetCleaner');
const AssetSize = require('./AssetSize');

let option = process.argv[2];
let sourceFile = process.argv[3];
let destFile = process.argv[4];

let parseOptions = function(type) {
    if (!type || type.length <= 0) {
        console.error('main: type is invalid');
        return;
    }

    switch (type) {
        case '-clean':
            AssetCleaner.start(sourceFile, destFile);
            break;
        case '-size':
            AssetSize.start(sourceFile, destFile);
            break;
        default:
            console.log('main: invalid options');
            break;
    }

};

parseOptions(option);
