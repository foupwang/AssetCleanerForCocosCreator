# AssetCleanerForCocosCreator
**开源代码地址：**[https://github.com/foupwang/AssetCleanerForCocosCreator](https://github.com/foupwang/AssetCleanerForCocosCreator)
## 为什么需要AssetCleaner
- 随着产品功能增加、版本迭代、需求变更，CocosCreator工程里的资源越来越臃肿，其中有不少不再使用或未及时删除的资源（不仅仅是图片，还包括序列帧动画、Spine动画、Prefab等等），如何知道哪些资源是可以删除的？一个个手动查找是不能忍受的。
- 产品上线前，优化包体大小是不可避免的问题，包体里究竟有什么资源？哪些资源最占空间？它们的分布比例怎样？
**`AssetCleaner`为解决以上CocosCreator资源问题而生**
## AssetCleaner功能
- 自动查找CocosCreator工程中未引用的资源，并把所有未引用资源信息输出到指定文件，方便自己核对无误后删除。

**支持以下文件类型**

  1）.png/.jpg/.webp（包括普通图片、图集、Spine、DragonBone、艺术数字）
  
  2）.prefab
  
  3）.anim

*下图为CocosCreator 2.1.2官方Demo查找结果*
![](http://47.104.72.146/wp-content/uploads/2019/09/clean.png)

- 统计指定目录下所有文件信息，并按类型区分从大到小输出到指定文件，方便后续分析做重点优化。

*下图为CocosCreator 2.1.2官方Demo原始资源统计结果*
![](http://47.104.72.146/wp-content/uploads/2019/09/size1.png)

*下图为CocosCreator 2.1.2官方Demo构建后资源统计结果*
![](http://47.104.72.146/wp-content/uploads/2019/09/size2.png)
## AssetCleaner使用：
`AssetCleaner`基于`Node.js`开发，所以需要先安装`Node.js`，我的测试环境是：`Node.js 10.14.2 + Win10 + CocosCreator 2.1.2`。

目前支持以下两种命令
```
node main.js -clean 工程资源目录 结果输出文件  	// 查找未引用资源
node main.js -size 工程资源目录 结果输出文件	// 按类型统计目录下所有文件从大到小排序
```
例如，CocosCreator工程路径是`d:/myproject`。

1）查找未引用资源，则进入脚本代码目录，命令行输入：
```
node main.js -clean d:/myproject/assets d:/out.txt
```
查找结果将会输出到`d:/out.txt`文件。

2）按类型统计assets目录下所有原始资源，命令行输入：
```
node main.js -size d:/myproject/assets d:/out.txt
```
查找结果输出到`d:/out.txt`文件。

3）按类型统计构建后的build/web-mobile目录下所有文件，命令行输入：
```
node main.js -size d:/myproject/build/web-mobile d:/out.txt
```
查找结果输出到`d:/out.txt`文件。

## QA
#### 1、AssetCleaner会自动清除文件吗？
不会。AssetCleaner只是分析并把统计结果输出到文件，实际删除需自己手动操作。
#### 2、AssetCleaner为什么不做成Creator插件？
命令行可以更好的结合自动化构建流程，便于拓展。
#### 3、AssetCleaner的局限
查找未引用资源功能，目前只对assets目录下的静态资源有效，计划在后面加入resources（动态资源）、js代码的支持。
