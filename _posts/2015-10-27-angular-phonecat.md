---
layout: post
title: 通过angularJS官方案例快速入门
tags:  [angularJS,javascript,angular-phonecat]
categories: [angularJS]
author: Yingside
excerpt: "angularJS官方提供了一个官方案例给大家进行循序渐进的学习,但是如果之前没有接触过node.js以及git的同学这个案例拿着也无从下手...这里就介绍一下怎么打开这个案例吧"
---
# 官方案例-angular-phonecat
angularJS官方提供了一个官方案例给大家进行循序渐进的学习,但是如果之前没有接触过node.js以及git的同学这个案例拿着也无从下手...这里就介绍一下怎么打开这个案例吧
**准备工作:**
1.Git
2.nodejs
3.npm
4.bower
5.http-server

如果需要成功的一步一步的学习这个案例至少需要安装上面的5个东西，当然2-5都是nodejs以及他的附属品

## 1.安装Git
git这个东西不用多说，稍微有点公司开发经验的应该都用过，如果没用过也不用紧张，可以查看我的[Git简单教程](http://blog.csdn.net/ying422/article/details/45114217)...几乎是傻瓜式的教程，没有什么命令行的操作，完全是使用Github自己新出的工具直接进行Git操作。当然我们这里安装Git主要是为了看angular-phonecat,所以大家不懂Git只需要知道Git是什么就行了，不需要纠结,**我们需要做的最重要的第一步是通过Git clone angular-phonecat,注意angular-phonecat最好从github上clone，不然是创建不了git 分支的，也就不能一步一步的学习这个项目了**

a.首先进入[angular-phonecat](https://github.com/angular/angular-phonecat)
b.点击右上角的Fork(当然之前你必须还要先有自己的github账户并登录才行)
![](/assets/images/2015-10-27-angular-phonecat-3.png)
c.打开本机已经安装的Git工具,登录你的账号,就能找到你刚刚Fork的程序
![](/assets/images/2015-10-27-angular-phonecat-2.png)
d.最后将这个程序Clone到你的电脑上就行
![](/assets/images/2015-10-27-angular-phonecat-1.png)

## 2.安装nodejs
nodejs这里说也说不完，直接到nodejs[官方网站](https://nodejs.org/en/)下载nodejs安装就ok
现在安装好nodejs之后，会自动安装nodejs包管理器npm,以后在nodejs平台安装东西都需要npm.

### 首先通过npm安装bower:
bower现在这里大家也不需要纠结到底是什么，其实无非就是随着前端工程越来越多，引入的js，jquery，jquery插件，css，less，sass等越来越多，需要简单化地管理这些引入文件就是bower的作用，类似于java的maven，所以这里使用bower就是下载angular-phonecat程序所需要的引入文件

**a.安装bower**

```
npm install bower -g
```

注意这里加上-g表示要将bower安装在本机的全局环境中，在本机调用起来很方便。如果程序需要经常移植，也可以直接将bower安装在局部环境中，在相应的文件夹下执行npm install bower就行了

安装好之后，就需要通过bower下载相应的文件了，这里又涉及到bower的相关使用，不是太清楚的，[这篇文章可以为你解惑--------bower解决js的依赖管理](http://blog.fens.me/nodejs-bower-intro//),如果不想花精力现在看的话也无所谓，按照下面的步骤执行就ok

**进入angular-phonecat文件夹所在路径，按照图片代码执行就行了，唯一注意的一点是bower很多安装文件都依赖于git，如果机器上没有安装git的话，会报出下面的错误：**

![](/assets/images/2015-10-27-angular-phonecat-5.png)

如果安装了github提供的window版本的git shell，需要将git shell打开，在里面执行bower相关代码(注意我这里图片上由于是演示已经执行过一次bower命令,已经保存了安装缓存速度较快)：

![](/assets/images/2015-10-27-angular-phonecat-4.png)


**b.安装http-server**

```
npm install http-server -g
```

http-server是一个简单的前台应用服务器，使用相当简单，进入`http-server安装目录`，(注意window系统是npm全局-g安装在C:\Users\yourComputerName\AppData\Roaming\npm\node_modules\http-server)输入命令

```
node bin/http-server
```
我们就能启动一个应用服务，在浏览器地址栏输入:127.0.0.1:8080,就能看到欢迎界面

但是这并不能干任何事情，因为我们的工程还没有挂载到应用服务器上。
因此如果我们的工程放在angular-phonecat文件夹中，通过下面的命令，**将angular-phonecat文件夹所在路径指定为工程路径**

```
http-server G:\angular-phonecat
```

上面的代码就是指定文件夹为应用服务器默认访问路径,现在在浏览器输入：`http://127.0.0.1:8080/app`就能直接访问到最终用angualrjs写出的页面了。

但是这并不是我们一步一步的通过这个代码去学习的目的，angular-phonecat已经通过git帮我们把代码分成了12个步骤去学习，如果想进入第一步，需要执行git代码

```
git checkout -f step-0
```

以后要学习没一步，改变step-*后面的数字就好，当然这里只是教大家怎么样去打开这个教程，如果想要一步一步的学习，可以[看这里](http://www.ituring.com.cn/minibook/303)