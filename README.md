# ResCleanerForCocosCreator
Resource cleaner for CocosCreator(CocosCreator工程资源优化大师)

## 功能
自动查找CocosCreator工程中未引用的资源，并把所有未引用资源信息输出到指定文件，方便自己核对无误后删除。
支持查找以下类型：
- .png/.jpg（包括普通图片、图集、Spine文件、艺术数字）
- .prefab
- .anim

## 用法：
需要安装 node.js，我的测试环境是：node.js 10.14.2 + Win10 + CocosCreator 2.1.2。
命令格式：node main.js -clean工程资源目录 结果输出文件
例如，我的Creator工程路径是d:\myproject，则在本脚本目录的命令行输入：
node main.js -clean d:\myproject\assets d:\out.txt
查找结果将会输出到D盘的 out.txt 文件中。

