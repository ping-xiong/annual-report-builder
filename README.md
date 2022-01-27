# 年度报告生成器

## 背景
现在大多数的APP每年都会有年度报告了，唯独在针对群聊或者单聊方面有所欠缺。于是，就打算开发一款基于聊天记录的年度报告生成器，支持多种模板。  
针对目前主流的聊天软件：QQ和微信。
  
## 导出成品预览  
网页版：[默认模板](http://report.pingx.tech/cmx/)   
长图版与文字版自行下载体验  
更多模板陆续添加中...  

## 特点
1. 界面化操作，简单安装客户端即可
2. 支持年度，月度，自定义时间范围的报告
3. 自由添加或者修改导出模板
4. 支持群聊，私聊报告
5. 分词设置，词云设置，排除号码设置等
6. 对历史生成的年度报告列表管理
7. 本地运行，杜绝隐私泄露
8. 多种导出选择，可选择导出为网页可以自行部署到服务器，导出为长图方便分享，导出为纯文本更简约，导出为视频正在开发
9. 基于Electron，可多平台构建

## 快速入门
1. 下载Release里面的.exe，安装并运行本软件 （目前只支持64位系统）
2. 选择QQ或者微信报告功能
3. 选择导出的txt格式聊天记录
4. 点击生成按钮
5. 选择类型，并导出即可

## 注意
软件安装路径不能有中文！！！否则会闪退！

## 导出聊天记录方法和其他常见问题
安装软件后，查看软件帮助。

## 交流群
搜Q群：142815653  
![image](https://raw.githubusercontent.com/ping-xiong/annual-report-builder/main/%E9%A2%84%E8%A7%88%E5%9B%BE/qq.png)

## 自行构建
1. 把代码下载到本地
2. 原生模块编译  
该项目使用了 [NodeJieba](https://github.com/yanyiwu/nodejieba) 模块，需要配置原生模块编译环境。  
参考：[Node 原生模块](https://www.electronjs.org/zh/docs/latest/tutorial/using-native-node-modules)
3. 安装依赖
```
 npm install
```
3. 运行  

开发环境  
```
vue-cli-service electron:serve
```
发布
```
vue-cli-service electron:build
```

## 软件截图
![image](https://raw.githubusercontent.com/ping-xiong/annual-report-builder/main/%E9%A2%84%E8%A7%88%E5%9B%BE/1.png)  
![image](https://raw.githubusercontent.com/ping-xiong/annual-report-builder/main/%E9%A2%84%E8%A7%88%E5%9B%BE/2.png)  
![image](https://raw.githubusercontent.com/ping-xiong/annual-report-builder/main/%E9%A2%84%E8%A7%88%E5%9B%BE/3.png)  
![image](https://raw.githubusercontent.com/ping-xiong/annual-report-builder/main/%E9%A2%84%E8%A7%88%E5%9B%BE/4.png)  
![image](https://raw.githubusercontent.com/ping-xiong/annual-report-builder/main/%E9%A2%84%E8%A7%88%E5%9B%BE/5.png)  

## 博客
[PingX](http://pingxonline.com/)