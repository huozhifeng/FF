## RequireJS进阶（三）


```
1. r.js有另外一种方式来合并压缩，即通过一个配置文件（如build.js）。配置文件内部采用前端工程师非常熟悉JSON格式。这样当项目开发目录固定后，配置文件也相应固定。通过配置文件就很好的隔离了开发环境及上线环境。
```



```
2. 命令行执行   node r.js -o build.js
```

> E:\FOF\Require\r6>node r.js -o build.js

> 这时的page1.js和page2.js就是其它模块文件的合并。另外在r6-built中其它的模块文件也被压缩了。


## difine和require区别

```
     define(['./jquery'], function($) { console.log($); });
     require(['./jquery'], function($) { console.log($); });

   define和require在依赖处理和回调执行上都是一样的,不同的就是define它多出来一个接口的返回。define定义的模块可以被其它调用 require不行
```





