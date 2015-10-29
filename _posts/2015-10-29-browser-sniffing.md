---
layout: post
title: 浏览器嗅觉测探
tags:  [javascript,browser]
categories: [javascript]
author: Yingside
excerpt: "由于浏览器兼容性的存在,特别是IE浏览器,各个版本不同兼容性还不一样,所以通过js来判断到底是什么浏览器的什么版本,还是有必要的"

---

# javascript浏览器嗅觉测探

由于浏览器兼容性的存在,特别是IE浏览器,各个版本不同兼容性还不一样,所以通过js来判断到底是什么浏览器的什么版本,还是有必要的.

虽然现在大多数时候直接通过功能测探就能判断浏览器是否兼容,如:

```javascript

if(node.addEventListener){
	//......
}else if(node.attachEvent)(
	//......
)

```

这样就能判断是否是支持W3C的浏览器还是IE浏览器,但是如果在有些情况下还要判断的再仔细一点,功能测试就不够用了,比如判断是**IE10**,还是**IE11**......**IE10-**的版本是依循常规只支持attachEvent而不支持`addEventListener`，但到了IE11，却反过来只支持`addEventListener`而不支持`attachEvent`。光是这一点就可以判断IE是个大坑，IE11的存在可能会导致之前你写过的代码出现错乱.

另如原本可用

```javascript
var ieVersion = eval("''+/*@cc_on"+" @_jscript_version@*/-0")*1
```

嗅探脚本来判断是否IE，如果值非0则表示为IE浏览器，但到了**IE11**，也直接返回0了(即IE11不再识别@cc_on这个IE独有的条件编译语句)......

**Opera**已经抛弃了自家的**Presto**内核，转而跟进使用**Chrome**内核，导致的结果是，新版**Opera**不再支持`window.opera`，而且跟随**Chrome**浏览器支持`window.chrome`等系列**Chrome**特性，就连`userAgent`字样也去了`“opera”`并直接套用`Chromium/Blink`内核的`userAgent`信息（好事是在尾部还是保留了一句**OPR/XX.0**）




其实要解决这个问题很简单,我们有`window.navigator.userAgent`这个API就能知道每个浏览器的信息.

```javascript
//firefox
Mozilla/5.0 (Windows NT 10.0; WOW64; rv:40.0) Gecko/20100101 Firefox/40.0

//chrome
Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.130 Safari/537.36

//safari
Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/534.57.2 (KHTML, like Gecko) Version/5.1.7 Safari/534.57.2

//opera
Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.71 Safari/537.36 OPR/33.0.1990.43

```

首先解决下比较容易解决的**Firefox**,对比其它浏览器内核的ua信息它独有“Firefox/XX.0”字样，故我们可以这样判断：

```javascript
    var ua = window.navigator.userAgent;
    document.write(ua + "<br/>");
    var rFirefox = /(Firefox)\/([\w.]+)/;
    var matchBS = rFirefox.exec(ua);
    document.write(matchBS + "<br/>");
    if ((matchBS != null)&&(!(window.attachEvent))&&(!(window.chrome))&&(!(window.opera))) {
        document.write("这是火狐浏览器")
    }else{
        document.write("其他浏览器");
    }

```

这里还判断了是否支持`window.attachEvent` 和 `window.chrome、window.opera`事件，是为了防止其它非Firefox浏览器的伪装`ua`信息，但这点很难做到尽善尽美,其实简单判断 `matchBS != null`已经可以了

接着是**Safari**，虽然**Safari**的ua信息含有safari字样，但由于谷歌的浏览器是苹果浏览器内核WebKit的分支，导致**Chrome**的ua信息也含有safari字样.

这种情况只能**找不同**了，可以看到**Safari**的ua信息在`Safari/...`之前连着一个`Version/...`，而**Chrome**的ua信息是没有的，所以可以这样写：

```javascript
    var ua = window.navigator.userAgent;
    document.write(ua + "<br/>");
    var rSafari = /Version\/([\w.]+).*(Safari)/;
    var matchBS = rSafari.exec(ua);
    document.write(matchBS + "<br/>");
    if ((matchBS != null)&&(!(window.attachEvent))&&(!(window.chrome))&&(!(window.opera))) {
        document.write("这是苹果浏览器")
    }else{
        document.write("其他浏览器");
    }
```

接着说**Chrome**和**Opera**，这里比较头疼的一点...是**Chrome**的好基友**Opera**也开始使用了**Chromium或Blink**引擎，导致二者ua信息以及对BOM的支持几乎一致（这不废话么，内核都一样了），但还是可以从ua找不同：

于是我们可以这样写（注意Opera也要兼顾旧版本，也就是使用Presto内核的情况）：

```javascript
rOpera = /(Opera).+Version\/([\w.]+)/; 
rNewOpera = /(OPR)\/(.+)/;
rChrome = /(Chrome)\/([\w.]+)/;
//下面判断省略...
```

最后说下IE的识别吧，IE是个大坑

![](/assets/images/2015-10-29-browser-sniffing.png)

由上图可知，IE6/7从MSIE版本号直接判断即可，从IE8开始多了个Trident信息，则IE8-IE11只需判断Trident版本号。那么我们就可以自行写两个判断，先判断是否IE——即ua信息是否包含了MSIE信息或者Trident信息（注意IE11已经移除了MSIE信息），接着再判断是否IE7-或者IE8+ ：

```
	function sniffIE() {
		var ua = window.navigator.userAgent;
		rMsie = /(msie\s|trident\/7)([\w.]+)/;
		rTrident = /(trident)\/([\w.]+)/;
		matchBS = rMsie.exec(ua.toLowerCase());
		if (matchBS != null) {
			matchBS2 = rTrident.exec(ua.toLowerCase());
			if (matchBS2 != null) {
				switch (matchBS2[2]) {
					case "4.0":
						return {
							browser: "IE",
							version: "8"
						};
						break;
					case "5.0":
						return {
							browser: "IE",
							version: "9"
						};
						break;
					case "6.0":
						return {
							browser: "IE",
							version: "10"
						};
						break;
					case "7.0":
						return {
							browser: "IE",
							version: "11"
						};
						break;
					default:
						return {
							browser: "IE",
							version: "undefined"
						};
				}
			} else {
				return {
					browser: "IE",
					version: matchBS[2] || "0"
				};
			}
		}
	}
```

把上面总结的所有,封装成一个函数:

```javascript
    function browserSniff() {
		var ua = navigator.userAgent.toLowerCase(),
			tar, ver, re, re1,
			r_chrome = /(chrome)\/([\w.]+)/,
			r_firefox = /(firefox)\/([\w.])/,
			r_safari = /version\/([\w.]+).*(safari)/,
			r_opera = /(opera).+version\/([\w.]+)/,
			r_new_opera = /(opr)\/(.+)/,
			r_msie = /(msie)\s([\w.]+)/,
			r_trident = /(trident)\/([\w.]+)/;

		if (re = ua.match(r_chrome)) {
			tar = re[1];
			ver = re[2];
		} else if (re = ua.match(r_firefox)) {
			tar = re[1];
			ver = re[2];
		} else if (re = ua.match(r_msie)) {
			tar = "ie";
			ver = re[2];
			if (re1 = ua.match(r_trident)) {
				tar = "ie";
				switch (re1[2]) {
					case "4.0":
						ver = "8";
						break;
					case "5.0":
						ver = "9";
						break;
					case "6.0":
						ver = "10";
						break;
					case "7.0":
						ver = "11";
						break;
				}
			}
		} else if (re = ua.match(r_safari)) {
			tar = re[2];
			ver = re[1];
		} else if (re = ua.match(r_opera) || (re1 = ua.match(r_new_opera))) {
			tar = "opera";
			ver = re[2] || re1[2];
		}

		return {
			browser: tar,
			version: ver
		}
	}
```

