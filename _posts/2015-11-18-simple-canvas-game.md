---

layout: post
title: 怎样用HTML5 Canvas制作一个简单的游戏
tags:  [HTML5,Canvas]
categories: [Canvas]
author: Yingside
excerpt: "为了让大家清楚HTML5制作游戏的简单流程，所以先了制作一个非常简单的游戏，其实重点是讲解怎么用新的定时器办法，代替setInterval和setTimeout,让程序保留一个定时器主循环,为引出以后的模块化做准备"

---


# 怎样用HTML5 Canvas制作一个简单的游戏 #

这篇文章是翻译了翻译自[How to make a simple HTML5 Canvas game](http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/),对原文进行了一定修改,大家可以从中学到在一个较为复杂环境中，如何用一个更好的方式来使用定时器，让程序保留一个定时器主循环，就可以刷新多项内容

为了让大家清楚HTML5制作游戏的简单流程，所以先了制作一个非常简单的游戏，来看一看这个过程。  
游戏非常简单，无非就是英雄抓住怪物就得分，然后游戏重新开始，怪物出现在地图的随机位置，英雄初始化在地图的中间。点击[这里](http://download.csdn.net/detail/ying422/9281025)，我们可以直接下载这个游戏

![simple_game](/assets/images/2015-11-18-simple-canvas-game.png)

## 1. 创建一个Canvas对象 ##

这里相信大家都知道，当然代码里面是通过JS动态创建的画布，大家也可以直接在HTML页面上先创建画布，然后再通过`document.getELementById()`来获取，这两种方法没有什么区别，只是看你更习惯哪一种。

```javascript
	// 创建画布canvas,并获取画布上下文环境
	var canvas = document.createElement("canvas");
	var ctx = canvas.getContext("2d");
	canvas.width = 512;
	canvas.height = 480;  
	document.body.appendChild(canvas);
```

## 2. 载入图片 ##

游戏需要图像，所以让我们载入一些图片吧。我想尽量简单化，所以只用了Image对象来做，当然，还可以将载入图像的功能封装成一个类或别的任何形式。代码中的bgReady用来标识图片是否已完全载入，只有当图片载入完成后，我们才能使用它，如果在载入完成前就对其进行绘制或渲染，JS将会报一个DOM error的错误。

我们会用到三张图片（背景、英雄、怪物），每张图片都需要这样处理。  

```javascript
	// 背景图片 bgImage
	var bgReady = false;
	var bgImage = new Image();
	bgImage.onload = function () {
	    bgReady = true;
	};
	bgImage.src = "images/background.png";  
```

这里需要注意的一点，把`bgImage.src`写在`bgImage.onload`之后是为了解决IE显示的bug，所以建议大家都这么么写。

## 3. 定义游戏要使用的对象 ##

```javascript
	// 游戏对象
	var hero = {
	    speed: 256, // 英雄每秒移动的速度，即256px/s
	    x: 0,
	    y: 0
	};
	var monster = {
	    x: 0,
	    y: 0
	};
	var monstersCaught = 0;
```

定义一些变量，稍后会用到。hero对象的speed属性表示英雄的移动速度（像素/秒）；monster对象不会移动，所以仅仅具有一对坐标；monstersCaught表示玩家抓住的怪物数量。 

## 4. 处理玩家输入 ##

```javascript
	// 键盘 输入处理 
	var keysDown = {};
	addEventListener("keydown", function (e) {
	     keysDown[e.keyCode] = true;
	}, false);
	addEventListener("keyup", function (e) {
	     delete keysDown[e.keyCode];
	}, false);
```

用户到底按下了哪个键，通过键盘事件来处理，将按下的键的keyCode保存在空对象KeysDown中。如果该变量中具有某个键编码，就表示用户目前正按下这个键。  

## 5. 新游戏 ##

```javascript
	// 当英雄捉住怪物之后重新开始游戏，英雄的位置在画布中间，怪物位置随机  
	var reset = function () {  
	     hero.x = canvas.width / 2;  
	     hero.y = canvas.height / 2;  

	     // 将怪物位置随机放在地图上，当然不能超过地图。  
	     monster.x = 32 + (Math.random() * (canvas.width - 64));  
	     monster.y = 32 + (Math.random() * (canvas.height - 64));  
	};
```

通过调用reset函数来开始新游戏。该函数将英雄（即玩家角色）放到屏幕中间，然后随机选择一个位置来安置怪物。

## 6. 更新对象 ##

```javascript
	// 更新游戏对象
	var update = function (modifier) {
	    if (38 in keysDown) { // 上
	        hero.y -= hero.speed * modifier;
	    }
	    if (40 in keysDown) { // 下
	        hero.y += hero.speed * modifier;
	    }
	    if (37 in keysDown) { // 左
	        hero.x -= hero.speed * modifier;
	    }
	    if (39 in keysDown) { // 右
	        hero.x += hero.speed * modifier;
	    }

	    // 是否捉住怪物
	    if (
	        hero.x <= (monster.x + 32)
	            && monster.x <= (hero.x + 32)
	            && hero.y <= (monster.y + 32)
	            && monster.y <= (hero.y + 32)
	    ) {
	         ++monstersCaught;
	         reset();
	    }
	};
```

update有一个modifier参数，这看起来好像有点奇怪。你会在游戏的主函数即main函数中看到它，不过我在这儿先解释一下。modifier参数是一个从1开始的与时间相关的数。如果间隔刚好为1秒时，它的值就会为1，英雄移动的距离即为256像素（英雄的速度为256像素/秒）；而如果间隔是0.5秒，它的值就为0.5，即英雄移动的距离为其速度的一半，以此类推。通常update函数调用的间隔很短，所以modifier的值很小，但用这种方式能够确保不管代码执行的速度怎么样，英雄的移动速度都是相同的。

这和我们之前的做法是不一样的，我们之前的做法经常是向右移动 `x += spped`，向左移动 `x -=  speed`,之前的这种做法，相当于已经给定了物体移动的速度，无论是什么机器，都必须保证，每次移动的距离是`speed`的长度。

我们已经实现了根据用户的输入来移动英雄，但我们还可以在移动英雄时对其进行检查，以确定是否有其他事件发生。例如：英雄是否与怪物发生了碰撞——当英雄与怪物发生碰撞时，我们为玩家进行计分（monstersCaught加1）并重置游戏（调用reset函数）。

## 7. 渲染对象 ##

```javascript
	// Draw everything
	var render = function () {
	    if (bgReady) {
	         ctx.drawImage(bgImage, 0, 0);
	    }

	    if (heroReady) {
	         ctx.drawImage(heroImage, hero.x, hero.y);
	    }

	    if (monsterReady) {
	         ctx.drawImage(monsterImage, monster.x, monster.y);
	    }

	    // Score
	    ctx.fillStyle = "rgb(250, 250, 250)";
	    ctx.font = "24px Helvetica";
	    ctx.textAlign = "left";
	    ctx.textBaseline = "top";
	    ctx.fillText("Goblins caught: " + monstersCaught, 32, 32);
	};
```

update函数相当于只是改变的值，而render函数则是绘制图案，当你能够看到你的行动时游戏才会变得更有趣，所以让我们在屏幕上绘制吧。首先我们将背景图片绘制到canvas，然后是英雄和怪物。注意顺序很重要，因为任何位于表层的图片都会将其下面的像素覆盖掉。

想一想，每次如果英雄的位置改变，那么我们会把所有的场景包括背景都重新绘制一次，那么你在界面上看到的就好像是英雄走了一步

接下来是文字，这有些不同，我们调用fillText函数显示玩家的分数。因为不需要复杂的动画或者对文字进行移动，所以只是绘制一下就ok了。

## 8. 游戏主循环 ##

```javascript
	// 游戏主循环
	var main = function () {
	    var now = Date.now();
	    var delta = now - then;

	    update(delta / 1000);
	    render();

	    then = now;

		requestAnimationFrame(main);
	};

	var w = window;
	requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;
```

游戏的主循环用来控制游戏流程。首先我们要获得当前的时间，这样我们才能计算时间差（自上次循环以来经过的时间）。然后计算modifier的值并交给update（需要将delta除以1000以将其转换为毫秒）。最后调用render并更新记录的时间。

游戏主循环是游戏中最重要的概念，无论游戏怎么变化，无非就是移动，消失。而移动消失，无非又是画布的重画，所以把移动或者消失的位置放在update函数里面，把画布重画放在render函数里面。而随着时间的变化，无非就是这两个函数函数一直在执行而已。

## 9. 开始游戏 ##

```javascript
	var then = Date.now();
	reset();
	main();
```

快完成了，这是最后一段代码。首先调用reset来开始新游戏。（还记得吗，这会将英雄置中并随机安放怪物）。然后将起始时间保存到变量then中并启动游戏的主循环。
