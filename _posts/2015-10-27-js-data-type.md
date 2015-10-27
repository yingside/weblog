---
layout: post
title: javascript数据类型
tags:  [javascript,js]
categories: [javascript]
author: Yingside
excerpt: "javascript数据类型是js里面最基础的概念之一,看起来很简单,很多有一点js基础或者学过其他程序的人经常把这里忽略,但是其实就是js语法里面大坑之一,是javascript里最应该细读的地方之一"
---

## 数据类型

### 概述

JavaScript语言的每一个值，都属于某一种数据类型。JavaScript的数据类型，共有六个类别和两个特殊值。

**注：常规的JavaScript数据类型的理解是基本数据类型有五种：String,Number,Boolean,null和undefined,但是我认为六种数据类型和两个特殊值这种说法更加的靠谱**

六个类别的数据类型又可以分成两组：原始类型（primitive type）和合成类型（complex type）。

原始类型包括三种数据类型。

- 数值（number）
- 字符串（string）
- 布尔值（boolean）

“数值”就是整数和小数(比如1和3.14)，“字符串”就是由多个字符组成的文本（比如"Hello World"），“布尔值”则是true（真）和false（假）两个特定值。

合成类型也包括三种数据类型。

- 对象（object）
- 数组（array）
- 函数（function）

对象和数组是两种不同的数据组合方式，而函数其实是处理数据的方法。JavaScript把函数当成一种数据类型，可以像其他类型的数据一样，进行赋值和传递，这为编程带来了很大的灵活性，体现了JavaScript作为“函数式语言”的本质。

这里需要明确的是，JavaScript的所有数据，都可以视为对象。不仅合成类型的数组和函数属于对象的特例，就连原始类型的数据（数值、字符串、布尔值）也可以用对象方式调用。

除了上面这六个类别，JavaScript还定义了**两个特殊值null和undefined**。

本书将分别详细介绍这六个类别和两个特殊值。其中，两个特殊值和布尔类型比较简单，将在本节介绍，其他类型将各自有单独的一节。

### typeof运算符

JavaScript有三种方法，可以确定一个值到底是什么类型。

- typeof运算符
- instanceof运算符
- Object.prototype.toString方法

instanceof运算符和Object.prototype.toString方法，将在后文相关章节介绍。这里着重介绍typeof 运算符。

typeof运算符可以返回一个值的数据类型，可能有以下结果。

**（1）原始类型**

数值、字符串、布尔值分别返回number、string、boolean。

```javascript

typeof 123 // "number"
typeof "123" // "string"
typeof false // "boolean"

```

**（2）函数**

函数返回function。

```javascript

// 定义一个空函数
function f(){}

typeof f
// "function"

```

**（3）undefined**

undefined返回undefined。

```javascript

typeof undefined
// "undefined"

```

利用这一点，typeof可以用来检查一个没有声明的变量，而不报错。

```javascript

v
// ReferenceError: v is not defined

typeof v
// "undefined"

```

实际编程中，这个特点通常用在判断语句。

```javascript

// 错误的写法
if (v){
	// ...
}
// ReferenceError: v is not defined

// 正确的写法
if (typeof v === "undefined"){
	// ...
}

```

**（4）其他**

除此以外，都返回object。

```javascript

typeof window // "object"
typeof {} // "object"
typeof [] // "object"
typeof null // "object"

```

从上面代码可以看到，空数组（[]）的类型也是object，这表示在JavaScript内部，数组本质上只是一种特殊的对象。另外，null的类型也是object，这是由于历史原因造成的，为了兼容以前的代码，后来就没法修改了，并不是说null就属于对象，本质上null是一个类似于undefined的特殊值。

既然typeof对数组（array）和对象（object）的显示结果都是object，那么怎么区分它们呢？instanceof运算符可以做到。

```javascript

var o = {};
var a = [];

o instanceof Array // false
a instanceof Array // true

```

instanceof运算符和Object.prototype.toString的详细解释，将在《面向对象编程》一章再详细讲解,请期待...

### null和undefined

**（1）相似性**

首先，null与undefined都可以表示“无”，含义非常相似。将一个变量赋值为undefined或null，老实说，几乎没区别。

```javascript

var a = undefined;

// 或者

var a = null;

```

上面代码中，a变量分别被赋值为undefined和null，这两种写法几乎等价。

在if语句中，都会被自动转为false，相等运算符甚至直接报告两者相等。

```javascript

if (!undefined) 
    console.log('undefined is false');
// undefined is false

if (!null) 
    console.log('null is false');
// null is false

undefined == null
// true

```

上面代码说明，两者的行为是何等相似！Google公司开发的JavaScript语言的替代品Dart语言，就明确规定只有null，没有undefined！

既然含义与用法都差不多，为什么要同时设置两个这样的值，这不是无端增加复杂度，令初学者困扰吗？这与历史原因有关。

**（2）历史原因**

1995年JavaScript诞生时，最初像Java一样，只设置了null作为表示"无"的值。根据C语言的传统，null被设计成可以自动转为0。

```javascript

Number(null)
// 0

5 + null
// 5

```

但是，JavaScript的设计者Brendan Eich，觉得这样做还不够，有两个原因。

首先，null像在Java里一样，被当成一个对象。但是，JavaScript的数据类型分成原始类型和合成类型两大类，Brendan Eich觉得表示"无"的值最好不是对象。

其次，JavaScript的最初版本没有包括错误处理机制，发生数据类型不匹配时，往往是自动转换类型或者默默地失败。Brendan Eich觉得，如果null自动转为0，很不容易发现错误。

因此，Brendan Eich又设计了一个undefined。他是这样区分的：null是一个表示"无"的对象，转为数值时为0；undefined是一个表示"无"的原始值，转为数值时为NaN。

```javascript

Number(undefined)
// NaN

5 + undefined
// NaN

```

但是，这样的区分在实践中很快就被证明不可行。目前，null和undefined基本是同义的，只有一些细微的差别。

**（3）用法和含义**

对于null和undefined，可以大致上像下面这样理解。

null表示"没有对象"，即该处不应该有值。典型用法是：

- 作为函数的参数，表示该函数的参数不是对象。

- 作为对象原型链的终点。

undefined表示"缺少值"，就是此处应该有一个值，但是还未定义。典型用法是：

- 变量被声明了，但没有赋值时，就等于undefined。

- 调用函数时，应该提供的参数没有提供，该参数等于undefined。

- 对象没有赋值的属性，该属性的值为undefined。

- 函数没有返回值时，默认返回undefined。

```javascript

var i;
i // undefined

function f(x){console.log(x)}
f() // undefined

var  o = new Object();
o.p // undefined

var x = f();
x // undefined

```

**（4）null的特殊之处**

null的特殊之处在于，JavaScript把它包含在对象类型（object）之中。

```javascript

typeof null // "object"

```

上面代码表示，查询null的类型，JavaScript返回object（对象）。

这并不是说null的数据类型就是对象，而是JavaScript早期部署中的一个约定俗成，其实不完全正确，后来再想改已经太晚了，会破坏现存代码，所以一直保留至今。

**（5）注意点**

JavaScript的标识名区分大小写，所以undefined和null不同于Undefined和Null（或者其他仅仅大小写不同的词形），后者只是普通的变量名。

### 布尔值

布尔值代表“真”和“假”两个状态。“真”用关键字true表示，“假”用关键字false表示。布尔值只有这两个值。

下列运算符会返回布尔值：

- 两元逻辑运算符： && (And)，|| (Or)
- 前置逻辑运算符： ! (Not)
- 相等运算符：===，!==，==，!=
- 比较运算符：>，>=，<，<=

如果JavaScript预期某个位置应该是布尔值，会将该位置上现有的值自动转为布尔值。转换规则是除了下面六个值被转为false，其他值都视为true。

- undefined
- null
- false
- 0
- NaN
- ""（空字符串）

布尔值往往用于程序流程的控制，请看一个例子。

```javascript

if (""){ console.log(true);}
// 没有任何输出

```

上面代码的if命令后面的判断条件，预期应该是一个布尔值，所以JavaScript自动将空字符串，转为布尔值false，导致程序不会进入代码块，所以没有任何输出。

需要特别注意的是，空数组（[]）和空对象（{}）对应的布尔值，都是true。

```javascript

if ([]){ console.log(true);}
// true

if ({}){ console.log(true);}
// true

```