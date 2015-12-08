---

layout: post
title: 关于响应式布局的总结与思考(二)-px,em与rem
tags:  [响应式布局,Responsive Web Design,media query,REM,EM]
categories: [响应式布局]
author: Yingside
excerpt: "通过字体计量单位来设计页面布局,是现在移动端的主要布局方式,不过还是首先要搞清楚这几个是用来干嘛的."

---

![](/assets/images/2015-12-08-fontsize.jpg)

## 一.PX

px像素（Pixel）。相对长度单位。像素px是相对于显示器屏幕分辨率而言的.这个单位应该不用多说,大家用得最多。在Web页面初期制作中，我们都是使用`px`来设置我们的文本，因为他比较稳定和精确。但是这种方法存在一个问题，当用户在浏览器中浏览我们制作的Web页面时，他改变了浏览器的字体大小，这时会使用我们的Web页面布局被打破。这样对于那些关心自己网站可用性的用户来说，就是一个大问题了。因此，这时就提出了使用`em`来定义Web页面的字体。

## 二.EM

em是相对长度单位。相对于当前对象内文本的字体尺寸。如当前对行内文本的字体尺寸未被人为设置，则相对于浏览器的默认字体尺寸。

**任意浏览器的默认字体高都是16px。所有未经调整的浏览器都符合:**

```css
1em=16px
```

那么

```css
12px=0.75em
10px=0.625em
```


`em`需要一个参考点，一般都是以`<body>`的`font-size`为基准。比如说我们使用`1em=10px`来改变默认值`1em=16px`，这样一来，我们设置字体大小相当于`14px`时，只需要将其值设置为`1.4em`。也就是说只需要将你的原来的px数值除以10，然后换上em作为单位就行了。

```css
body {
	font-size: 62.5%;/*10 ÷ 16 × 100% = 62.5%*/
}
h1 {
	font-size: 2.4em; /*2.4em × 10 = 24px */
}
p {
	font-size: 1.4em; /*1.4em × 10 = 14px */
}
li {
	font-size: 1.4em; /*1.4 × ? = 14px ? */
}
```


为什么`li`的`1.4em`是不是`14px`是一个问号呢？如果你了解过`em`后，你会觉得这个问题是多问的。前面也简单的介绍过一回，在使用`em`作单位时，一定需要知道其父元素的设置，因为`em`就是一个相对值，而且是一个相对于父元素的值，其真正的计算公式是：

```css
1 ÷ 父元素的font-size × 需要转换的像素值 = em值
```

这样的情况下`1.4em`可以是`14px`,也可以是`20px`，或者说是`24px`，总之是一个不确定值，那么解决这样的问题，要么你知道其父元素的值，要么呢在任何子元素中都使用`1em`

说的有点绕口了...直接看看下面的例子：

**em会继承父元素的字体大小**


**css:**

```css
body{font-size: 16px;}
p{font-size:0.75em;}
span{font-size:2em;}
```

**html:**

```html
<html>
我大小为16px;
<p>
  段落文字大小为12px(16*0.75);
  <span>
    我大小是2em，即24px，这里是相对父级字号*2的，而不是相对body里面的16px
  </span>
</p>
</html>
```

如果你确实需要查看详细的对应关系，这个网站提供一个px,em,rem单位转换工具

地址：[http://pxtoem.com/](http://pxtoem.com/)

![](/assets/images/2015-12-08-pxtoem.png)

## 三.REM

`CSS3`的出现，他同时引进了一些新的单位，包括我们今天所说的rem。在W3C官网上是这样描述`rem`的——`font size of the root element` 。下面我们就一起来详细的了解`rem`。

前面说了`em`是相对于其父元素来设置字体大小的，这样就会存在一个问题，进行任何元素设置，都有可能需要知道他父元素的大小，在我们多次使用时，就会带来无法预知的错误风险。而`rem`是相对于根元素`<html>`，这样就意味着，我们只需要在根元素确定一个参考值.

大家看下面的代码:

```css
html {font-size: 62.5%;/*10 ÷ 16 × 100% = 62.5%*/}
body {font-size: 1.4rem;/*1.4 × 10px = 14px */}
h1 { font-size: 2.4rem;/*2.4 × 10px = 24px*/}
```
我在根元素`<html>`中定义了一个基本字体大小为`62.5%`（也就是`10px`。设置这个值主要方便计算，如果没有设置，将是以`16px`为基准 ）。从上面的计算结果，我们使用`rem`就像使用`px`一样的方便，而且同时解决了`px`和`em`两者不同之处。

**恩，理想很丰满，但现实很骨感，看下面的代码:**

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Document</title>
	<style type="text/css">
		html {
			font-size: 62.5%;/*10 ÷ 16 × 100% = 62.5%*/
		}
		div{
			width: 5rem;
			height: 5rem;
			background: #ccc;
		}
		a{
			display: block;
			padding: 1rem;
			height: 3rem;
			line-height: 3rem;
			font-size: 1.8rem;
			text-decoration: none;
		}
	</style>
</head>
<body>
	<div>
		<a href="#"><span>点击</span></a>
	</div>
</body>
</html>
```
根据上面的理论，div的宽高设置是`5rem`，那么就应该是`50*50`的宽高，而`a`标签里面的`padding`,`height`,`line-height`,`font-size`都应该是10的倍数才对，但是实际情况呢？

这是这段代码在`chrome`浏览器上测试的结果

这是 `div` 的大小：

![](/assets/images/2015-12-08-chrome-12px-1.png)

`a` 标签的大小：

![](/assets/images/2015-12-08-chrome-12px-2.png)

`span`标签的大小
![](/assets/images/2015-12-08-chrome-12px-3.png)

![](/assets/images/2015-12-08-chrome-12px-4.png)

可以很明显的看出，明明都设置了`html:62.5%`，也就是`10px`，但是实际却是除了`a`标签的`font-size`，其他都是按照`12px`在进行计算。但是同样的效果，我们在Safari浏览器上试试，如图：
![](/assets/images/2015-12-08-Safari-10px-1.png)
![](/assets/images/2015-12-08-Safari-10px-2.png)
![](/assets/images/2015-12-08-Safari-10px-3.png)
![](/assets/images/2015-12-08-Safari-10px-4.png)

为什么会出现这个情况呢？

原来在中文版的chrome浏览器中，会默认设定页面的最小字号是12px，英文版则没有这个限制，主要是因为chrome认为汉字小于12px就会增加识别难度，尤其是中文常用的宋体和微软雅黑。

修复的办法可以使用下面的属性：

```css
/*-webkit-text-size-adjust: none;*/
-webkit-text-size-adjust: 100%;
```
但是不幸得是，这个css属性在桌面版的chrome浏览器上并不支持，只有移动端的才支持此属性。
(上面注释的部分是让chrome浏览器不会自动调整字体，但是会屏蔽chrome浏览器调整大小，就是使用鼠标滚轮将浏览器字体方法或缩小。这个属性在高版本的chrome浏览器中已经被废除了，但是看很多现在的主流手机页面还在使用这个属性，列出来大家知道混了脸熟...)
所以要想在PC上做测试，使用这个属性是不可能的。当然还有人说使用scale属性，我觉得用这个就走远了，这里还是给大家列出来吧，但是不建议使用。很简单，启用的缩放...肯定又会有其他的坑要填。

```
.chrome_font_adjust {
    font-size: 10px;
    -webkit-transform: scale(0.75);
    -o-transform: scale(1);    //针对能识别-webkit的opera browser设置
}
```

那怎么办呢？网上很多信誓旦旦的说 `font-size:62.5%`几乎都是没有考虑实际中文的开发情况的，要么就是照搬的英文翻译。所以，我觉得设置还是具体问题具体分析，一定要有一种方案的话，我觉得初始在根目录上设置移动端页面宽度最大值比较好。这个什么意思？我们在下一章讨论，大家可以提前先看一看淘宝的页面设计

[手机淘宝首页](https://m.taobao.com/#index)

这一篇我们又介绍了REM与EM，这个和我们要讲的响应式有什么关系呢？下一篇我们再分析。














