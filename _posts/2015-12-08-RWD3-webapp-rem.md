---

layout: post
title: 关于响应式布局的总结与思考(三)-rem，web app页面设计的选择
tags:  [响应式布局,Responsive Web Design,media query,REM,EM]
categories: [响应式布局]
author: Yingside
excerpt: "这一篇主要是对响应式布局常见用法的一个总结，最后的代码给出了一个根据页面宽度计算font-size大小的js，大家可以试着用用效果"

---

这篇文章并非原创，来自 [腾讯ISUX](http://isux.tencent.com/web-app-rem.html)

为什么web app要使用rem？
-----------------

这里我特别强调web app，web page就不能使用rem吗，其实也当然可以，不过出于兼容性的考虑在web app下使用更加能突显这个单位的价值和能力，接下来我们来看看目前一些企业的web app是怎么做屏幕适配的。

### 1、实现强大的屏幕适配布局：

最近iphone6一下出了两款尺寸的手机，导致的移动端的屏幕种类更加的混乱，记得一两年前做web app有一种做法是以320宽度为标准去做适配，超过320的大小还是以320的规格去展示，这种实现方式以淘宝web app为代表作，但是近期手机淘宝首页进行了改版，采用了rem这个单位，首页以内依旧是和以前一样各种混乱，有定死宽度的页面，也有那种流式布局的页面。

我们现在在切页面布局的使用常用的单位是px，这是一个绝对单位，web app的屏幕适配有很多中做法，例如：流式布局、限死宽度，还有就是通过响应式来做，但是这些方案都不是最佳的解决方法。

例如流式布局的解决方案有不少弊端，它虽然可以让各种屏幕都适配，但是显示的效果极其的不好，因为只有几个尺寸的手机能够完美的显示出视觉设计师和交互最想要的效果，但是目前行业里用流式布局切web app的公司还是挺多的，看看下面我收集的一些案例：

![amazon.jpeg](/assets/images/2015-12-09-amazon.jpg)![xiecheng.jpeg](/assets/images/2015-12-09-xiecheng.jpg)

上面的网站都是采用的流式布局的技术实现的，他们在页面布局的时候都是通过百分比来定义宽度，但是高度大都是用px来固定住，所以在大屏幕的手机下显示效果会变成有些页面元素宽度被拉的很长，但是高度还是和原来一样，实际显示非常的不协调，这就是流式布局的最致命的缺点，往往只有几个尺寸的手机下看到的效果是令人满意的，其实很多视觉设计师应该无法接受这种效果，因为他们的设计图在大屏幕手机下看到的效果相当于是被横向拉长来一样。

流式布局并不是最理想的实现方式，通过大量的百分比布局，会经常出现许多兼容性的问题，还有就是对设计有很多的限制，因为他们在设计之初就需要考虑流式布局对元素造成的影响，只能设计横向拉伸的元素布局，设计的时候存在很多局限性。

### 2.固定宽度做法

还有一种是固定页面宽度的做法，早期有些网站把页面设置成320的宽度，超出部分留白，这样做视觉，前端都挺开心，视觉在也不用被流式布局限制自己的设计灵感了，前端也不用在搞坑爹的流式布局。但是这种解决方案也是存在一些问题，例如在大屏幕手机下两边是留白的，还有一个就是大屏幕手机下看起来页面会特别小，操作的按钮也很小，手机淘宝首页起初是这么做的，但近期改版了，采用了rem。

### 3.响应式做法

响应式这种方式在国内很少有大型企业的复杂性的网站在移动端用这种方法去做，主要原因是工作大，维护性难，所以一般都是中小型的门户或者博客类站点会采用响应式的方法从web page到web app直接一步到位，因为这样反而可以节约成本，不用再专门为自己的网站做一个web app的版本。

### 4.设置viewport进行缩放

天猫的web app的首页就是采用这种方式去做的，以320宽度为基准，进行缩放，最大缩放为320\*1.3 = 416，基本缩放到416都就可以兼容iphone6 plus的屏幕了，这个方法简单粗暴，又高效。说实话我觉得他和用接下去我们要讲的rem都非常高效，不过有部分同学使用过程中反应缩放会导致有些页面元素会糊的情况。

```html
<meta name="viewport" content="width=320,maximum-scale=1.3,user-scalable=no">
```

rem能等比例适配所有屏幕
-------------

上面讲了一大堆目前大部分公司主流的一些web app的适配解决方案，接下来讲下rem是如何工作的，这个在上一章已经讲解过大体意思。

上面说过rem是通过根元素进行适配的，网页中的根元素指的是html我们通过设置html的字体大小就可以控制rem的大小。举个例子：

```css
html{
   font-size:20px;
}
 .btn {
   width: 6rem;
   height: 3rem;
   line-height: 3rem;
   font-size: 1.2rem;
   display: inline-block;
   background: #06c;
   color: #fff;
   border-radius: .5rem;
   text-decoration: none;
   text-align: center;
}

```

上面代码结果按钮大小如下图：

![btn1](/assets/images/2015-12-09-btn1.png)

我把html设置成20px，那么6rem等于120px。如果这个时候我们的.btn的样式不变，我们再改变html的font-size的值，看看按钮发生上面变化:

```css
html{
    font-size:40px;
}
```

现在，按钮大小结果如下：

![btn2](/assets/images/2015-12-09-btn2.png)

上面的width，height变成了上面结果的两倍，我们只改变了html的font-size，但.btn样式的width,height的rem设置的属性不变的情况下就改变了按钮在web中的大小。

其实从上面两个案例中我们就可以计算出1px多少rem:

第一个例子：

120px = 6rem \* 20px(根元素设置大值)

第二个例子：

240px = 6rem \* 40px(根元素设置大值)

这些在上一章都详细说过，就不再细说了，接下来要做的事情，就是自动改变**html**属性里面**font-size**的值，看下面的例子：

```html

<!DOCTYPE html>
<html lang="zh">

<head>
    <meta charset="UTF-8">
    <title>rem phone test</title>
    <meta name="viewport" content="user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <style>
        html {
            height: 100%;
            width: 100%;
            font-family: 'Heiti SC', 'Microsoft YaHei';
            font-size: 20px;
            overflow: hidden;
            outline: 0;
            -webkit-text-size-adjust:none;
        }
        body {
            height: 100%;
            margin: 0;
            overflow: hidden;
            -webkit-user-select: none;
            position: relative;
        }
        header,
        footer {
            width: 100%;
            line-height: 1.5rem;
            font-size: 1rem;
            color: #000;
            border: 1px solid #ccc;
            text-align: center;
            background-color: #ccc;
        }
        .bd {
            margin-top: 1rem;
            margin-bottom: .5rem;
            margin-right: -.5rem;
            font-size: 0;
        }
        .box {
            width: 5rem;
            height: 5rem;
            display: inline-block;
            margin-right:.5rem;
            margin-bottom: .5rem;
        }
        .blue-box {
            background-color: #06c;
        }
        .org-box {
            background-color: #1fc195;
        }
    </style>
    
</head>

<body>

    <header>我是头部</header>


    <div class="bd">
        <div class="box blue-box"></div>
        <div class="box org-box"></div>
        <div class="box blue-box"></div>
        <div class="box org-box"></div>
        <div class="box blue-box"></div>
        <div class="box org-box"></div>
    </div>


    <footer>我是页脚</footer>
    
    <script>
        (function (doc, win) {
          var docEl = doc.documentElement,
            resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
            recalc = function () {
              var clientWidth = docEl.clientWidth;
              if (!clientWidth) return;
              docEl.style.fontSize = 20 * (clientWidth / 320) + 'px';
            };

          if (!doc.addEventListener) return;
          win.addEventListener(resizeEvt, recalc, false);
          doc.addEventListener('DOMContentLoaded', recalc, false);
        })(document, window);
    </script>
</body>

</html>
```

这里只是通过一段js根据浏览器当前的分辨率改变font-size的值，就简单的实现了上面的效果，页面的所有元素都不需要进行任何改变。

可以通过JS去动态计算根元素的font-size，这样的好处是所有设备分辨率都能兼容适配，淘宝首页目前就是用的JS计算。但其实不用JS我们也可以做适配，一般我们在做web app都会先统计自己网站有哪些主流的屏幕设备，然后去针对那些设备去做media query设置也可以实现适配，例如下面这样：

```css
html {
    font-size : 20px;
}
@media only screen and (min-width: 401px){
    html {
        font-size: 25px !important;
    }
}
@media only screen and (min-width: 428px){
    html {
        font-size: 26.75px !important;
    }
}
@media only screen and (min-width: 481px){
    html {
        font-size: 30px !important; 
    }
}
@media only screen and (min-width: 569px){
    html {
        font-size: 35px !important; 
    }
}
@media only screen and (min-width: 641px){
    html {
        font-size: 40px !important; 
    }
}
```