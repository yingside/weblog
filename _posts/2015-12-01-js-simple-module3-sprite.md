---

layout: post
title: 通过简单游戏建立js模块化思维(三)--游戏精灵sprite
tags:  [HTML5,Canvas,javascript模式]
categories: [Canvas]
author: Yingside
excerpt: "这一章，建立游戏精灵模块，游戏中无论子弹，自己的飞机还是敌机这写会动的东西都属于游戏中的精灵，每一个精灵不同的动作无非就是图画不一样，所以，唯一的区别其实就是速度。但是js中要控制动作无非就只有setTimeOut或者setInterval，就算高级点的requestAnimationFrame也只能控制一个时间点，那难道每一个不同的动作都需要建立不同的setTimeout吗？sprite模块理解的难点在这里"

---

## 一.游戏精灵分析

我们已经有了一个**resources**模块，无非就是加载界面图片资源，现在我们再分析游戏，游戏中最重要的无非就是一个会动的物体，那么这些物体，我们统称为**精灵(Sprite)**,他们有什么共通的东西吗？咋一看，好像都不一样，但是仔细分析：他们其实都是一样的，无非就是图片，无非就是图片在换，可能换的速度和移动的速度不一样而已。所以这是很重要的一点。

既然要在js中写游戏，只要涉及到很多精灵在动，我们就可以使用游戏主循环来控制整个动画的时间。游戏中自己的飞机，敌机，还有子弹都会移动，这个我们可以通过主循环时间和各自不同的速度算出来。（这个不是太懂的，可以先看下我的文章[怎样用HTML5 Canvas制作一个简单的游戏](http://www.yingside.com/2015/11/18/simple-canvas-game)，里面具体有讲诉什么是游戏主循环），出了移动之外，自己飞机螺旋桨的转动，敌机壳的变动，还有爆炸的效果其实也是一种动，需要通过时间计算换图片的时间。

### 图片的位置的替换实现动画

什么意思？不太懂的先看看图片

![](/assets/images/2015-11-30-sprites.png)

自己的飞机其实是两张图片，比如把这两个位置设置为一个数组`[0,1]`,第一张图片位置为0，第二章图片位置为1，那么飞机螺旋桨转动的效果无非就是`[0,1]`位置一直在交换而已。

那敌机的壳一直的变动，我们也可以设成一个数组`[0,1,2,3,2,1]`,这样从头到位一直循环就能实现敌机的壳一直在一张一合。

前面两个图案都是会一直执行的，而爆炸图片也类似，只是爆炸图片不用一直循环，运行一次就要结束，这是编码的时候要注意的点，那么爆炸我们也可以放在一个数组中`[0,1,2,3,4,5,6,7,8,9,10,11,12]`

```
经过测量，自己飞机的宽高是 39 ＊ 39，第一张飞机图片的在整个图片中的位置很好确定就在[39 ＊ 0, 39 ＊ 0]点，那么第二张飞机的位置，无非就是`[39 ＊ 1,39 * 0]`点。这样就能把每张图片从整张图片中截取出来。同理，后面的敌机和爆炸是一个意思
```

按照上面的思路，开始编码，当然，首先还是游戏主循环，在app.js中加入游戏主循环，游戏主循环中肯定还是约定俗成的套路，`update(dt)`与`render()`,一个负责更新界面上所有东西的坐标，一个负责画。所以，之前的app.js文件我们稍作修改

**app.js**

```javascript
require(['resources'],function(resources){
	var canvas = document.createElement("canvas");
	canvas.height = 480;
	canvas.width = 512;
	document.body.appendChild(canvas);

	var ctx = canvas.getContext("2d");

	requestAnimationFrame = window.requestAnimationFrame ||
							window.webkitRequestAnimationFrame ||
							window.msRequestAnimationFrame ||
							window.mozRequestAnimationFrame ||
							function(callback){
								window.setTimeout(callback,1000/60);
							};

	resources.load([
		"images/terrain.png",
		"images/sprites.png"
	]);
	resources.onReady(init);

	var terrainPattern;
	var lastTime;
	function main(){
		var now = Date.now();
		var dt = (now - lastTime) / 1000.0;

		update(dt);
		render();

		lastTime = now;
		requestAnimationFrame(main);
	}

	function init(){
		terrainPattern = ctx.createPattern(resources.get("images/terrain.png"),"repeat");
		lastTime = Date.now();
		main();
	}
	function update(dt){

	}
	function render(){
		ctx.fillStyle = terrainPattern;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	}
});
```
这里添加了`main()`函数，用来控制整个游戏的时间点，将画图的部分移到了`render()`函数中，执行`init()`的函数的时候就将执行`main()`函数，由于还没有写到位移，`update(dt)`函数中暂时空着，接下来先编写sprite模块，将游戏中所有能动的东西，都看做精灵，自己的飞机，敌机，爆炸，子弹。在这个模块中，我们主要处理动画效果，也就是图片的切换。

## 二.编写Sprite函数

首先，还是将Sprite定义为一个模块

```javascript
define(['resources'],function(resources){
	//......
})
```

由于需要用到图片，所以需要引入`resources`模块，接下来，由于游戏精灵需要大量生成，我们定义为构造函数，便于大量生成对象。

```javascript
define(['resources'],function(resources){
	function Sprite(url,pos,size,speed,frames,dir,once){
		this.url = url;
		this.pos = pos;
		this.size = size;
		this.speed = typeof speed == "number" ? speed : 0;
		this.frames = frames;
		this.dir = dir || "horizontal";
		this.once = once;
		this._index = 0;
		this.done = false;
	}
})
```
这里一次解释一下参数和属性的含义

```
url: 这个当然就是图片的路径了，需要传入字符串。由于这里就是游戏精灵，所以图片路径当然需要传入"images/sprites.png"。

pos: 游戏中不同物体，需要传入数组。第一张图片的位置，比如自己飞机的第一张图片位置是[0,0],第二张图片位置是[39,0]，那么这里需要传入的是[0,0]

size: 游戏精灵的大小，需要传入数组。比如，自己飞机的大小是[39,39]，敌机的大小是[80,39]

speed: 精灵自己运动的速度。其实就是螺旋桨转动，爆炸，敌机机壳一张一合的速度

frames: 这个就是动画的替换位置，需要传入数组。自己飞机是[0,1],敌机[0,1,2,3,2,1],爆炸[0,1,2,3,4,5,6,7,8,9,10,11,12]

dir: 运动方向，字符串

once: 是否只是执行一次，布尔类型。比如爆炸动画之行完成之后就不会再执行了。

this._index: 用来再次计数的变量
this.done: 是否动画之行完成
```
定义了这些属性之后，接下来要定义，sprite相关动作，这些写在原型中:

```javascript
Sprite.prototype = {
		constructor:Sprite,
		update: function(dt){
			this._index += this.speed * dt;
		},

		render: function(ctx){
			var frame;
			if(this.speed > 0){
				var max = this.frames.length;
				var idx = Math.floor(this._index);
				frame = this.frames[idx % max];
				if(this.once && idx>=max){
					this.done = true;
					return;
				}
			}else{
				frame = 0;
			}

			var x = this.pos[0];
			var y = this.pos[1];

			x += frame * this.size[0];

			ctx.drawImage(resources.get(this.url), 
				x, y, 
				this.size[0], this.size[1], 
				0, 0, 
				this.size[0], this.size[1]);
		}
}

return Sprite;
```
首先来说render无非就是实现图片的轮换，从而实现动画效果。所以这里理解的重点就是如何实现轮换的？

`update(dt)`这里就是在做`this._index`的累加，`this.speed`定义的动画之行速度，乘以dt之后这个值在开始其实是很小的。

`render(ctx)`其实大家把握最终要达到的效果就是在`drawImage`的时候，图片要随着时间切换，这里无非是在想办法，依次切换图片。

`max`: 整个动画节点的长度，其实就是滚换图片的数量，自己飞机就是2张，敌机由于有一张一合的效果，其实是6张，爆炸是13张。

`idx`: 每次向下取整this._index得到整数值，由于`this._index`是随着时间再进行累加的，如果对象不消失的话，`idx`也是在不断增长的。

`frame`: 通过`this.frames[idx % max]`计算每一次时间动画应该截取的位置

`if(this.once && idx>=max)`: 这句判断主要是为了爆炸效果，爆炸之行一次就不再之行，所以`this.done = true`，当`this.done`为true的时候，就应该将界面上的爆炸图片给删除

`x += frame * this.size[0]`: 由于图片上的图案都是横坐标在改变，所以，这里只用修改横坐标的值就好。通过frame拿到每次frames数组的值，比如敌机：frame=2，那么 x += 2 * 80，这个时候就取得的是第三架敌机的图案。

## 三.app.js引入

最后，我们在app.js上调用一下,由于新加了Sprite模块，所以要先引入：

```javascript
require(['resources',"sprite"],function(resources,Sprite){
	//......
})
```
注意前面数组内填入的是文件名，function内的参数，是要引用的对象的名字。我们在界面上分别添加一架自己的飞机与两架敌机

```javascript
	var player = {
		pos:[50,100],
		sprite:new Sprite("images/sprites.png",[0,0],[39,39],16,[0,1])
	}

	var enemy1 = {
		pos:[250,200],
		sprite:new Sprite("images/sprites.png",[0,78],[80,39],6,[0,1,2,3,2,1])
	}
	var enemy2 = {
		pos:[150,100],
		sprite:new Sprite("images/sprites.png",[0,78],[80,39],6,[0,1,2,3,2,1])
	}

	function update(dt){
		player.sprite.update(dt);
		enemy1.sprite.update(dt);
		enemy2.sprite.update(dt);
	}
	function render(){
		ctx.fillStyle = terrainPattern;
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		ctx.save();
		ctx.translate(player.pos[0], player.pos[1]);
		player.sprite.render(ctx);
		ctx.restore();

		ctx.save();
		ctx.translate(enemy1.pos[0], enemy1.pos[1]);
		enemy1.sprite.render(ctx);
		ctx.restore();

		ctx.save();
		ctx.translate(enemy2.pos[0], enemy2.pos[1]);
		enemy2.sprite.render(ctx);
		ctx.restore();
	}
```
现在就可以看到界面上自己的飞机与敌机有各自的动画了。
![](/assets/images/2015-12-01-sprite-view.png)

下面是现阶段完整的app.js文件与完整的sprite.js文件

**sprite.js**

```javascript
define(['resources'],function(resources){

	function Sprite(url,pos,size,speed,frames,dir,once){
		this.url = url;
		this.pos = pos;
		this.size = size;
		this.speed = typeof speed == "number" ? speed : 0;
		this.frames = frames;
		this.dir = dir || "horizontal";
		this.once = once;
		this._index = 0;
		this.done = false;
	}

	Sprite.prototype = {
		constructor:Sprite,
		update: function(dt){
			this._index += this.speed * dt;
		},

		render: function(ctx){
			var frame;
			if(this.speed > 0){
				var max = this.frames.length;
				var idx = Math.floor(this._index);
				frame = this.frames[idx % max];
				if(this.once && idx>=max){
					this.done = true;
					return;
				}
			}else{
				frame = 0;
			}

			var x = this.pos[0];
			var y = this.pos[1];

			x += frame * this.size[0];

			ctx.drawImage(resources.get(this.url), 
				x, y, 
				this.size[0], this.size[1], 
				0, 0, 
				this.size[0], this.size[1]);
		}
	}
	return Sprite;
});
```

**app.js**

```javascript
require(['resources',"sprite"],function(resources,Sprite){
	var canvas = document.createElement("canvas");
	canvas.height = 480;
	canvas.width = 512;
	document.body.appendChild(canvas);

	var ctx = canvas.getContext("2d");

	requestAnimationFrame = window.requestAnimationFrame ||
							window.webkitRequestAnimationFrame ||
							window.msRequestAnimationFrame ||
							window.mozRequestAnimationFrame ||
							function(callback){
								window.setTimeout(callback,1000/60);
							};

	resources.load([
		"images/terrain.png",
		"images/sprites.png"
	]);
	resources.onReady(init);

	var terrainPattern;
	var lastTime;
	function main(){
		var now = Date.now();
		var dt = (now - lastTime) / 1000.0;

		update(dt);
		render();

		lastTime = now;
		requestAnimationFrame(main);
	}

	function init(){
		terrainPattern = ctx.createPattern(resources.get("images/terrain.png"),"repeat");
		lastTime = Date.now();
		main();
	}

	var player = {
		pos:[50,100],
		sprite:new Sprite("images/sprites.png",[0,0],[39,39],16,[0,1])
	}

	var enemy1 = {
		pos:[250,200],
		sprite:new Sprite("images/sprites.png",[0,78],[80,39],6,[0,1,2,3,2,1])
	}
	var enemy2 = {
		pos:[150,100],
		sprite:new Sprite("images/sprites.png",[0,78],[80,39],6,[0,1,2,3,2,1])
	}

	function update(dt){
		player.sprite.update(dt);
		enemy1.sprite.update(dt);
		enemy2.sprite.update(dt);
	}
	function render(){
		ctx.fillStyle = terrainPattern;
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		ctx.save();
		ctx.translate(player.pos[0], player.pos[1]);
		player.sprite.render(ctx);
		ctx.restore();

		ctx.save();
		ctx.translate(enemy1.pos[0], enemy1.pos[1]);
		enemy1.sprite.render(ctx);
		ctx.restore();

		ctx.save();
		ctx.translate(enemy2.pos[0], enemy2.pos[1]);
		enemy2.sprite.render(ctx);
		ctx.restore();
	}
});
```





