const fs = require('fs');

let fsUtil = {
    
    // 输出到文件
    writeFile(fullPath, content) {
        if (!fullPath || !content) {
            console.error('writeFile: invalid params');
            return;
        }

        fs.writeFile(fullPath, content, (err) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log(content);
            console.log('Success to write file: ' + fullPath);
        });
    },

    // 返回文件内容的json对象
    getObjectFromFile(fullPath) {
        let retObj = {};
        if (!fs.existsSync(fullPath)) {
            console.error('getObjectFromFile: NoExist path=' +fullPath);
            return retObj;
        }
        let str = this.getFileString(fullPath);
        if (!str) {
            console.error('getObjectFromFile: invalid file=' +fullPath);
            return retObj;   
        }
        retObj = JSON.parse(str);
        if (!retObj) {
            console.error('getObjectFromFile: invalid object=' +fullPath);
            return retObj;
        }
        return retObj;
    },

    // 返回文件内容的字符串形式
    getFileString(fullPath) {
        return fs.readFileSync(fullPath).toString();
    },

};

module.exports = fsUtil;
