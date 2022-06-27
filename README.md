# QTreeObj

* 一个简单的用路径管理的树结构函数对象
* 内部维护一个对象，这个对象以【键值对】的访问维护数据对象的路径
* 本工具的使用场景是同一个目录，需要生成虚拟的多目录场景或者类似场景才适用

## License
BSD 3-Clause License


## 方法

### 文件操作
| name      | Description | 参数    |返回|
| :---        |    :----   |          :--- |:--- |
| addToDir(arg1,arg2)     |  添加一个新元素到指定目录      | arg1文件名字,arg2:目录名字,arg3:添加个包含文件名的对象(可选)   |成功true，失败false|
| removeFromDir(arg1,arg2)   | 移除某个目录下的一个元素        | arg1文件名字,arg2目录名字     |成功true，失败false|
| removeByName(arg1)   | 某个目录下的一个元素        | arg1文件名字    |成功true，失败false|

### 文件夹操作
| name      | Description | 参数    |返回|
| :---        |    :----   |          :--- |:--- |
| addGroup(arg1,arg2)     |  添加一个目录      | arg1目录名字,arg2:路径 | 成功true，失败false|
| removeGroup(arg1)   | 移除某个目录下       | arg1目录  | 成功true，失败false|
| renameGroup(arg1,arg2)   | 从命名目录       | arg1旧的目录名字,arg2新的目录名名字  | 成功true，失败false|


### 初始化数据
| name      | Description | 参数    |
| :---        |    :----   |          :--- |:--- |
| initStore(arg1,arg2)    |  初始化数据     | arg1初始化数据,第一个数组会当做未分类目录处理,arg2:用来展示的字段名字(同时也是维护数据路径对象的key) |
|parsePathStr(arg1,arg2)|根据路径来得到在对象中的数据| arg1是字符串，以`.`分割,arg2是可选的对象，如果不传默认是内容数据|

#### initStore arg1的格式如下

除了label其他都是可选，label无法重复，重复就会覆盖，针对文件目录没有后缀和文件有后缀(一个目录里面文件名也不会出现重复)的方式，永远不会出现重复的情况


```javascript

    var data = [{
            label: "未分类",
            id: "x1",
            children: [{
                label: "未分类.jm",
                path: "c:/path/xxx/未分类.jm",
                id: "x2",
            }]
        }, {
            label: "分类1",
            id: "x2",
            children: [{
                label: "分类1.jm",
                path: "c:/path/xxx/分类1.jm",
                id: "x4",
            }, {
                label: "分类2",
                id: "x5",
                children: [{
                    label: "分类1.jm",
                    path: "c:/path/xxx/分类1.jm",
                    id: "x6"
                }]
            }]
        }];
```

以上数据内部会生成一个如下的对象

```javascript
{
    'menu下的目录': "menu.2"
    'new分类1': "menu.1"
    '你好啊.jm': "menu.0.children.1"
    '分类1.jm': "menu.1.children.1.children.0"
    '分类2': "menu.1.children.1"
    '新增到目录1.jm': "menu.2.children.0"
    '新增到目录2.jm': "menu.2.children.1"
    '未分类': "menu.0"
    '未分类.jm': "menu.0.children.0"
}

```