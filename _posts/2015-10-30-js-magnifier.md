---
layout: post
title: 通过实例学习javascript函数封装(二)--放大镜
tags:  [javascript,function]
categories: [javascript]
author: Yingside
excerpt: "这一章主要承接上一章的内容,将函数封装为自己可以直接使用的库,并且继续做了一些封装,实现在电商页面常见的放大镜效果"

---

先直接来看一下放大镜效果,图片来源于京东商城,因此放大镜效果也是模拟的京东的效果

<style>
    .photo-frame{
        margin: 10px auto;
        padding: 5px 5px;
        box-shadow: 0 2px 6px rgba(0,0,0,.4);
        display: inline-block;
        position: relative;
    }
    .imgContent{
        position: relative;
    }
    .zoomPup{
        position: absolute;
        left: 0;
        top: 0;
        height: 175px;
        width: 175px;
        background: #FEDE4F 50% top no-repeat;
        visibility: hidden;
    }
</style>
<div class="photo-frame">
    <div class="imgContent">
        <img src="/assets/images/2015-10-30-js-magnifier-2.jpg" id="thumbnailImg" />
    </div>
</div>
<script src="/assets/script/lib.js"></script>
<script>
    var thumbnailImg = YG.$('thumbnailImg');
    var thumbnailPos = YG.getElementPos("thumbnailImg");
    var bigImg;

    //创建遮罩的小Div
    var createCoverUpDiv = function(){
        var coverDiv = document.createElement('div');
        coverDiv.setAttribute('id','coverDiv');
        var width = parseInt(thumbnailPos.width / 2);
        var height = parseInt(thumbnailPos.height / 2);
        YG.setStyles(coverDiv,{
            "height": height + "px",
            "width": width + "px",
            "position":"absolute",
            "top": 0,
            "left": 0,
            "opacity":"0.5",
            "background":"#fede4f",
            "cursor":"move"
        });
        return coverDiv;
    }

    //创建显示大图的div
    var createShowBigDiv = function(){
        var showDiv = document.createElement('div');

        showDiv.innerHTML = "<img src='/assets/images/2015-10-30-js-magnifier-1.jpg' id='bigImg' />"
        showDiv.setAttribute('id','showDiv');
        document.body.appendChild(showDiv);
        bigImg = YG.$('bigImg');
        //设置大图div的样式
        YG.setStyles(showDiv,{
            //注意大图div为了有移动效果，不能和图片一样大小
            "height": "400px",
            "width": "400px",
            "position":"absolute",
            "overflow":"hidden",
            "display":"none"
        });
        return showDiv;
    }

    function show(){
        var coverDiv = createCoverUpDiv();
        var showDiv = createShowBigDiv();

        YG.addEvent(thumbnailImg,'mouseover',function(){
            this.parentNode.appendChild(coverDiv);
            coverDiv.style.display = "block";
            showDiv.style.left = (thumbnailPos.x + thumbnailImg.offsetWidth+ 20) + "px";
            showDiv.style.top = (thumbnailPos.y) + "px";
            showDiv.style.display = "block";
            bigImg.style.display = "block";
        });

        YG.addEvent(document,'mousemove',function(e){
            var pointerPosInDocument = YG.getPointerPositionInDocument(e);
            //定位图片起始坐标位置
            var pointerPosInImgX = pointerPosInDocument.x - thumbnailPos.x;
            var pointerPosInImgY = pointerPosInDocument.y - thumbnailPos.y;
            //以覆盖层中心位置，作为原点坐标位置
            // (其意义在于,当设置了覆盖层left和top之后，鼠标始终位于覆盖层中心,
            // 注意：divCoverUpMovePosX，divCoverUpMovePosY指的是覆盖div的左上角坐标
            // 但是鼠标点是在覆盖div的中心)
            var divCoverUpMovePosX = pointerPosInImgX - coverDiv.offsetWidth / 2;
            var divCoverUpMovePosY = pointerPosInImgY - coverDiv.offsetHeight / 2;

            //divCoverUpMovePosX=0时，coverDiv的left也就是左上角就在缩略图的左上角
            // coverDiv.style.left = divCoverUpMovePosX + "px";
            // coverDiv.style.top = divCoverUpMovePosY + "px";

            //下面的判读主要是为了覆盖层始终在缩略图中不移出缩略图
            //当divCoverUpMovePosX<0,让它一直=0，就是为了在左上角不再发生变化
            if(divCoverUpMovePosX < 0) divCoverUpMovePosX = 0;
            //当缩略图移到最右边，始终让他靠边，所以覆盖层的left=缩略图的宽度-覆盖层自身的宽度
            if(divCoverUpMovePosX + coverDiv.offsetWidth > thumbnailImg.offsetWidth)
                divCoverUpMovePosX = thumbnailImg.offsetWidth - coverDiv.offsetWidth;
            if(divCoverUpMovePosY < 0) divCoverUpMovePosY = 0;
            if(divCoverUpMovePosY + coverDiv.offsetHeight > thumbnailImg.offsetHeight)
                divCoverUpMovePosY = thumbnailImg.offsetHeight - coverDiv.offsetHeight;

            if(pointerPosInImgX < 0 || pointerPosInImgY < 0
                    || pointerPosInImgX > thumbnailImg.offsetWidth || pointerPosInImgY > thumbnailImg.offsetHeight)
                coverDiv.style.display = bigImg.style.display =  'none';


            coverDiv.style.left = divCoverUpMovePosX + "px";
            coverDiv.style.top = divCoverUpMovePosY + "px";

            //首先算出一个鼠标所在位置的比例，在得到相对应大图所在位置
            showDiv.scrollTop = divCoverUpMovePosY / thumbnailImg.height * bigImg.offsetHeight;
            showDiv.scrollLeft = divCoverUpMovePosX / thumbnailImg.width * bigImg.offsetWidth;
        });
    }
    show();
</script>


## 创建自己的函数库

首先上一篇文章[通过实例学习javascript函数封装(一)--拖拽](http://www.yingside.com/2015/10/28/js-drag/)已经封装了一堆函数,这一堆函数在我们这个放大镜的实例里面可能还是有用的,因此我们需要继续使用这些封装的函数。

但是如果直接复制粘贴这一堆函数的话,实在太low了,所以我把之前的这一堆函数封装在一个对象中,用对象直接调用出这堆函数,并且为了不污染全局环境,所有的函数全部封装在IIFE的函数中(关于IIFE的说明,请查看博客 [javascript--Function](http://www.yingside.com/2015/10/29/js-function/) **立即调用的函数表达式(IIFE)**),所以最后我们封装为一个自己简单的js库文件

```javascript

(function(){
    if(!window.YG) window['YG'] = {};
    function $() {
        var elements = new Array();

        for (var i = arguments.length - 1; i >= 0; i--) {
            var element = arguments[i];

            if (typeof element == "string") {
                element = document.getElementById(element);
            }

            if (arguments.length == 1) {
                return element;
            } else {
                elements.push(element);
            }  
        };
        return elements;
    };
    window['YG']['$'] = $;

    //添加事件
    function addEvent(node, type, listener) {
        if (!(node = $(node))) return false;
        if (node.addEventListener) {
            //W3C
            node.addEventListener(type, listener, false);
            return true;
        } else if (node.attachEvent) {
            node['e' + type + listener] = listener;
            node[type + listener] = function() {
                node['e' + type + listener](window.event);
            };
            node.attachEvent('on' + type, node[type + listener]);
            return true;
        }

        return false;

    };
    window['YG']['addEvent'] = addEvent;

    //移出事件
    function removeEvent(node,type,listener){
        if (!(node = $(node))) return false;
        if(node.removeEventListener){
            node.removeEventListener(type,listener,false);
            return true;
        }else if(node.removeEvent){
            node.detachEvent('on'+type,node[type+listener]);
            node[type+listener] = null;
            return true;
        }
        return false;
    };
    window['YG']['removeEvent'] = removeEvent;
    //获取事件对象
    function getEventObject(e){
        return e || window.event;

    }
    window['YG']['getEventObject'] = getEventObject;
    //组织事件冒泡
    function stopPropagation(eventObject){
        var eventObject = eventObject || getEventObject();
        if(eventObject.stopPropagation){
            eventObject.stopPropagation();
        }else{
            eventObject.cancelBubble = true;
        }
    };
    window['YG']['stopPropagation'] = stopPropagation;

    //阻止浏览器默认 事件
    function stopDefault(eventObject){
        var eventObject = eventObject || getEventObject();
        if(eventObject.preventDefault){
            eventObject.preventDefault();
        }else{
            eventObject.returnValue = false;
        }
    };
    window['YG']['stopDefault'] = stopDefault;
    //获取鼠标位置
    function getPointerPositionInDocument(eventObject) {
        eventObject = eventObject || getEventObject(eventObject);
        var x = eventObject.pageX || (eventObject.clientX +
            (document.documentElement.scrollLeft || document.body.scrollLeft));
        var y = eventObject.pageY || (eventObject.clientY +
            (document.documentElement.scrollTop || document.body.scrollTop));
        return {
            'x': x,
            'y': y
        };
    };
    window['YG']['getPointerPositionInDocument'] = getPointerPositionInDocument;
    //获取元素位置和尺寸
    function getDimensions(element){
        if (!(element = $(element))) return false;

        return {
            'left':element.offsetLeft,
            'top':element.offsetTop,
            'width':element.offsetWidth,
            'height':element.offsetHeight
        };
    }
    window['YG']['getDimensions'] = getDimensions;

    //设置CSS样式
    function setStyles(element, styles) {
        if (!(element = $(element))) return false;
        for (property in styles) {
            if (!styles.hasOwnProperty(property)) continue;

            if (element.style.setProperty) {
                element.style.setProperty(
                    uncamelize(property, '-'), styles[property], null);
            } else {
                element.style[camelize(property)] = styles[property];
            }
        }
        return true;
    };
    window['YG']['setStyles'] = setStyles;

    //将CSS样式字符串转化会JS样式 text-align==>textAlign
    function camelize(s) {
        return s.replace(/-(\w)/g, function(strMatch, p1) {
            return p1.toUpperCase();
        });
    };
    window['YG']['camelize'] = camelize;

    //将JS样式字符串转化为CSS样式 fontSize==>font-size
    function uncamelize(s, sep) {
        sep = sep || '-';
        return s.replace(/([a-z])([A-Z])/g, function(strMatch, p1, p2) {
            return p1 + sep + p2.toLowerCase();
        });
    };
    window['YG']['uncamelize'] = uncamelize;

    //获取元素位置
    function getElementPos(element){
        if(!(element = $(element))) return false;
        //获取传入元素到父元素左边的距离
        var left = element.offsetLeft;
        //clientLeft得到的是边框的粗细,因此距离需要加上边框的大小
        left += element.clientLeft;
        var top = element.offsetTop;
        top += element.clientTop;

        //得到当前元素的父元素,注意offsetParent只能得到父元素有position定位并且是absolute或者是fixed的
        var current = element.offsetParent;

        //循环是否有父元素,如果有继续累加
        while(current){
            top += current.offsetTop + current.clientTop;
            left += current.offsetLeft + current.clientLeft;
            current = current.offsetParent;
        }

        return {
            "x":left,
            "y":top,
            "width":element.offsetWidth,
            "height":element.offsetHeight
        };
    }

    window['YG']['getElementPos'] = getElementPos;

})();

```


稍微做一下说明,第一句 `if(!window.YG) window['YG'] = {};` 由于使用了IIFE,我们封装在立即调用的函数里面的函数,由于变量作用域的原因,在外面是不能调用的...所以我们声明了一个全局变量YG,判断全局环境window中是否已经有YG这个变量,如果没有,就直接通过window创建YG,这个YG是一个空的对象.

我们后面写的函数,在需要被外界调用的函数后面加上这么一句 `window['YG']['addEvent'] = addEvent;` 这句话的意思就是将在IIFE里面声明的函数,赋值给YG对象里面的一个属性.所以在外界调用时，使用`YG.addEvent()`就相当于调用了 IIFE里面的`addEvent`

这个**YG**就是我们自己的库了,其实就是和jQuery一样的意思,我们以后要添加一些工具函数,就可以直接添加到这个**YG**库中了.

这里相对于上一篇文章,已经添加了一个新的函数`getElementPos`,这个函数是获取元素在界面中位置,因为`offsetLeft`,`offsetTop`这两个属性,如果元素外有定位的父元素,获取的是该元素到父元素之间的距离(注意clientLeft,clientTop获取的是边框的粗细),所以这个函数就是通过不断的循环,一直循环到没有父元素位置,来进行累加距离.最后返回的是一个对象,将left,top,width,height一并renturn回去

ok,上面的都是我们这篇文章会用到的函数库

## 放大镜实现原理

下面具体来说一下,放大镜效果实现的原理

**1.鼠标放入到缩略图上之后,创建一个遮罩层,并且创建一个大图显示层**

```javascript

    //获取缩略图元素对象
    var thumbnailImg = YG.$('thumbnailImg');
    //获取缩略图在界面中的位置
    var thumbnailPos = YG.getElementPos("thumbnailImg");
    var bigImg; //大图变量

    //创建遮罩的小Div
    var createCoverUpDiv = function(){
        var coverDiv = document.createElement('div');
        coverDiv.setAttribute('id','coverDiv');
        //设置遮罩层宽高为缩略图宽高的一半
        var width = parseInt(thumbnailPos.width / 2);
        var height = parseInt(thumbnailPos.height / 2);
        //设置遮罩层样式
        YG.setStyles(coverDiv,{
            "height": height + "px",
            "width": width + "px",
            "position":"absolute",
            "top": 0,
            "left": 0,
            "opacity":"0.5",
            "background":"#fede4f",
            "cursor":"move"
        });
        return coverDiv;
    }

    //创建显示大图的div
    var createShowBigDiv = function(){
        var showDiv = document.createElement('div');

        showDiv.innerHTML = "<img src='/assets/images/2015-10-30-js-magnifier-1.jpg' id='bigImg' />"
        showDiv.setAttribute('id','showDiv');
        document.body.appendChild(showDiv);
        bigImg = YG.$('bigImg');
        //设置大图div的样式
        YG.setStyles(showDiv,{
            //注意大图div为了有移动效果，不能和图片一样大小
            "height": "400px",
            "width": "400px",
            "position":"absolute",
            //overflow这个属性很重要,因为整个图片的大小是800*800,而大图显示层为400*400为了让大图显示层有移动的效果,其实就是使用的scrollLeft,scrollTop属性.如果还不是太清楚什么原因,可以将这里的overflow:hidden改为overflow:scroll查看效果
            "overflow":"hidden",
            "display":"none"
        });
        return showDiv;
    }

```

**2.鼠标在移动时注意几个问题**

- 为了移动效果平滑,移动事件实际是放在document元素上的,所以,当鼠标移入移出缩略图时,就需要判断鼠标是否还在缩略图上,如果已经移出了缩略图,那么就应该移除遮罩层和大图显示层
- 遮罩层在缩略图移动时,所移动的位置，应该和大图显示层成对等关系,所以就需要按照比例来移动,其实很简单`大图显示div的scrollTop = 遮罩层的offsetTop / 缩略图的高度 * 大图的高度`

具体我们来看一下代码,代码中有相关注释:

```

    function show(){
        var coverDiv = createCoverUpDiv();
        var showDiv = createShowBigDiv();

        YG.addEvent(thumbnailImg,'mouseover',function(){
            this.parentNode.appendChild(coverDiv);
            coverDiv.style.display = "block";
            //设置遮罩层的位置,放在缩略图右边,稍微空出一点距离
            showDiv.style.left = (thumbnailPos.x + thumbnailImg.offsetWidth+ 20) + "px";
            showDiv.style.top = (thumbnailPos.y) + "px";
            showDiv.style.display = "block";
            bigImg.style.display = "block";
        });

        YG.addEvent(document,'mousemove',function(e){
        	//定位鼠标在界面的位置
            var pointerPosInDocument = YG.getPointerPositionInDocument(e);
            //定位鼠标在图片中的坐标位置
            var pointerPosInImgX = pointerPosInDocument.x - thumbnailPos.x;
            var pointerPosInImgY = pointerPosInDocument.y - thumbnailPos.y;
            //以遮罩层中心位置，作为原点坐标位置
            // (其意义在于,当设置了遮罩层left和top之后，鼠标始终位于遮罩层中心,
            // 注意：divCoverUpMovePosX，divCoverUpMovePosY指的是遮罩div的左上角坐标但是鼠标点是在覆盖div的中心)
            var divCoverUpMovePosX = pointerPosInImgX - coverDiv.offsetWidth / 2;
            var divCoverUpMovePosY = pointerPosInImgY - coverDiv.offsetHeight / 2;

            //divCoverUpMovePosX=0时，coverDiv的left也就是左上角就在缩略图的左上角
            // coverDiv.style.left = divCoverUpMovePosX + "px";
            // coverDiv.style.top = divCoverUpMovePosY + "px";

            //下面的判读主要是为了覆盖层始终在缩略图中不移出缩略图
            //当divCoverUpMovePosX<0,让它一直=0，就是为了在左上角不再发生变化
            if(divCoverUpMovePosX < 0) divCoverUpMovePosX = 0;
            //当缩略图移到最右边，始终让他靠边，所以覆盖层的left=缩略图的宽度-覆盖层自身的宽度
            if(divCoverUpMovePosX + coverDiv.offsetWidth > thumbnailImg.offsetWidth)
                divCoverUpMovePosX = thumbnailImg.offsetWidth - coverDiv.offsetWidth;
            if(divCoverUpMovePosY < 0) divCoverUpMovePosY = 0;
            if(divCoverUpMovePosY + coverDiv.offsetHeight > thumbnailImg.offsetHeight)
                divCoverUpMovePosY = thumbnailImg.offsetHeight - coverDiv.offsetHeight;

            if(pointerPosInImgX < 0 || pointerPosInImgY < 0
                    || pointerPosInImgX > thumbnailImg.offsetWidth || pointerPosInImgY > thumbnailImg.offsetHeight)
                coverDiv.style.display = bigImg.style.display =  'none';


            coverDiv.style.left = divCoverUpMovePosX + "px";
            coverDiv.style.top = divCoverUpMovePosY + "px";

            //首先算出一个鼠标所在位置的比例，得到相对应大图所在位置
            showDiv.scrollTop = divCoverUpMovePosY / thumbnailImg.height * bigImg.offsetHeight;
            showDiv.scrollLeft = divCoverUpMovePosX / thumbnailImg.width * bigImg.offsetWidth;
        });
    }

```

如果还不是太清楚的,可以点击[这里](http://download.csdn.net/detail/ying422/9229125)下载源码自行运行研究
