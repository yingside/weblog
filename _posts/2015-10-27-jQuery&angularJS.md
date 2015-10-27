---
layout: post
title: 通过jQuery与angularJS的比较认识angularJS思想
tags:  [angularJS,javascript,jQuery]
categories: [angularJS]
author: Yingside
excerpt: "通过几个例子分别通过jQuery和AngularJS来达到效果。主要通过思维转换来进一步了解AngularJS框架设计背后的思想"
---
# 通过jQuery的比较来认识AngularJS

这一章主要是通过几个例子分别通过jQuery和AngularJS来达到效果。主要通过思维转换来进一步了解AngularJS框架设计背后的思想。

**注意:
1.为了不浪费界面时间,界面用到了bootstrap.
2.所有代码写在一个文件中，方便大家复制粘贴.
3.引入css和angularJS文件使用的是百度静态库,如果没有网络环境请自行下载引用依赖文件.
4.如果觉得看比较jquery和angularJS没有兴趣的,可以直接跳过,阅读下一章TodoList,这个列子是一步一步带大家完成熟悉angularJS编码思想**

首先来看一个简单例子,大家可以直接复制粘贴代码,查看效果

## 用户输入

1.输入框输入值
2.下面h1标签马上有显示

**下面是jquery代码**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>输入测试</title>
    <link rel="stylesheet" href="http://apps.bdimg.com/libs/bootstrap/3.1.1/css/bootstrap.css">
</head>
<body>
<form>
    <div class="form-group">
        <label for="inputName" class="col-sm-2 control-label">名字:</label>
        <div class="col-sm-10">
            <input type="text" id="inputName" class="form-control" placeholder="请输入你的名字">
        </div>
    </div>
    <div class="col-sm-10 col-sm-offset-2">
        <h1 id="myText"></h1>
    </div>
</form>
</body>
<script src="http://apps.bdimg.com/libs/jquery/2.1.1/jquery.min.js"></script>
<script>
$(function(){
    $('#inputName').on('keyup',function(){
        $('#myText').html($(this).val());
    });
});
</script>
</html>
```

**下面来看一下angularJS的代码**

```html
<!DOCTYPE html>
<html lang="en" ng-app>
<head>
    <meta charset="UTF-8">
    <title>Document</title>
    <link rel="stylesheet" href="http://apps.bdimg.com/libs/bootstrap/3.1.1/css/bootstrap.css">
</head>
<body>
<form>
    <div class="form-group">
        <label for="inputName" class="col-sm-2 control-label">名字:</label>
        <div class="col-sm-10">
            <input type="text" class="form-control" placeholder="请输入你的名字" ng-model="inputName">
        </div>
    </div>
    <div class="col-sm-10 col-sm-offset-2">
        <h1>{{inputName}}</h1>
    </div>
</form>
</body>
<script src="http://apps.bdimg.com/libs/angular.js/1.2.9/angular.min.js"></script>
</html>
```

通过这个简单例子可以很清楚的看到,angularJS都没有写任何的JS代码就实现了这个输入效果。这里可以简单总结
**1.jquery是通过操作DOM来达到实现目的,换句话说,也就是必须要有了页面,再根据页面来进行相应的编程**
**2.angularJS主要关心的却是数据**

## 购物车
注意上面两点理论,我们来看一下稍微复杂点的例子,做一个简单的购物车.依据angularJS主要关心的是数据的这个特点,我们首先来编写angularJS相关代码,具体效果如下:

![](/assets/images/2015-10-27-jQuery&angular-1.png)

```html
<!DOCTYPE html>
<html lang="en" ng-app="myApp">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
    <link rel="stylesheet" href="http://apps.bdimg.com/libs/bootstrap/3.1.1/css/bootstrap.css">
</head>
<body>
<div ng-controller="CartController" class="panel panel-primary">
<div class="panel-heading text-center"><h3>你的购物车</h1></div>
    <div class="panle-body"></div>
    <table class="table table-bordered table-hover">
        <tr ng-repeat="item in items">
            <td class="text-center"><span ng-bind="item.title"></span></td>
            <td class="text-center">
                <input type="text" ng-model="item.quantity" class="form-control">
            </td>
            <td class="text-center"><span>{{item.price | currency}}</span></td>
            <td class="text-center"><span>{{item.price * item.quantity| currency}}</span></td>
            <td>
            <button type="button" class="btn btn-primary" ng-click="del($index)">
                删除
            </button>
            </td>
        </tr>
        <tr>
            <td colspan="4" class="text-center">总计</td>
            <td>{{total}}</td>
        </tr>
    </table>
</div>
</body>
<script src="http://apps.bdimg.com/libs/angular.js/1.2.9/angular.min.js"></script>
<script>
    var myApp = angular.module('myApp', []);
    myApp.controller('CartController', ['$scope', function($scope){
        $scope.items = [
            {title:'方便面',quantity:8,price:2.5},
            {title:'可乐',quantity:18,price:3},
            {title:'口香糖',quantity:12,price:4},
            {title:'辣条',quantity:30,price:0.5}
        ];
        $scope.total =total();
        $scope.del = function(index){
            $scope.items.splice(index,1);
            $scope.total = total();
        }
        function total(){
            var total = 0;
            $scope.items.forEach(function(item){
                total += item.quantity * item.price;
            });
            return total;
        }
    }]);
</script>
</html>
```
来分析一下上面的代码:

```javascript
var myApp = angular.module('myApp', []);
```

这一段创建了一个angularJS模块,关于什么是模块,为什么要用,大家可以参考我的[javascript模式--模块模式](http://blog.csdn.net/ying422/article/details/45152967)这篇文章,介绍了JS模块模式的基础,当然AngularJS是遵循 AMD 的,大家有一个大概了解什么是模块就行了。

大家注意看`HTML`代码中最上面有这么一段：

```html
<html lang="en" ng-app="myApp">
```

这里和`myApp`相对应,简单来说就是申明整个页面在angularJS包裹的环境中,其他大家不用深究。

```javascript
 myApp.controller('CartController', ['$scope', function($scope){}]);
```

通过myApp模块创建了一个控制器,一个页面只能有一个模块,但是可以有多个控制器。简单来说模块申明页面上哪些元素被包裹在了angularJS的环境中,而控制器则是这个环境中一个个的小块,js代码和界面被申明了`ng-controller="CartController"`的元素相对应。就表示页面和js代码共享了作用域。`$scope`相当于在控制器范围内的this,当然上面的代码为什么感觉那么怪,是由于angularJS用到了**依赖注入**的方式,这一点对于完全没有后端开发的同学来说理解有点痛苦,可以完全不用理会他现在,就当作是代码声明的一种方式就行了。对于我们快速入门来说。掌握这一点就差不多了。

```html
<tr ng-repeat="item in items">
```

这一句代码就是在循环迭代items数组中的数据,数组中有几组数据，那么tr就会被循环几次

**上面是基本说明,在函数里里面的代码,大家可以清楚的看到,我们就是声明了一个对象数组,无论是删除，计算都是直接对数据的操作,没有涉及任何的DOM操作。所以也就意味着界面基本上无需我们关心。在控制器中只需要关心数据和操作数据,而界面就会出现相应的变化**

如果这段代码要放入到jQuery里面去写...就是根据数组数据去创建DOM都比较麻烦,大家看一下代码:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
    <link rel="stylesheet" href="http://apps.bdimg.com/libs/bootstrap/3.1.1/css/bootstrap.css">
</head>
<body>
<div class="panel panel-primary" id="cart">
<div class="panel-heading text-center"><h3>你的购物车</h1></div>
    <div class="panle-body"></div>
    <table class="table table-bordered table-hover">

        <tr id="total">
            <td colspan="4" class="text-center">总计</td>
            <td></td>
        </tr>
    </table>
</div>
</body>
<script src="http://apps.bdimg.com/libs/jquery/2.1.1/jquery.min.js"></script>
<script>
$(function(){
    var items = [
            {title:'方便面',quantity:8,price:2.5},
            {title:'可乐',quantity:18,price:3},
            {title:'口香糖',quantity:12,price:4},
            {title:'辣条',quantity:30,price:0.5}
        ];

    $(items).each(function(index,element){
        var tr = $("<tr>"
            +"<td class=\"text-center\"><span>"+element.title+"</span></td>"
            +"<td class=\"text-center\">"
                +"<input type=\"text\" class=\"form-control\" value='"+element.quantity+"'>"
            +"</td>"
            +"<td class=\"text-center\">￥<span>"+element.price+"</span></td>"
            +"<td class=\"text-center\">￥<span  class=\"subTotal\">"+(element.quantity*element.price)+"</span></td>"
            +"<td>"
            +"<button type=\"button\" class=\"btn btn-primary\" >删除"
            +"</button>"
            +"</td>"
        +"</tr>");
        $(tr).insertBefore($('#total'));

    });
    function getTotal(){
        var sum = 0;
        $('#cart span.subTotal').each(function(){
            sum += parseFloat($(this).html());
        });
        $('#total td:last').html('￥' + sum);
    }

    $('#cart button.btn').click(function(){
        $(this).parent().parent().remove();
        getTotal();
    })

    $('#cart input[type=text]').keyup(function(e){
        $(this).parent().nextAll(':eq(1)').find('span').html(parseInt($(this).val()) * parseFloat($(this).parent().next().find('span').html()));
        getTotal();
    });

    getTotal();
});
</script>
</html>
```

