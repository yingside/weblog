---

layout: post
title: 通过简单游戏建立js模块化思维(四)--游戏控制
tags:  [HTML5,Canvas,javascript模式]
categories: [Canvas]
author: Yingside
excerpt: "前面基本的和最难理解的部分基本上完了，接下来就很简单了，无非就是自己的飞机要懂，敌机要动，要打出子弹等等。由于已经做好了Sprite模块，所以只需要关心图片基本的移动就好了"

---

## 一.键盘操作模块

这个模块就很简单了，无非就是键盘按键，按下保存到对象中为true，松开为false，这个前面的[简单动画](http://www.yingside.com/2015/11/18/simple-canvas-game)就有类似的，不懂的可以先去看看，怎么处理键盘按下事件的，这里稍微做了修改。基本思路是一致的。直接上代码：

**input.js**

```javascript
define(function(){
	var keys = {};

	function setKeys(e,status){
		var code = e.keyCode;
		var key;

		switch(code){
			case 32:
				key = "SPACE";
				break;
			case 37:
				key = "LEFT";
				break;
			case 38:
				key = "UP";
				break;
			case 39:
				key = "RIGHT";
				break;
			case 40:
				key = "DOWN";
				break;	
			default:
				key = String.fromCharCode(code);
				break;
		}
		keys[key.toUpperCase()] = status;
	}

	window.addEventListener('keydown',function(e){
		setKeys(e,true);
	},false);

	window.addEventListener('keyup',function(e){
		setKeys(e,false);
	},false)

	window.addEventListener('blue',function(){
		keys = {};
	},false);

	return input = {
		isDown:function(key){
			return keys[key.toUpperCase()];
		}
	};
});
```
当然，`app.js`需要使用的话，还是需要引入`input.js`模块

```javascript
require(['resources',"sprite","input"],function(resources,Sprite,input){
	//......
});
```

## 二.app.js处理键盘事件

现在首先做的很简单，就是判断键盘按下了上下左右的哪个键，然后自己飞机的位置做相应的加减就好了，可以封装一个函数`handInput(dt)`用来专门处理键盘按下事件。

```javascript
var playerSpeed = 200;
function handInput(dt){
	if(input.isDown("DOWN")){
		player.pos[1] += playerSpeed * dt
	}
	if(input.isDown("UP")){
		player.pos[1] -= playerSpeed * dt
	}
	if(input.isDown("LEFT")){
		player.pos[0] -= playerSpeed * dt
	}
	if(input.isDown("RIGHT")){
		player.pos[0] += playerSpeed * dt
	}
}
```

这个函数放在`update(dt)`函数中调用一下就好了。现在，我们自己的飞机就能自己操控了。

## 三.打出一发子弹

当然，键盘按下还要处理当键盘按下空格的时候，要打出子弹。无论怎么样，我们先按一下打出一发子弹。

```javascript
	var bullet = null;
	var playerSpeed = 200;
	function handInput(dt){
		if(input.isDown("DOWN")){
			player.pos[1] += playerSpeed * dt
		}
		if(input.isDown("UP")){
			player.pos[1] -= playerSpeed * dt
		}
		if(input.isDown("LEFT")){
			player.pos[0] -= playerSpeed * dt
		}
		if(input.isDown("RIGHT")){
			player.pos[0] += playerSpeed * dt
		}

		if(input.isDown("SPACE")){
			var x = player.pos[0] + player.sprite.size[0] / 2;
			var y = player.pos[1] + player.sprite.size[1] / 2;
			bullet = {
				pos: [x,y],
				sprite: new Sprite("images/sprites.png",[0,39],[18,8])
			}
		}
	}
```
这里当按下空格键，也就是`input.isDown("SPACE")`为true的时候，创建一发子弹，子弹位置就放在飞机机身正中。当然这只是创建了对象，还是要画到画布上，当然就是在`render()`函数里面添加了

```javascript
function render(){
	//...此处省略
    if(bullet != null){
		ctx.save();
		ctx.translate(bullet.pos[0], bullet.pos[1]);
		bullet.sprite.render(ctx);
		ctx.restore();
	}
}
```
这里只有一个子弹，而且是按下空格之后才创建，所以只有先判断一下不为null再去画它。来看一下现在`app.js`完整的代码：

**app.js**

```javascript
require(['resources',"sprite","input"],function(resources,Sprite,input){
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
		pos:[0,0],
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

	var bullet = null;
	var playerSpeed = 200;
	function handInput(dt){
		if(input.isDown("DOWN")){
			player.pos[1] += playerSpeed * dt
		}
		if(input.isDown("UP")){
			player.pos[1] -= playerSpeed * dt
		}
		if(input.isDown("LEFT")){
			player.pos[0] -= playerSpeed * dt
		}
		if(input.isDown("RIGHT")){
			player.pos[0] += playerSpeed * dt
		}

		if(input.isDown("SPACE")){
			var x = player.pos[0] + player.sprite.size[0] / 2;
			var y = player.pos[1] + player.sprite.size[1] / 2;
			bullet = {
				pos: [x,y],
				sprite: new Sprite("images/sprites.png",[0,39],[18,8])
			}
		}
	}

	function update(dt){
		handInput(dt);
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

		if(bullet != null){
			ctx.save();
			ctx.translate(bullet.pos[0], bullet.pos[1]);
			bullet.sprite.render(ctx);
			ctx.restore();
		}
	}
});
```

## 四.封装子弹与敌机数组

现在的问题当然很明显了，子弹和敌机都是会成堆出现的，而且都有自己移动的方式，现在它们都还是静止的。而且现在的代码太多的冗余，需要稍微封装一下。有很多东西要封装，首相想到的当然是数组。所以，我们把子弹和敌机都封装一个数组。

```javascript
var bullets = [];
var enemies = [];
```

子弹和敌机肯定都要移动，所以，先给出子弹和敌机的速度

```javascript
var bulletSpeed = 500;
var enemySpeed = 150;
```

当按下空格键时，无非就是有了一发子弹，并且我们把这发子弹先放入到子弹数组中

```javascript
function handInput(dt){
	//......
    if(input.isDown("SPACE")){
		var x = player.pos[0] + player.sprite.size[0] / 2;
		var y = player.pos[1] + player.sprite.size[1] / 2;
		bullets.push({
			pos: [x,y],
			sprite: new Sprite("images/sprites.png",[0,39],[18,8])
		});
	}
}
```

而敌机是随机出现的，而且需要隔一段时间出现一个，我们可以认为的设置这个时间隔断，比如生成一个随机值，当这个值大于或者小于多少的时候就生成一架敌机

```javascript
function update(dt){
	//......
    if(Math.random() < 0.02){
		enemies.push({
			pos: [canvas.width,Math.floor(Math.random()*(canvas.height-39))],
			sprite: new Sprite("images/sprites.png",[0,78],[80,39],6,[0,1,2,3,2,1])
		})
	}
}
```
敌机生成的位置，横坐标始终在画布的最后，纵坐标随机。

现在生成数组的问题解决了，接下来就是`update(dt)`和`render()`的问题了，子弹和敌机既然在数组中，肯定要循环了，所以，具体看下面封装

```javascript
	function update(dt){
		handInput(dt);
		updateEntities(dt);
		if(Math.random() < 0.02){
			enemies.push({
				pos: [canvas.width,Math.floor(Math.random()*(canvas.height-39))],
				sprite: new Sprite("images/sprites.png",[0,78],[80,39],6,[0,1,2,3,2,1])
			})
		}
	}
	function updateEntities(dt){
		player.sprite.update(dt);

		enemies.forEach(function(enemy,i,arr){
			enemy.pos[0] -= enemySpeed * dt;
			enemy.sprite.update(dt);

			if(enemy.pos[0] < -80){
				arr.splice(i,1);
			}
		});
		bullets.forEach(function(b,i,arr){
			b.pos[0] += bulletSpeed * dt;

			if(b.pos[0] > canvas.width){
				arr.splice(i,1);
			}
		});
	}
	function render(){
		ctx.fillStyle = terrainPattern;
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		renderEntity(player);
		renderEntities(enemies);
		renderEntities(bullets);
	}
	function renderEntities(list){
		for (var i = 0; i < list.length; i++) {
			renderEntity(list[i]);
		};
	}
	function renderEntity(entity){
		ctx.save();
		ctx.translate(entity.pos[0], entity.pos[1]);
		entity.sprite.render(ctx);
		ctx.restore();
	}
```
代码很简单，无非就是把要循环的代码单独提出来，在封装了一个函数。敌机和子弹，一个向左飞，一个向右飞，循环两个数组，判断出了界限之后，当前对象从数组中删除就好。

现在基本上子弹飞，敌机移动，和自己飞机的控制都好了，有点小问题是按住空格之后，子弹发射太快，我们人为的加一点时间差进去就好

```javascript
var lastFire = Date.now();
function handInput(dt){
	//......
	if(input.isDown("SPACE") && Date.now()-lastFire > 100){
		var x = player.pos[0] + player.sprite.size[0] / 2;
		var y = player.pos[1] + player.sprite.size[1] / 2;
		bullets.push({
			pos: [x,y],
			sprite: new Sprite("images/sprites.png",[0,39],[18,8])
		});
		lastFire = Date.now();
	}
}
```

## 五.碰撞检测

最后自然就是碰撞检测了，这个之前已经说过很多次了，道理记住下面的**要诀**：

```
A元素有 ax,ay坐标,有aw宽度，ah高度
B元素有 bx,by坐标,有bw宽度，bh高度
1.A元素的ax <= B元素的 bx+bw
2.B元素的bx <= A元素的 ax+aw
3.A元素的ay <= B元素的 by+bh
4.B元素的by <= A元素的 ay+ah
```

所以，我们直接封装碰撞检测的函数

```javascript
	explosions = [];
	function updateEntities(dt){
    	//......
        explosions.forEach(function(ex,i,arr){
			ex.sprite.update(dt);

			if(ex.sprite.done){
				arr.splice(i,1);
			}
		});
    }
	function boxCollides(pos,size,pos2,size2){
		return collides(pos[0],pos[1],pos[0]+size[0],pos[1]+size[1],
			pos2[0],pos2[1],pos2[0]+size2[0],pos2[1]+size2[1]);
	}

	function collides(x,y,r,b,x2,y2,r2,b2){
		return (x <= r2 && x2 <= r && y <= b2 && y2 <= b);
	}

	function checkCollision(){
		for (var i = 0; i < enemies.length; i++) {
			var pos = enemies[i].pos;
			var size = enemies[i].sprite.size

			for (var j = 0; j < bullets.length; j++) {
				var pos2 = bullets[j].pos;
				var size2 = bullets[j].sprite.size;

				if(boxCollides(pos,size,pos2,size2)){
					enemies.splice(i,1);
					i --;

					explosions.push({
						pos: pos,
						sprite: new Sprite(
							"images/sprites.png",
							[0,117],
							[39,39],
							16,
							[0,1,2,3,4,5,6,7,8,9,10,11,12],
							null,
							true
						)
					});
				}
			};
		};
	}
    function render(){
		//......
		renderEntities(explosions);
	}
```

里面的代码就不一一解释了，无非就是子弹碰撞到敌机的时候就会加入一个爆炸效果，而爆炸效果和之前一样都是需要update与render的。

就这样，一个基于模块的飞机游戏的大体架构就出来了，最后贴出所有代码，还有一些功能没有完善。比如自己飞机碰撞敌机死亡，飞机移出边界，积分等等，就交给大家去完成了。

**app.js**

```javascript
require(['resources',"sprite","input"],function(resources,Sprite,input){
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
		pos:[0,0],
		sprite:new Sprite("images/sprites.png",[0,0],[39,39],16,[0,1])
	}

	var enemies = [];
	var bullets = [];
	var explosions = [];

	var bullet = null;
	var bulletSpeed = 500;
	var playerSpeed = 200;
	var enemySpeed = 150;
	var lastFire = Date.now();
	function handInput(dt){
		if(input.isDown("DOWN")){
			player.pos[1] += playerSpeed * dt
		}
		if(input.isDown("UP")){
			player.pos[1] -= playerSpeed * dt
		}
		if(input.isDown("LEFT")){
			player.pos[0] -= playerSpeed * dt
		}
		if(input.isDown("RIGHT")){
			player.pos[0] += playerSpeed * dt
		}

		if(input.isDown("SPACE") && Date.now()-lastFire > 100){
			var x = player.pos[0] + player.sprite.size[0] / 2;
			var y = player.pos[1] + player.sprite.size[1] / 2;
			bullets.push({
				pos: [x,y],
				sprite: new Sprite("images/sprites.png",[0,39],[18,8])
			});
			lastFire = Date.now();
		}
	}

	function update(dt){
		handInput(dt);
		updateEntities(dt);
		
		if(Math.random() < 0.02){
			enemies.push({
				pos: [canvas.width,Math.floor(Math.random()*(canvas.height-39))],
				sprite: new Sprite("images/sprites.png",[0,78],[80,39],6,[0,1,2,3,2,1]) 
			})
		}

		checkCollision();
	}
	function updateEntities(dt){
		player.sprite.update(dt);

		enemies.forEach(function(enemy,i,arr){
			enemy.pos[0] -= enemySpeed * dt;
			enemy.sprite.update(dt);

			if(enemy.pos[0] < -80){
				arr.splice(i,1);
			}
		});
		bullets.forEach(function(b,i,arr){
			b.pos[0] += bulletSpeed * dt;

			if(b.pos[0] > canvas.width){
				arr.splice(i,1);
			}
		});
		explosions.forEach(function(ex,i,arr){
			ex.sprite.update(dt);

			if(ex.sprite.done){
				arr.splice(i,1);
			}
		});
	}
	function boxCollides(pos,size,pos2,size2){
		return collides(pos[0],pos[1],pos[0]+size[0],pos[1]+size[1],
			pos2[0],pos2[1],pos2[0]+size2[0],pos2[1]+size2[1]);
	}

	function collides(x,y,r,b,x2,y2,r2,b2){
		return (x <= r2 && x2 <= r && y <= b2 && y2 <= b);
	}

	function checkCollision(){
		for (var i = 0; i < enemies.length; i++) {
			var pos = enemies[i].pos;
			var size = enemies[i].sprite.size

			for (var j = 0; j < bullets.length; j++) {
				var pos2 = bullets[j].pos;
				var size2 = bullets[j].sprite.size;

				if(boxCollides(pos,size,pos2,size2)){
					enemies.splice(i,1);
					i --;

					explosions.push({
						pos: pos,
						sprite: new Sprite(
							"images/sprites.png",
							[0,117],
							[39,39],
							16,
							[0,1,2,3,4,5,6,7,8,9,10,11,12],
							null,
							true
						)
					});
				}
			};
		};
	}
	function render(){
		ctx.fillStyle = terrainPattern;
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		renderEntity(player);
		renderEntities(enemies);
		renderEntities(bullets);
		renderEntities(explosions);
	}
	function renderEntities(list){
		for (var i = 0; i < list.length; i++) {
			renderEntity(list[i]);
		};
	}
	function renderEntity(entity){
		ctx.save();
		ctx.translate(entity.pos[0], entity.pos[1]);
		entity.sprite.render(ctx);
		ctx.restore();
	}
});
```

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

**input.js**

```javascript
define(function(){
	var keys = {};

	function setKeys(e,status){
		var code = e.keyCode;
		var key;

		switch(code){
			case 32:
				key = "SPACE";
				break;
			case 37:
				key = "LEFT";
				break;
			case 38:
				key = "UP";
				break;
			case 39:
				key = "RIGHT";
				break;
			case 40:
				key = "DOWN";
				break;	
			default:
				key = String.fromCharCode(code);
				break;
		}
		keys[key.toUpperCase()] = status;
	}

	window.addEventListener('keydown',function(e){
		setKeys(e,true);
	},false);

	window.addEventListener('keyup',function(e){
		setKeys(e,false);
	},false)

	window.addEventListener('blue',function(){
		keys = {};
	},false);

	return input = {
		isDown:function(key){
			return keys[key.toUpperCase()];
		}
	};
});
```





