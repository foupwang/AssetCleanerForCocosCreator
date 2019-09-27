const fs = require('fs');
const path = require('path');
const FileHelper = require('./FileHelper');
const Utils = require('./Utils');

let ResType = {
    Image: 0, // 普通图片
    ImageAtlas: 1, // 大图
    LabelAtlas: 2, // 艺术数字
    Anim: 3, // 动画文件
    Spine: 4, // Spine
    Prefab: 5, // prefab
    Fire: 6, // 场景文件
    Code: 7, // js代码 
};

let ResExt = [
    { name:'.plist', type:ResType.ImageAtlas },
    { name:'.labelatlas', type:ResType.LabelAtlas },
    { name:'.json', type:ResType.Spine }, // spine和dragonBones的扩展名、查找流程一样
];

let AssetCleaner = {
    sourceMap: null,
    destMap: null,
    handleMap: null,

    start(sourceFile, destFile) {
        if (!sourceFile || sourceFile.length <= 0 || !destFile || destFile.length <= 0) {
            console.error('Cleaner: invalid source or dest');
            return;
        }

        this.sourceMap = new Map();
        this.destMap = new Map();
        this.handleMap = new Map();

        sourceFile = FileHelper.getFullPath(sourceFile);
        destFile = FileHelper.getFullPath(destFile);

        this.lookupAssetDir(sourceFile);
        let { noBindMap, noLoadMap } = this.compareAssets();
        let outStr1 = '未引用文件数量=';
        outStr1 = this.getSortedResult(outStr1, noBindMap, sourceFile);
        let outStr2 = '非动态调用(无需放在resources下)文件数量=';
        outStr2 = this.getSortedResult(outStr2, noLoadMap, sourceFile);
        let outStr = outStr1 + '\n' + outStr2;
        FileHelper.writeFile(destFile, outStr);
    },

    getSortedResult(outStr, outMap, srcDir) {
        let totalCount = 0;
        let totalSize = 0;
        let content = '';

        for (let [type, files] of outMap.entries()) {
            if (files.length <= 0) {
                continue;
            }
    
            // 按从大到小排列
            files.sort(function(a, b) {
                return b.size - a.size;
            });
    
            for (let i = 0, len = files.length; i < len; i++) {
                let file = files[i];
                content += '空间=' + Utils.byte2KbStr(file.size) + 'KB, 文件=' + file.path + '\n';
                totalSize += file.size;
            }

            totalCount += files.length;
            content += '\n';
        }
        
        outStr += totalCount;
        outStr += ', 占用空间=' + Utils.byte2MbStr(totalSize) + 'MB, 目录=' + srcDir + '\n\n';
        outStr += content;

        return outStr;
    },

    // UUID和文件逐个比较，返回结果汇总
    compareAssets() {
        let noBindMap = new Map();
        let noLoadMap = new Map();
        
        // 如果源UUID在所有目标资源都未找到，则说明源UUID对应的文件未被引用
        for (let [srcPath, srcData] of this.sourceMap.entries()) {
            let isBind = false;
            let isCodeLoad = false;
            let bDynamic = (srcPath.indexOf('\\resources\\') >= 0);
            
            isBind = this.findAssetByUUID(srcPath, srcData);
            if (bDynamic) {
                isCodeLoad = this.findAssetByName(srcPath, srcData);
            }

            if (!isBind && !isCodeLoad) {
                let files = noBindMap.get(srcData.type);
                if (!files) {
                    files = [];
                    noBindMap.set(srcData.type, files);
                }
                files.push({ path:srcPath, size:srcData.size });
            } else if (bDynamic && isBind && !isCodeLoad) {
                let files = noLoadMap.get(srcData.type);
                if (!files) {
                    files = [];
                    noLoadMap.set(srcData.type, files);
                }
                files.push({ path:srcPath, size:srcData.size });
            }
        }

        return { noBindMap, noLoadMap };
    },

    // 根据源UUID在目标资源中查找
    findAssetByUUID(srcPath, srcData) {
        let bFound = false;
        if (!srcPath || !srcData) {
            return bFound;
        }
        for (let [destPath, destData] of this.destMap.entries()) {
            if (srcPath == destPath || ResType.Code === destData.type) {
                continue;
            }
            if (!!srcData && !!srcData.uuid) {  
                for (let i = 0, len = srcData.uuid.length; i < len; i++) {
                    let uuid = srcData.uuid[i];
                    if (destData.data.indexOf(uuid) >= 0) {
                        bFound = true;
                        return bFound; // 源UUID数组只要有一个被引用，即代表源文件被引用了，无需继续查找
                    }
                }
            }
        }
        return bFound;
    },

    // 根据源文件名在目标资源中查找
    // 主要是搜索代码中动态调用的.prefab、.anim
    findAssetByName(srcPath, srcData) {
        let bFound = false;
        if (!srcPath || !srcData) {
            return bFound;
        }
        for (let [destPath, destData] of this.destMap.entries()) {
            // 目标资源必须是代码文件
            if (srcPath == destPath || ResType.Code !== destData.type) { 
                continue;
            }
            if (!!srcData && !!srcData.name && srcData.name.length > 0) {
                if (destData.data.indexOf(srcData.name) >= 0) {
                    bFound = true;
                    break;
                }
            }
        }
        return bFound;
    },

    // 递归查找指定目录下所有资源
    lookupAssetDir(srcDir, callback) {
        if (!srcDir || !fs.existsSync(srcDir)) {    
            console.error("AssetCleaner: invalid srcDir=" + srcDir);
            return;
        }

        let files = fs.readdirSync(srcDir);
        for (let i = 0, len = files.length; i < len; i++) {
            let file = files[i];
            let curPath = path.join(srcDir, file);

            // 如果该文件已处理过则直接跳过
            if (this.handleMap.has(curPath)) {
                continue;
            }

            let stats = fs.statSync(curPath);
            if (stats.isDirectory()) {
                this.lookupAssetDir(curPath);
                continue;
            }

            let data = null;
            let uuid = [];
            let pathObj = path.parse(curPath);
            // 针对各类型文件做相应处理
            switch (pathObj.ext) {
                case '.js':
                case '.ts':
                    data = FileHelper.getFileString(curPath);
                    this.destMap.set(curPath, { data, type:ResType.Code });
                    break;

                case '.prefab':
                    uuid = this.getFileUUID(curPath, pathObj, ResType.Prefab);
                    data = { uuid, type:ResType.Prefab, size:stats.size, name:'' };
                    if (curPath.indexOf('\\resources\\') >= 0) {
                        data.name = pathObj.name; // resources下文件需按文件名在代码中查找
                    }
                    this.sourceMap.set(curPath, data);
                    
                    data = FileHelper.getFileString(curPath);
                    this.destMap.set(curPath, { data, type:ResType.Prefab });
                    break;

                case '.anim':
                    if (curPath.indexOf('\\resources\\') < 0) { // 暂时排除resources下.anim
                        uuid = this.getFileUUID(curPath, pathObj, ResType.Anim);
                        this.sourceMap.set(curPath, { uuid, type:ResType.Anim, size:stats.size });
                    }

                    data = FileHelper.getFileString(curPath);
                    this.destMap.set(curPath, { data, type:ResType.Anim });
                    break;

                case '.fire':
                    data = FileHelper.getFileString(curPath);
                    this.destMap.set(curPath, { data, type:ResType.Fire });
                    break;
                
                case '.png':
                case '.jpg':
                case '.webp':
                    if (curPath.indexOf('\\resources\\') >= 0) { // 暂时不处理resources下图片
                        break;
                    }
                    let type = this.getImageType(curPath, pathObj);
                    uuid = this.getFileUUID(curPath, pathObj, type);
                    this.sourceMap.set(curPath, { uuid, type:type, size:stats.size });
                    break;

                default:
                    break;
            }
        }
    },

    // 根据同一目录下该图片同名文件的不同扩展名来判断图片类型（.plist、.json、labelatlas）
    getImageType(srcPath, pathObj) {
        let type = ResType.Image;
        for (let i = 0, len = ResExt.length; i < len; i++) {
            let ext = ResExt[i];
            let testPath = path.join(pathObj.dir, pathObj.name) + ext.name;
            if (fs.existsSync(testPath)) {
                type = ext.type;
                this.handleMap.set(testPath, { handled:true });
                break;
            }
        }
        return type;
    },

    // 获取普通图片的UUID
    getUUIDFromMeta(metaPath, sourceName) {
        let uuid = [];
        let meta = FileHelper.getObjectFromFile(metaPath);
        if (!!meta && !!meta.subMetas) {
            let obj = meta.subMetas[sourceName];
            if (!!obj && !!obj.uuid) {
                let id = obj.uuid.substring(0);
                uuid.push(id);
            }
        }
        return uuid;
    },

    // 获取普通文件的UUID
    getRawUUIDFromMeta(metaPath) {
        let uuid = [];
        let meta = FileHelper.getObjectFromFile(metaPath);
        if (!!meta && !!meta.uuid) {
            let rawUUID = meta.uuid.substring(0);
            uuid.push(rawUUID);
        }
        return uuid;
    },

    // 从Plist中获取所有碎图的uuid
    getPlistUUIDFromMeta(metaPath) {
        let uuid = [];
        let meta = FileHelper.getObjectFromFile(metaPath);
        if (!!meta && !!meta.uuid) {
            let rawUUID = meta.uuid.substring(0);
            uuid.push(rawUUID); // 记录自身ID
        }
        if (!!meta && !!meta.subMetas) {
            for (let name in meta.subMetas) {
                let obj = meta.subMetas[name];
                if (obj && obj.uuid) {
                    let id = obj.uuid.substring(0);
                    uuid.push(id); // 记录碎图ID
                }
            }
        }
        return uuid;
    },

    // 返回不同类型文件的UUID
    getFileUUID(srcPath, pathObj, type) {
        let uuid = [];
        let destPath = '';
        switch(type) {
            case ResType.Image:
                destPath = srcPath + '.meta';
                uuid = this.getUUIDFromMeta(destPath, pathObj.name);
                break;
            case ResType.ImageAtlas:
                destPath = path.join(pathObj.dir, pathObj.name) + '.plist.meta';
                uuid = this.getPlistUUIDFromMeta(destPath);
                break;
            case ResType.LabelAtlas:
                destPath = path.join(pathObj.dir, pathObj.name) + '.labelatlas.meta';
                uuid = this.getRawUUIDFromMeta(destPath);
                break;
            case ResType.Anim:
                destPath = srcPath + '.meta';
                uuid = this.getRawUUIDFromMeta(destPath, pathObj.name);
                break;
            case ResType.Spine:
                destPath = path.join(pathObj.dir, pathObj.name) + '.json.meta';
                uuid = this.getRawUUIDFromMeta(destPath);
                break;
            case ResType.Prefab:
                destPath = srcPath + '.meta';
                uuid = this.getRawUUIDFromMeta(destPath);
                break;
            case ResType.Code:
                uuid.push(pathObj.name);
                break;
            default:
                break;
        }
        return uuid;
    },

};

module.exports = AssetCleaner;

