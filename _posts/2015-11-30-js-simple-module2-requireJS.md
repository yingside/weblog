---

layout: post
title: 通过简单游戏建立js模块化思维(二)--通过项目了解模块化与RequireJS库
tags:  [HTML5,Canvas,javascript模式]
categories: [Canvas]
author: Yingside
excerpt: "经过上一章，大家可以看到，resources.js其实已经相当于一个比较独立的部分，那么我们就把这个说法延伸一下，把这个resources.js文件看做一个独立的积木，去掉这一部分，其实程序还是可以写出来，只是加上之后，一些多余的部分不需要再多花费时间了。而是由这个模块已经独立完成，这个就是模块化的思想雏形"

---

以下关于模块化的介绍，大多数参考了阮一峰的文章 [Javascript模块化编程](http://www.ruanyifeng.com/blog/2012/10/asynchronous_module_definition.html)，讲自己的游戏模块化在第十一点，前面都是介绍模块化的内容

## 一.模块的规范

先想一想，为什么模块很重要？
因为有了模块，我们就可以更方便地使用别人的代码，想要什么功能，就加载什么模块。
但是，这样做有一个前提，那就是大家必须以同样的方式编写模块，否则你有你的写法，我有我的写法，岂不是乱了套！考虑到`Javascript`模块现在还没有官方规范，这一点就更重要了。
目前，通行的Javascript模块规范共有两种：`CommonJS`和`AMD`。我主要介绍`AMD`，但是要先从`CommonJS`讲起。

## 二.CommonJS

2009年，美国程序员Ryan Dahl创造了`node.js`项目，将`javascript`语言用于服务器端编程。

![](/assets/images/2015-11-30-nodejs.jpg)

这标志`Javascript模块化编程`正式诞生。因为老实说，在浏览器环境下，没有模块也不是特别大的问题，毕竟网页程序的复杂性有限；但是在服务器端，一定要有模块，与操作系统和其他应用程序互动，否则根本没法编程。

`node.js`的模块系统，就是参照`CommonJS`规范实现的。在`CommonJS`中，有一个全局性方法`require()`，用于加载模块。假定有一个数学模块`math.js`，就可以像下面这样加载。

```javascript
var math = require('math');
```

然后，就可以调用模块提供的方法：

```javascript
var math = require('math');
math.add(2,3); // 5
```
因为这个系列主要针对浏览器编程，不涉及`node.js`，所以对`CommonJS`就不多做介绍了。我们在这里只要知道，`require()`用于加载模块就行了。

## 三.浏览器环境

有了服务器端模块以后，很自然地，大家就想要客户端模块。而且最好两者能够兼容，一个模块不用修改，在服务器和浏览器都可以运行。

但是，由于一个重大的局限，使得`CommonJS`规范不适用于浏览器环境。还是上一节的代码，如果在浏览器中运行，会有一个很大的问题，你能看出来吗？

```javascript
var math = require('math');
math.add(2,3);
```

第二行`math.add(2, 3)`，在第一行`require('math')`之后运行，因此必须等`math.js`加载完成。也就是说，如果加载时间很长，整个应用就会停在那里等。

这对服务器端不是一个问题，因为所有的模块都存放在本地硬盘，可以同步加载完成，等待时间就是硬盘的读取时间。但是，对于浏览器，这却是一个大问题，因为模块都放在服务器端，等待时间取决于网速的快慢，可能要等很长时间，浏览器处于"假死"状态。

因此，浏览器端的模块，不能采用`同步加载（synchronous）`，只能采用`异步加载（asynchronous）`。这就是AMD规范诞生的背景。

## 四.AMD
AMD是"Asynchronous Module Definition"的缩写，意思就是"异步模块定义"。它采用异步方式加载模块，模块的加载不影响它后面语句的运行。所有依赖这个模块的语句，都定义在一个回调函数中，等到加载完成之后，这个回调函数才会运行。

AMD也采用require()语句加载模块，但是不同于CommonJS，它要求两个参数：

```javascript
require([module], callback);
```

第一个参数[module]，是一个**数组**，里面的成员就是要加载的模块；第二个参数callback，则是加载成功之后的**回调函数**。如果将前面的代码改写成AMD形式，就是下面这样：

```javascript
require(['math'], function (math) {
	math.add(2, 3);
});
```

接下来，介绍一下现在比较流行的AMD框架require.js

## 五.为什么要用require.js？
最早的时候，所有Javascript代码都写在一个文件里面，只要加载这一个文件就够了。后来，代码越来越多，一个文件不够了，必须分成多个文件，依次加载。下面的网页代码，相信很多人都见过。

```javascript
<script src="1.js"></script>
<script src="2.js"></script>
<script src="3.js"></script>
<script src="4.js"></script>
<script src="5.js"></script>
<script src="6.js"></script>
```
这段代码依次加载多个js文件。

这样的写法有很大的缺点。**首先，加载的时候，浏览器会停止网页渲染，加载文件越多，网页失去响应的时间就会越长；其次，由于js文件之间存在依赖关系，因此必须严格保证加载顺序（比如上例的1.js要在2.js的前面），依赖性最大的模块一定要放到最后加载，当依赖关系很复杂的时候，代码的编写和维护都会变得困难。**

require.js的诞生，就是为了解决这两个问题：

![](/assets/images/2015-11-30-requirejs.png)

**（1）实现js文件的异步加载，避免网页失去响应；
（2）管理模块之间的依赖性，便于代码的编写和维护。
**

## 六.require.js的加载
使用require.js的第一步，是先去中文官方网站[下载](http://www.requirejs.cn/docs/download.html)最新版本。
下载后，假定把它放在js子目录下面，就可以加载了。

```javascript
<script src="js/require.js"></script>
```

有人可能会想到，加载这个文件，也可能造成网页失去响应。解决办法有两个，一个是把它放在网页底部加载，另一个是写成下面这样：

```javascript
<script src="js/require.js" defer async="true" ></script>
```

`async`属性表明这个文件需要异步加载，避免网页失去响应。IE不支持这个属性，只支持`defer`，所以把`defer`也写上。
加载`require.js`以后，下一步就要加载我们自己的代码了。假定我们自己的代码文件是`main.js`，也放在js目录下面。那么，只需要写成下面这样就行了：

```javascript
<script src="js/require.js" data-main="js/main"></script>
```

`data-main`属性的作用是，指定网页程序的主模块。在上例中，就是js目录下面的`main.js`，这个文件会第一个被`require.js`加载。由于`require.js`默认的文件后缀名是js，所以可以把`main.js`简写成`main`。

## 七.主模块的写法
上一节的main.js，我把它称为"主模块"，意思是整个网页的入口代码。它有点像C语言的main()函数，所有代码都从这儿开始运行。
下面就来看，怎么写`main.js`。
如果我们的代码不依赖任何其他模块，那么可以直接写入javascript代码。

```javascript
// main.js
alert("加载成功！");
```

但这样的话，就没必要使用`require.js`了。真正常见的情况是，主模块依赖于其他模块，这时就要使用AMD规范定义的的`require()`函数。

```javascript
// main.js
require(['moduleA', 'moduleB', 'moduleC'], function (moduleA, moduleB, moduleC){
	// 需要编写的代码
});

```

`require.js`会先加载`jQuery`、`underscore`和`backbone`，然后再运行回调函数。主模块的代码就写在回调函数中。

## 八.模块的加载
上一节最后的示例中，主模块的依赖模块是['jquery', 'underscore', 'backbone']。默认情况下，require.js假定这三个模块与main.js在**同一个目录**，文件名分别为jquery.js，underscore.js和backbone.js，然后自动加载。

使用require.config()方法，我们可以对模块的加载行为进行自定义。`require.config()`就写在主模块（main.js）的头部。参数就是一个对象，这个对象的`paths`属性指定各个模块的加载路径。

```javascript
require.config({
	paths: {
		"jquery": "jquery.min",
		"underscore": "underscore.min",
		"backbone": "backbone.min"
	}
});
```
上面的代码给出了三个模块的文件名，**路径默认与main.js在同一个目录**（js子目录）。如果这些模块在其他目录，比如`js/lib`目录，则有两种写法。**一种是逐一指定路径。**

```javascript
require.config({
	paths: {
		"jquery": "lib/jquery.min",
		"underscore": "lib/underscore.min",
		"backbone": "lib/backbone.min"
	}
});
```
**另一种则是直接改变基目录（baseUrl）。**

```javascript
require.config({
	baseUrl: "js/lib",
	paths: {
		"jquery": "jquery.min",
		"underscore": "underscore.min",
		"backbone": "backbone.min"
	}
});
```

如果某个模块在另一台主机上，也可以直接指定它的网址，比如：

```javascript
require.config({
	paths: {
		"jquery": "http://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js"
	}
});

```
require.js要求，每个模块是一个单独的js文件。这样的话，如果加载多个模块，就会发出多次HTTP请求，会影响网页的加载速度。因此，require.js提供了一个优化工具，当模块部署完毕以后，可以用这个工具将多个模块合并在一个文件中，减少HTTP请求数。


## 九.AMD模块的写法

`require.js`加载的模块，采用AMD规范。也就是说，模块必须按照AMD的规定来写。
具体来说，就是模块必须采用特定的`define()`函数来定义。如果一个模块不依赖其他模块，那么可以直接定义在define()函数之中。

假定现在有一个math.js文件，它定义了一个math模块。那么，math.js就要这样写：

```javascript
// math.js
define(function (){
	var add = function (x,y){
		return x+y;
	};
	return {
		add: add
	};
});
```

**加载方法如下：**

```javascript
// main.js
require(['math'], function (math){
	alert(math.add(1,1));
});
```

如果这个模块还依赖其他模块，那么define()函数的第一个参数，必须是一个数组，指明该模块的依赖性。

```javascript
define(['myLib'], function(myLib){
	function foo(){
		myLib.doSomething();
	}
	return {
		foo : foo
	};
});
```

当`require()`函数加载上面这个模块的时候，就会先加载`myLib.js`文件。

## 十.加载非规范的模块

理论上，require.js加载的模块，必须是按照AMD规范、用define()函数定义的模块。但是实际上，虽然已经有一部分流行的函数库（比如jQuery）符合AMD规范，更多的库并不符合。那么，require.js是否能够加载非规范的模块呢？

回答是可以的。

这样的模块在用require()加载之前，要先用require.config()方法，定义它们的一些特征。
举例来说，underscore和backbone这两个库，都没有采用AMD规范编写。如果要加载它们的话，必须先定义它们的特征。

```javascript
require.config({
	shim: {
		'underscore':{
　　　　　exports: '_'
	},
	'backbone': {
		deps: ['underscore', 'jquery'],
		exports: 'Backbone'
	}
}
});
```

**require.config()**接受一个配置对象，这个对象除了有前面说过的paths属性之外，还有一个shim属性，专门用来配置不兼容的模块。具体来说，每个模块要定义
（1）exports值（输出的变量名），表明这个模块外部调用时的名称；
（2）deps数组，表明该模块的依赖性。

比如，jQuery的插件可以这样定义：

```javascript
shim: {
	'jquery.scroll': {
		deps: ['jquery'],
		exports: 'jQuery.fn.scroll'
	}
}
```

简单的requireJS就先介绍到这里，现在先来看看，我们这个项目里面怎么使用requireJS。

## 十一.在游戏项目中使用requireJS

实现模块化，由于有了reuqireJS其实很简单，大家不用害怕，难的其实只是概念。

还记得我们在HTML页面里面怎么引用js的吗？

```javascript
<script src="js/resources.js"></script>
<script src="js/app.js"></script>
```

对的，我们先引用了`resources.js`,再引用了`app.js`，你试试将这两个引用的位置换一下，马上就会报错，因为`app.js`是需要用到`resources.js`,但是这样的话，`resources.js`还没有被加载就先用`app.js`,那肯定就会报错了！

首先，其实我们定义的resources.js已经单独是一个文件，并且已经具有了模块的一些功用，就是来加载图片的。所以，我们先将resources.js改写。

**resources.js**

```javascript
define(function(){
	var resourceCache = {};
	var readyCallbacks = [];
	function load(urlOrArray){
		if(urlOrArray instanceof Array){
			urlOrArray.forEach(function(url){
				_load(url);
			});
		}else{
			_load(urlOrArray);
		}
	}

	function _load(url){
		if(resourceCache[url]){
			return resourceCache[url];
		}else{
			var image = new Image();
			image.onload = function(){
				resourceCache[url] = image;
				if(isReady()){
					readyCallbacks.forEach(function(func){
						func();
					});
				}
			}
			image.src = url;
		}
	}

	function isReady(){
		var ready = false;
		for(var k in resourceCache){
			if(resourceCache.hasOwnProperty(k) && resourceCache[k]){
				ready = true;
				break;
			}
		}
		return ready;
	}

	function get(url){
		return resourceCache[url];
	}

	function onReady(func){
		readyCallbacks.push(func);
	}

	return {
		"load":load,
		"get": get,
		"isReady": isReady,
		"onReady":onReady
	}
});
```

可以看到，我们其实并没有改动过多的内容，只是最后返回了一个匿名对象，再开始用`define()`函数包裹了一个匿名函数，这就把整个匿名函数封装成了一个模块。

那么这个resources模块，我们要在`app.js`中使用该怎么办？很简单，改写app.js

**app.js**

```javascript
require(['resources'],function(resources){
	var canvas = document.createElement("canvas");
	canvas.height = 480;
	canvas.width = 512;
	document.body.appendChild(canvas);

	var ctx = canvas.getContext("2d");

	resources.load([
		"images/terrain.png",
		"images/sprites.png"
	]);

	function init(){
		var terrainPattern = ctx.createPattern(resources.get("images/terrain.png"),"repeat");
		ctx.fillStyle = terrainPattern;
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		ctx.drawImage(resources.get("images/sprites.png"), 39, 0, 39, 39, 100, 200, 39, 39);
	}
	resources.onReady(init);
});
```

里面的代码没做任何改动，但是外部用`require()`函数包裹了起来，由于`app.js`需要用到`resources.js`,所以，第一个参数数组里面，添加了`resources.js`这个文件的引用。第二个参数还是一个匿名函数，匿名函数里面的参数，对应的就是`resources.js`返回的匿名对象的引用，所以下面我们就可以直接使用**resources**这个对象了。

最后在HTML文件中，直接将之前js的引用换成`require.js`的引用就好了，我们现在的主程序文件当然就是`app.js`


```javascript
<script src="js/require.js" data-main="js/app"></script>
```

大功告成，一个模块化的加载就在我们的游戏项目中弄好了，接下来就是要让界面动起来了










