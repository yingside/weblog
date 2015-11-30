---

layout: post
title: 通过简单游戏建立js模块化思维(一)--分拆图片资源加载
tags:  [HTML5,Canvas,javascript模式]
categories: [Canvas]
author: Yingside
excerpt: "稍微复杂一点的游戏，还是基于Canvas的，但是这个游戏带领大家认识封装，了解模块化思维的一些想法，所以这个程序还用到了requrieJS，虽然不太合理，但是主要还是让大家通过简单的程序慢慢掌握更加高级一点的javascript思想"

---

首先，先来看看游戏是什么样子的

![](/assets/images/2015-11-30-view.png)

可以看到，游戏很简单，无非就是敌机往左飞，而我们自己的飞机可以键盘控制，而且打出子弹，稍微一点的细节是敌机的壳是可以自己一张一合的，看起来就像个甲虫，而自己机器的螺旋桨也是可以看起来在转动的，而且打中敌机之后，会有爆炸效果。这些都是通过一张图片轮循出来的，来看下这张图片

![](/assets/images/2015-11-30-sprites.png)

也就是说，要实现飞机自己动起来的和爆炸的效果，其实就是要让图片进行轮换，才能让人感觉在动，和动画片的原理是一样的，不是灰太狼在跑，而是灰太狼的图片一直在换，当然了，还有一张背景图片

![](/assets/images/2015-11-30-terrain.png)

图片很小，平铺满整个画布就好。

无论如何，程序还是一步一步来，我们先从最简单的开始，再逐步修改，首先还是先创建画布

## 一.创建画布

创建`index.html`文件和`app.js`文件，这个就不多说。在app中编写代码，为了不污染全局环境，我们先把程序放在立即执行的匿名函数中

```javascript
(function(){
	var canvas = document.createElement("canvas");
	canvas.height = 480;
	canvas.width = 512;
	document.body.appendChild(canvas);

	var ctx = canvas.getContext("2d");
})();

```

## 二.放入图片

接下来就是把图片放入画布先看看效果怎么样，先把背景图片给放进去，背景图片我们使用画布的方法`ctx.createPattern()`进行填充，还是要注意的是，讲图片画入画布，还是需要图片先加载好才行，所以`img.onload`函数还是必须要使用的，不然当js加载完成之后，图片并没有加载好，那么canvas上面肯定是画不出图片的，所以，先这么写

```javascript
//...上面的代码省略
var bgImage = new Image();
bgImage.onload = function(){
var terrainPattern = ctx.createPattern(bgImage, "repeat");
		ctx.fillStyle = terrainPattern;
		ctx.fillRect(0,0,canvas.width,canvas.height);
	}
bgImage.src = "images/terrain.png";

```

这样界面至少能看到背景图片了，接下来我们把自己的飞机上去。当然放入我们自己飞机的时候问题出现了，自己飞机有两个状态，这两个状态不断切换，就能实现螺旋桨在动的效果，我们先放入一张图片在canvas中的画，至少这个图片要进行切割，比如我们放第二张自己飞机的图片进去

```javascript
//...以上代码省略
var myPlane = new Image();
	myPlane.onload = function(){
		ctx.drawImage(myPlane, 39, 0, 39, 39, 100, 200, 39, 39);
	}
myPlane.src = "images/sprites.png";
```

大家没忘记画布的`drawImage()`这个方法吧？没关系，我们回顾一下，这个方法一共有9个参数，其实除了第一个和第六，七个，其他参数都是可选的，具体如下：

**语法 1**
在画布上定位图像：

```javascript
context.drawImage(img,x,y);
```

**语法 2**
在画布上定位图像，并规定图像的宽度和高度：

```javascript
context.drawImage(img,x,y,width,height);
```

**语法 3**
剪切图像，并在画布上定位被剪切的部分：

```javascript
context.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);
```

**参数值：**

| 参数 | 描述 |
|--------|--------|
|    img    |  规定要使用的图像、画布或视频。 |
|sx	| 可选。开始剪切的 x 坐标位置。|
|sy	| 可选。开始剪切的 y 坐标位置。|
|swidth |	可选。被剪切图像的宽度。|
|sheight |	可选。被剪切图像的高度。|
|x	| 在画布上放置图像的 x 坐标位置。|
|y	| 在画布上放置图像的 y 坐标位置。|
|width |	可选。要使用的图像的宽度。（伸展或缩小图像）|
|height |	可选。要使用的图像的高度。（伸展或缩小图像）|

所以根据这些参数，可以定下来，飞机大小可以在图片上测量，大约[39,39],比如我们想把飞机放在画布上的[100,200]的位置，并且显示图片上第二张飞机的样子，最后就可以写成了这个样子

```javascript
ctx.drawImage(myPlane, 39, 0, 39, 39, 100, 200, 39, 39);
```

### 问题？
ok，我们图片放了两张进去了，这个时候大家有没有发现什么问题呢？我们的图片全部都要放在`img.onload`里面，这就极大的局限了我们的操作，而且这样的代码看上去极其不美观，现在的问题是希望不要每次有图片的时候，我们都要想到要让图片`onload`之后才能干事情，能不能重新组合一下代码，每次要用图片的时候，直接`get`到就行了...这其实就是封装代码，封装模块最初的想法

## 三.提取资源

### 怎么封装？

那么现在，我们就把提取图片这一块代码提取出来，专门写成一堆代码进行管理图片资源文件，那么第一个问题，怎么写好？之前已经通过例子讲解封装函数，具体请看[通过实例学习javascript函数封装(一)--拖拽](http://www.yingside.com/2015/10/28/js-drag)，[通过实例学习javascript函数封装(二)--放大镜](http://www.yingside.com/2015/10/30/js-magnifier)。

那么，通过函数去管理当然可以，但是，这里游戏后面还会涉及到动画的一些操作，代码多了之后函数也是一大堆，其实也很乱。所以我们可以把封装的函数再管理一下，把函数放在一个对象里面，这样我们就可以使用一个对象，来管理一堆函数了，而且这一堆函数都可以确定是专门管理图片资源的，还有一个好处就是，在这个对象里面封装的变量和函数还不用担心和外面的其它同名，这就是以后大家经常听说的**命名空间**的概念了，其实这个道理是很简单的，比如像下面这样。

```javascript

(function(){
    function fn1(){
        //....
    }

    function fn2(){
        //....
    }

    function fn3(){
        //....
    }

    window.resources = {
		"fn1":fn1,
        "fn2":fn2,
        "fn3":fn3
    }
})();

```

在立即执行的函数里面放入了一堆函数，window.resources是一个全局变量，那么resources里面的属性都可以访问了，我们把立即执行函数里面声明的函数或者变量再挂载到这个resources变量上，那么外部就能通过resources访问相关函数了.所以，我们就按照这种方式来封装一个resources对象，用它来管理所有和图片相关的代码。

### 如何处理onload？

如论怎么样，图片资源还是要等`onload`之后我们才能使用，那么这里怎么处理呢？我们可以将图片资源读取完之后，讲图片资源对象再放入到一个对象中，那么只要判断对象中已经有这个值了，那么证明图片已经加载完成了，接下来，我们单独创建一个js文件`resource.js`。

首先来看一下，下面的代码：

```javascript
(function(){
	var resourceCache = {}; //缓存图片

	function isReady(){
		var ready = false;
		for(var k in resourceCache){
			//如果属性属于对象自身的属性而不是继承而来，并且该属性对应的值不为null
            //那么证明图片已经加载进了resources这个对象中
			if(resourceCache.hasOwnProperty(k) && resourceCache[k]){
				ready = true;
				break;
			}
		}
		return ready;
	}
})();
```
`resourceCache`这个对象我们准备像这种方式保存图片：

```javascript
resourceCache = {
	//"图片路径":"图片对象"
    "images/terrain.png":bgImage,
    "images/sprites.png":spritesImage
    //......
}
```
那么就可以根据这个路径的键，来查找对象中有没有这个图片对象，就像我们代码中解释的那样

接下来继续补充代码，现在就是等图片加载好之后加载到resources对象中，我们再封装一个函数

```javascript
(function(){
	var resourceCache = {};

	function _load(url){
    	//如果对象里面有对应的值，表示已经存在，那么直接返回
		if(resourceCache[url]){
			return resourceCache[url];
		}else{
        	//如果没有，就需要将image对象传入到resources对象中保存
			var image = new Images();
			image.onload = function(){
				resourceCache[url] = image;
                if(isReady()){
                	//...其它操作
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
})();

```
在`_load`函数里面，首先判断对象中是否有已经传入的`url`如果有，直接返回，证明已经加载过这张图片了。如果没有，就`new Image()`创建一个新对象，并且等对象加载完成之后，将对象加载到数组中。这个时候就可以调用`isReady()`函数，如果已经加载完成，可以干一些其它事情了。而且这么做好保证了一件事情，图片只会加载一次，不会重复加载

其它什么事情先不管，现在这个`_load()`函数就只能接收一个传入的参数，如果要传入多张图片路径的话，还需要多调用几次，所以，还可以将这个函数再封装一下：

```javascript
(function(){
	var resourceCache = {};

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
				//...其它操作
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
})();

```

新加入的`load()`函数很简单，接收的参数，可以是单个字符串，也可以是一个数组，如果是单个字符串，直接去调用`_load()`函数，如果是个数组，其实就是循环调用一下`_load()`函数。这样相当于我们在外面只需要知道`load()`函数就行了，具体执行函数其实是`_load()`,这样就达到了将**实现细节隐藏**

### onload之后如何执行操作？

虽然，上面讲图片放入到resources对象中，讲图片做了隐藏，但是我们有一些操作还是要放在`onload`事件里面怎么办？很简单，其实我们只需要使用回调函数就好，为了统一管理，如果回调函数很多，我们还可以放一个`数组readyCallbacks`，用来保存外部调用时需要回调的函数。为了方便起见，我们可以这么写代码：

```javascript
function onReady(func){
	readyCallbacks.push(func);
}
```

这个`onReady(func)`是暴露在外部可见的，很简单，无非就是讲外部函数放入到`readyCallbacks`数组中，然后在`_load()`函数里面当图片加载好，并且想**马上就执行操作**的话，可以在`if(isReady())`判断中，加入这样的代码：

```javascript
if(isReady()){
	readyCallbacks.forEach(function(func){
		func();
	});
}
```
我们还需要一个外部提供`URL`，然后就能直接获取`image`对象的函数`get(url)`

```javascript
function get(url){
	return resourceCache[url];
}
```
那么最后，只需要让`resourceCache`赋值好就行了，外部可以通过resourceCache来获取最终的函数。

```javascript
window.resources = {
	"load":load,
	"get": get,
	"isReady": isReady,
	"onReady":onReady
}
```


下面就是完整的`resources.js`的函数

**resources.js**

```javascript
(function(){
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

	window.resources = {
		"load":load,
		"get": get,
		"isReady": isReady,
		"onReady":onReady
	}
})();
```

## 四.调用一下

那么这个封装的`resources.js`文件就写好了，我们使用一下，在`app.js`中调用`resource`对象。

当然首先，你需要在html文件中引用`resources.js`文件

```javascript
<script src="js/resources.js"></script>
<script src="js/app.js"></script>
```

这里唯一注意的一点是`resources.js`文件需要引用在`app.js`文件之前

其次，修改之前的`app.js`文件。现在，我们不需要再担心图片是否已经`onload`了，只需要知道你要引用图片了，图片的路径是什么，我们需要使用`resources.load()`引用就ok！

```javascript
resources.load([
	"images/terrrain.png",
	"images/sprites.png"
]);
```

在加载图片的同时，我们想讲背景和自己飞机的图片画上去，`app.js`这里我们只需要画就好，画好之后，讲回调函数传入到`resources.onReady(func)`去执行。

**app.js**

```javascript
(function(){
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
})();
```

可以看到，现在我们只需要在`app.js`里面写出我们最关心的代码就行了，如果需要图片，可以在一开始就通过`resources.load()`函数，将图片加载进去，要用的时候，直接`resources.get()`就好。

