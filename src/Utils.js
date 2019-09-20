
let Utils = {
    
    // 字节数转换为MB
    byte2Mb(byte) {
        let mb = byte / (1024 * 1024);
        return mb;
    },

    // 字节数转换为按MB表示的字符串，保留小数点后4位
    byte2MbStr(byte) {
        let str = this.byte2Mb(byte).toFixed(4);
        return str;
    },

    // 字节数转换为KB
    byte2Kb(byte) {
        let kb = byte / 1024;
        return kb;
    },

    // 字节数转换为按KB表示的字符串，保留小数点后2位
    byte2KbStr(byte) {
        let str = this.byte2Kb(byte).toFixed(2);
        return str;
    },

};

module.exports = Utils;