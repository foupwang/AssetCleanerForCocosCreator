# AssetCleanerForCocosCreator
Asset cleaner for CocosCreator(CocosCreator资源优化大师)

## 缘起-为什么需要AssetCleaner
- 随着产品功能增加、版本迭代、需求变更，Creator工程里的资源越来越臃肿，其中有不少不再使用或未及时删除的资源（不仅仅是图片，还包括序列帧动画、Spine动画、Prefab等等），如何知道哪些资源是可以删除的？一个一个手动去查找吗？
- 产品上线前，优化包体大小是不可避免的问题，包体里究竟有什么资源？哪些资源最占空间？它们的分布比例是怎样的？

## AssetCleaner功能
- 自动查找CocosCreator工程中未引用的资源，并把所有未引用资源信息输出到指定文件，方便自己核对无误后删除。
支持查找以下类型：
 - .png/.jpg/.webp（包括普通图片、图集、Spine、DragonBone、艺术数字）
 - .prefab
 - .anim
- 统计指定目录下所有文件信息，并按类型区分输出到指定文件，方便后续分析做重点优化

## AssetCleaner使用示例：
AssetCleaner基于Node.js开发，所以需要先安装Node.js，我的测试环境是：Node.js 10.14.2 + Win10 + CocosCreator 2.1.2。
目前支持以下两种命令
```
node main.js -clean 工程资源目录 结果输出文件  	// 查找未引用资源
node main.js -size 工程资源目录 结果输出文件	// 按类型统计目录下所有文件从大到小排序
```
例如，Creator工程路径是`d:\myproject`。
1）要查找未引用资源，则在脚本目录的命令行输入：
```
node main.js -clean d:\myproject\assets d:\out.txt
```
查找结果将会输出到`d:\out.txt`文件。
2）按类型统计assets目录下所有文件，则输入：
```
node main.js -size d:\myproject\assets d:\out.txt
```
查找结果输出到`d:\out.txt`文件。

## QA
1、AssetCleaner会自动清除文件吗？
不会，AssetCleaner只是分析并把统计结果输出到文件，实际删除需自己人工操作。
2、AssetCleaner为什么不做成Creator插件？
原因：1）命令行可以更好的结合自动化流程；2）我喜欢Node.js的简洁轻快；

备注：
1、关于Node.js的简易教程可参考我的博客：
2、欢迎关注我的微信公众号，搜索“楚游香”即可，有问题留言；
