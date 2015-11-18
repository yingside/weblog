---
layout: post
title: Sublime Text使用配置介绍
tags:  [Sublime Text]
categories: [工具]
author: Yingside
excerpt: "Sublime Text是我一直在使用的文本编辑工具,小巧,快速以及丰富的插件完全可以媲美市面上大多数集成开发工具.这篇文章主要介绍如何将Sublime Text搭建为一个好用的IDE工具"

---

这篇文章很多内容都是来源自网络,发布这里当作自己留个底,以后不用到处去找

对于文本编辑器，我用过notepad2、notepad++、Editplus、UltraEdit、Vim、TextPad，都没有觉得哪一款编辑器用得非常上手，直到遇到Sublime Text,它不单能简单的编辑文本文件,在下载了相应插件后html,css,javascript,nodejs,python,php甚至于java和C#都能进行快速编写。今天就来讲一下如何将Sublime Text打造成一款好用的IDE，虽然它只是一款编辑器，但是它有丰富的扩展插件，足以让我们把它变成好用的IDE。

## 一.下载和安装

下载之前首先要说明的是先sublime text有两个版本 sublime text 2和sublime text 3,这两个版本在文件位置,安装插件等很多地方都不兼容,所以事先选择好你要下载的版本,反正我是两个都装了...

Sublime Text是一款开源的软件，不需要注册即可使用（虽然没有注册会有弹窗，但是基本不影响使用）.下载地址：[sublime text](http://www.sublimetext.com/)，请自行根据系统版本进行下载。下载好之后直接安装即可。



## 二.一些必备的插件

再次强调...2和3一些插件的版本并不兼容,或者说一些插件2支持,3并不支持,或者3支持,2并不支持

下面来介绍一些Sublime Text中必备的常用插件。

Sublime Text 安装的插件和所有预置的插件全部在Packages文件下，可以直接通过”preferences“—>”Browse Pakcages“来访问。

Sublime Text 2安装插件有两种方法：

### 简单的安装方法：

从菜单 View - Show Console 或者 ctrl + ~ 快捷键，调出 console。将以下 Python 代码粘贴进去并 enter 执行，不出意外即完成安装。以下提供 ST3 和 ST2 的安装代码：

**Sublime Text 3：**

```
import urllib.request,os; pf = 'Package Control.sublime-package'; ipp = sublime.installed_packages_path(); urllib.request.install_opener( urllib.request.build_opener( urllib.request.ProxyHandler()) ); open(os.path.join(ipp, pf), 'wb').write(urllib.request.urlopen( 'http://sublime.wbond.net/' + pf.replace(' ','%20')).read())
```

**Sublime Text 2：**

```
import urllib2,os; pf='Package Control.sublime-package'; ipp = sublime.installed_packages_path(); os.makedirs( ipp ) if not os.path.exists(ipp) else None; urllib2.install_opener( urllib2.build_opener( urllib2.ProxyHandler( ))); open( os.path.join( ipp, pf), 'wb' ).write( urllib2.urlopen( 'http://sublime.wbond.net/' +pf.replace( ' ','%20' )).read()); print( 'Please restart Sublime Text to finish installation')
```

**手动安装：**

可能由于各种原因，无法使用代码安装，那可以通过以下步骤手动安装Package Control：

1.点击Preferences > Browse Packages菜单

2.进入打开的目录的上层目录，然后再进入Installed Packages/目录

3.下载 [Package Control.sublime-package](https://sublime.wbond.net/Package%20Control.sublime-package) 并复制到Installed Packages/目录

4.重启Sublime Text。

Package Control 主文件下载地址：https://github.com/wbond/sublime_package_control
![](/assets/images/2015-11-03-sublime-text-6.jpg)



### 用Package Control安装插件的方法：
1.按下`Ctrl+Shift+P`调出命令面板
2.输入install 调出 Install Package 选项并回车，然后在列表中搜索选择要安装的插件。

或者也可以菜单栏选择 `Preferences->Package Control`弹出插件管理面板,选择`Install Package`

![](/assets/images/2015-11-03-sublime-text-5.png)

下面就是我常用到的一些插件

### ConvertToUTF8 (GBK Encoding Support)

最好先安装`GBK Encoding Support` 再安装 `ConvertToUTF8`

解决Sublime不支持GBK、GB2312编码的问题，支持Sublime打开GB2312编码的文件并提供其输入并编辑中文，在打开GB2312文件后会将其转换为UTF8编码（这不会修改原始文件编码），对于输入和编辑的中文字符在使用Sublime保存后好像会将其转换为原始编码后再进行保存。

### Emmet

这个不用多说,前端开发人员必备插件,很多IDE工具都集成了这项功能.试试在html中输入下面一段代码之后按tab键

```
div#container>div.logo+ul.nav>li.item$*5>a{item $}

```

就能直接生成下面的html代码

```
    <div id="container">
        <div class="logo"></div>
        <ul class="nav">
            <li class="item1"><a href="">item 1</a></li>
            <li class="item2"><a href="">item 2</a></li>
            <li class="item3"><a href="">item 3</a></li>
            <li class="item4"><a href="">item 4</a></li>
            <li class="item5"><a href="">item 5</a></li>
        </ul>
    </div>
```

如果不是太清楚的,可以直接查看[(前端开发必备！Emmet使用手册)](http://www.w3cplus.com/tools/emmet-cheat-sheet.html)这一篇博客

### DocBlockr

如果你遵循的编码的风格很严格，这款插件能够使你的任务更容易。DocBlokr 帮助你创造你的代码注释，通过解析功能，参数，变量，并且自动添加基本项目。

![](/assets/images/2015-11-03-sublime-text-1.jpg)

### Markdown Preview & Markdown Editing
一看这两个插件的名字就知道,可以支持markdown文件的预览了编写,稍微注意的是,没有直接的快捷键支持Markdown预览,需要使用`ctrl + alt + p` 弹出插件管理界面,然后在界面上输入 `markdown`就能直接找到和markdown相关的操作了

![](/assets/images/2015-11-03-sublime-text-2.jpg)

### JS Format
一个JS代码格式化插件。

### Bracket Highlighter
高亮代码匹配，可以匹配括号，引号，标签等各种

![](/assets/images/2015-11-03-sublime-text-3.png)

### SublimeLinter

注意：此插件需要手动安装并切换到 [sublime-text-3 分支](https://github.com/SublimeLinter/SublimeLinter/tree/sublime-text-3)。

SublimeLinter 是一个代码校验插件，它可以帮你找出错误或编写不规范的代码，支持 C/C++、CoffeeScript、CSS、Git Commit Messages、Haml、HTML、Java、JavaScript、Lua、Objective-J、Perl、PHP、Puppet、Python、Ruby 和 XML 语言。

### SublimeCodeIntel

SublimeCodeIntel 是一个代码提示、补全插件，支持 JavaScript、Mason、XBL、XUL、RHTML、SCSS、Python、HTML、Ruby、Python3、XML、Sass、XSLT、Django、HTML5、Perl、CSS、Twig、Less、Smarty、Node.js、Tcl、TemplateToolkit 和 PHP 等语言，是 Sublime Text 自带代码提示功能的很好扩展。它还有一个功能就是跳转到变量、函数定义的地方，十分方便

### Nodejs

Nodejs语言支持,前提当然是你已经安装了nodejs

### SublimeText2-安装Nodejs

这个安装稍微麻烦一点,首先下载nidejs插件包（https://github.com/tanepiper/SublimeText-Nodejs）

1.直接下载压缩包后解压到sublime text的package目录中。查看package目录在哪可以通过菜单栏中的Preferences-->浏览程序包Browse Packages直接打开package目录。
2.将解压缩文件夹名字稍微改简短一点,解压缩之后文件名应该是 `SublimeText-Nodejs-master`可以将其改为`Nodejs`
3.修改编译选项，在package目录下的Nodejs目录中，打开Nodejs.sublime-build,将其改为下面这样:

```
{
  "cmd": ["node", "$file"],
  "file_regex": "^[ ]*File \"(...*?)\", line ([0-9]*)",
  "selector": "source.js",
  "shell":true,
  "encoding": "cp936",
  "windows":
    {
        "cmd": ["taskkill","/F", "/IM", "node.exe","&","node", "$file"]
    },
  "linux":
    {
        "cmd": ["killall node; node", "$file"]
    }
}

```

其实就修改了两处地方。
a.一个是编码，为了避免乱码code，需要改成cp936；
b.另外一个是cmd命令，本身如果只是想简单的运行nodejs程序的话，windows下面的cmd可以直接 "cmd": ["node", "$file"]，但是这样非常不利于开发环境，因为这样的话每次build都会重新启动一个node.exe进程，且会占用一个端口，这肯定是我们不希望的。上文中的cmd原本是想在启动node.exe之前讲node.exe进程都杀掉，然后再启动node.exe，但是这个命令写的不对，直接使用的话是编译不成功的。对cmd命令需要做简单的处理

3.重启sublime text之后，配置就算完成了。

直接编写一个js文件,使用快捷键 `ctrl + b`就能直接运行了

### sublime text 3使用nodejs

sublime text 3已经预装了nodejs插件

打开Sublime Text编辑器，点击“`Tools —> Build System —> New Build System`”，
	{
	  "cmd" : ["node","$file"]
	}

将以上代码另存为JavaScript.sublime，然后点击”`Tools —> Build System`“，我们就可以看到Build System中多了一项”JavaScript“。选中”JavaScript”为Build System。
![](/assets/images/2015-11-03-sublime-text-4.png)

配置好以后，我们就可以在Sublime Text中，按快捷键`Ctrl+B`直接运行JavaScript代码。

其他的插件都很简单了...一般直接下载下来就能使用,还有很多,比如HTML Beautiful,Alignment,SideBarEnhancements,jQuery插件,angularJS插件等等...这些大家在百度上搜索常见的sublime text 插件,然后在Package Control中自行搜索相关的插件就行了


## 配置

sublime还能自定义界面外观,而且可以直接下载一些界面主题,当然还能调整字体大小等等.

点击preferences－setting user，个人设置如下：

```
{
    //字体大小
    "font_size": 14.0,
    //字体类型(此字体需下载)
    "font_face": "YaHei Consolas Hybrid",
    //界面样式
    "theme": "Soda Dark 3.sublime-theme",
    //界面颜色样式
    "color_scheme": "Packages/User/glacier (SL).tmTheme",
    // 设置每一行到顶部，以像素为单位的间距，效果相当于行距
    "line_padding_top": 2,
    // 设置每一行到底部，以像素为单位的间距，效果相当于行距
    "line_padding_bottom": 2,
    // html和xml下突出显示光标所在标签的两端，影响HTML、XML、CSS等
    "match_tags": true,
    // 是否显示代码折叠按钮
    "fold_buttons": true,
    // 代码提示
    "auto_complete": true,
    // 默认编码格式
    "default_encoding": "UTF-8",
    // 左边边栏文件夹动画
    "tree_animation_enabled": true,
    //删除你想要忽略的插件
    "ignored_packages":
    [
        "Vintage",
        "YUI Compressor"
    ]
}
```

### Theme – Soda

Soda Theme 是最受欢迎的 Sublime Text 主题。

![](/assets/images/2015-11-03-sublime-text-7.png)

安装后你还需要在你的配置文件（菜单 Preferences -> Settings - User）中加入"theme": "Soda Light.sublime-theme" 或 "theme": "Soda Dark.sublime-theme"。要达到图中的效果，你还需要下载与之搭配的 color scheme。



