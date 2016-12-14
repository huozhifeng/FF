## RequireJS

```
一 诞生：（1）实现js文件的异步加载，避免网页失去响应，防止js加载阻塞页面渲染
         （2）管理模块之间的依赖性，便于代码的编写和维护。

```

```
二  加载问题
原理：当访问index.html时，会先加载require.js然后把需要加载的文件都通过appendChild的方式，添加到index.html的底部。

有人可能会想到，加载这个文件，也可能造成网页失去响应。解决办法有两个:一个是把它放在网页底部加载
    另一个是写成下面这样：
    <script src="js/require.js" defer async="true" ></script>

async属性表明这个文件需要异步加载，避免网页失去响应。IE不支持这个属性，只支持defer，所以把defer也写上。

加载require.js以后，下一步就要加载我们自己的代码了。假定我们自己的代码文件是main.js，也放在js目录下面。那么，只需
要写成下面这样就行了：

　　<script src="js/require.js" data-main="js/main"></script>


data-main 主模块还有一个重要的功能，当script标签指定data-main属性时，require会默认的将data-main指定的js为根路径，是什么意思呢？如上面的data-main="js/main"设定后，我们在使用require(['jquery'])后(不配置jquery的paths)，require会自动加载js/jquery.js这个文件，而不是jquery.js，相当于默认配置了：
```

```
三 config配置 参数

通过paths的配置会使我们的模块名字更精炼，paths还有一个重要的功能，就是可以配置多个路径，如果远程cdn库没有加载成功，可以加载本地的库，如：
require.config({
    paths : {
        "jquery" : ["http://libs.baidu.com/jquery/2.0.3/jquery", "js/jquery"],
        "a" : "js/a"
    }
})
require(["jquery","a"],function($){
    $(function(){
        alert("load finished");
    })
})
这样配置后，当百度的jquery没有加载成功后，会加载本地js目录下的jquery
在使用requirejs时，加载模块时不用写.js后缀的，当然也是不能写后缀
上面例子中的callback函数中发现有$参数，这个就是依赖的jquery模块的输出变量，如果你依赖多个模块，可以依次写入多个参数来使用：
require(["jquery","underscore"],function($, _){
    $(function(){
        _.each([1,2,3],alert);
    })
})

>如果某个模块不输出变量值，则没有，所以尽量将输出的模块写在前面，防止位置错乱引发误解

```

```
四 参数shim
  require.js加载的模块，必须是按照AMD规范、用define()函数定义的模块。但是实际上，虽然已经有一部分流行的函数库（比如jQuery）符合AMD规范，更多的库并不符合。那么，require.js是否能够加载非规范的模块呢？
这样的模块在用require()加载之前，要先用require.config()方法，定义它们的一些特征。
举例来说，underscore和backbone这两个库，都没有采用AMD规范编写。如果要加载它们的话，必须先定义它们的特征。

 非AMD模块输出，将非标准的AMD模块"垫"成可用的模块，例如：在老版本的jquery中，是没有继承AMD规范的，所以不能直接require["jquery"],这时候就需要shim

插件形式的非AMD模块，我们经常会用到jquery插件，而且这些插件基本都不符合AMD规范，比如jquery.form插件，这时候就需要将form插件"垫"到jquery中：
require.config({
    shim: {
        "underscore" : {
            exports : "_";
        },
        "jquery.form" : {
            deps : ["jquery"]
        }
    }
})
也可以简写为：
require.config({
    shim: {
        "underscore" : {
            exports : "_";
        },
        "jquery.form" : ["jquery"]
    }
})

```





```
五 合并压缩 js/css

1. node r.js -o baseUrl=js name=main out=built.js

   命令行信息可以看到已经将各个js文件合并成功了。这时回到r4目录会发现多了一个built.js文件。

   好了，再介绍两个参数

   1，excludeShallow 合并时将排除该文件

   node r.js -o baseUrl=js name=main out=built.js excludeShallow=selector

   2，optimize (none/uglify/closure)  指定是否压缩，默认为uglify

   不传该参数时r.js默认以UglifyJS压缩。设置为none则不会压缩，仅合并，这在开发阶段是很用用的。
   node r.js -o baseUrl=js name=main out=built.js optimize=none
   这时生成的built.js是没有压缩的。
```



```
2. 配置文件build.js
命令行执行   node r.js -o build.js
   通过配置文件方式可以实现更加强大，灵活的合并工作。可以生成多个合并文件，包括不同页面的js，css。
```

> E:\FOF\Require\r6>node r.js -o build.js

> 这时的page1.js和page2.js就是其它模块文件的合并。另外在r6-built中其它的模块文件也被压缩了。

```
3.  r.js来合并压缩css文件。
    在r5下新建一个css文件夹，里面有四个css文件：main.css、nav.css、form.css、grid.css。
     main.css是合并的主文件，或称配置文件。要合并的文件使用@import引入。如下

  main.css
  @import url("nav.css");
  @import url("grid.css");
  @import url("form.css");

  另外三个是普通的css文件，里面定义的各种样式。这里不贴代码了。这里将使用命令行将这四个文件合并后生成到r5/css/built.css。

  node r.js -o cssIn=css/main.css out=css/built.css

  这时回到r5/css目录会发现多了一个built.css文件，该文件是另外四个css文件的合并项。

  还可以使用optimizeCss参数设置来配置是否压缩及压缩选项。optimizeCss的取值有standard/none/standard.keepLines/standard.keepComments/standard.keepComments.keepLines。

  none  不压缩，仅合并
  standard  标准压缩 去换行、空格、注释
  standard.keepLines  除标准压缩外，保留换行
  standard.keepComments  除标准压缩外，保留注释
  standard.keepComments.keepLines  除标准压缩外，保留换行和注释

```


## difine和require区别

```
     define(['./jquery'], function($) { console.log($); });
     require(['./jquery'], function($) { console.log($); });

   define和require在依赖处理和回调执行上都是一样的,不同的就是define它多出来一个接口的返回。define定义的模块可以被其它调用 require不行
```





