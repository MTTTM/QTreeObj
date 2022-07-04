/**
 *
 * 核心是用路径来读写
 * obj 可能是普通数据，也可能是格式化后的数组
 * */
function MenuStore(obj, formated) {
    this._store = {
        reflex: {},
        menu: [],
    };
    this.__format = formated === undefined ? false : true;
    this._maxloop = 100000; //限制最大轮询10W次，超出就不再处理
    this._index = 0;
    this.fileNameStr = "label"; //默认展示的名字字段
    if (obj) {
        this.initStore(obj);
    }
}
//初始化数据
MenuStore.prototype.initStore = function(obj, labelStr) {
    //非格式化，也就是普通数组，
    //数组元素格式为【文件名字符串】
    if (!!this.__format && Array.isArray(obj)) {
        this._store.menu = [{
            label: "未分类",
            id: new Date().getTime(),
            children: [],
        }, ];
        obj.forEach((item) => {
            this._store.menu[0].children.push({
                label: item,
                id: new Date().getTime(),
            });
        });
    } else {
        this._store.menu = obj;
    }
    if (typeof labelStr === "string") {
        this.fileNameStr = labelStr;
    }
    this._initReflex(this._store.menu, "menu"); //初始化文件名和路径的关系
    console.log("初始化后的文件名和路径对应关系", this._store.reflex);
};
MenuStore.prototype._initReflex = function(data, basePath) {
    for (let i = 0; i < data.length; i++) {
        this._index++;
        let item = data[i];
        this._store.reflex[item[this.fileNameStr]] = `${basePath}.${i}`; //用文件名做key
        if (
            Array.isArray(item.children) &&
            item.children.length &&
            this._index <= this._maxloop
        ) {
            this._initReflex(item.children, `${basePath}.${i}.children`);
        }
    }
};
//读取store
MenuStore.prototype.getStore = function() {
    return JSON.parse(JSON.stringify(this._store));
};
/**
 * fileName:"文件名.jm"
 *  path: 格式"menu.0.children.0""
 * 添加成功返回true，否则false
 **/
MenuStore.prototype.add = function(fileName, path, fileObj) {
    let menuPathObj = this.parsePathStr(path);
    if (menuPathObj && Array.isArray(menuPathObj)) {
        if (fileObj) {
            menuPathObj.push(fileObj);
        } else {
            menuPathObj.push({
                [this.fileNameStr]: fileName,
                id: new Date().getTime(),
            });
        }
        //更新索引
        this._store.reflex[fileName] = `${path}.${menuPathObj.length - 1}`;
        return true;
    } else {
        console.warn(`add 路径store.${path}不存在`);
        return false;
    }
};
//添加到指定目录,添加成功 返回true，否则false
MenuStore.prototype.addToDir = function(fileName, dirName, fileObj) {
    let dirPathStr = this.getDirPath(dirName);
    dirPathStr = dirPathStr + ".children";
    if (!dirPathStr) {
        return null;
    }
    console.log("addToDir", fileName, "dirPathStr", dirPathStr);
    return this.add(fileName, dirPathStr, fileObj);
};
//从指定目录删除,删除成功返回true，否则null
MenuStore.prototype.removeFromDir = function(fileName, dirName) {
    if (!this._store.reflex[fileName]) {
        return null;
    }
    let dirPathStr = this.getDirPath(dirName);
    let fileNamePathStr = this.getItemPath(fileName);
    let pathArr = fileNamePathStr.split(".");
    let isChildItem = !Number.isNaN(Number(pathArr[pathArr.length - 1]));
    if (isChildItem) {
        this._parentRemoveItemByItemPathArr(pathArr);
    } else {
        // delete menuPathObj;
    }
    delete this._store.reflex[fileName];
    return true;
};
/**
 * 根据文件名字删除路径，成功返回false，失败返回null
 * */
MenuStore.prototype.removeByName = function(fileName) {
    let pathStr = this._store.reflex[fileName];
    if (!pathStr) {
        console.warn(`removeByName提示不存在${fileName}以及相关数据`);
        return null;
    }
    let pathArr = pathStr.split(".");
    //根据最后一个索引是不是数据来判断，路径匹配到的是不是children下面的数组元素
    let isChildItem = !Number.isNaN(Number(pathArr[pathArr.length - 1]));
    // console.log("isChildItem", pathArr, 'pathStr', pathStr)
    if (isChildItem) {
        this._parentRemoveItemByItemPathArr(pathArr);
    } else {
        // delete menuPathObj;
    }

    let menuPathObj = this.parsePathStr(pathStr);
    if (menuPathObj) {
        delete this._store.reflex[fileName];
    }
    return true;
};
MenuStore.prototype.rename = function(oldFileName, newFileName) {
    let pathStr = this._store.reflex[oldFileName];
    if (!pathStr) {
        console.warn(`rename提示不存在${oldFileName}以及相关数据`);
        return null;
    }
    let pathArr = pathStr.split(".");
    //根据最后一个索引是不是数据来判断，路径匹配到的是不是children下面的数组元素
    let isChildItem = !Number.isNaN(Number(pathArr[pathArr.length - 1]));
    // console.log("isChildItem", pathArr, 'pathStr', pathStr)
    if (isChildItem) {
        let menuPathObj = this.parsePathStr(pathStr);
        console.log("menuPathObj", menuPathObj);
        if (menuPathObj) {
            menuPathObj.label = newFileName;
            this._store.reflex[newFileName] = pathStr;
            delete this._store.reflex[oldFileName];
            return true;
        } else {
            console.warn(`rename提示不存在${oldFileName}以及相关数据1`);
            return null;
        }
    } else {
        // delete menuPathObj;
    }
    return null;
};

MenuStore.prototype.getInfoByFileName = function(fileName) {
    let objPath = this._store.reflex[fileName];
    if (!objPath) {
        return null;
    }
    let getTreeItem = this.parsePathStr(objPath, this._store);
    return getTreeItem;
};
//返回文件夹或文件的路径
MenuStore.prototype.getItemPath = MenuStore.prototype.getDirPath = function(
    name
) {
    console.log("this._store.reflex", this._store.reflex, "name", name);
    return this._store.reflex[name];
};
//根据要删除子节点的路径数组，来删除该子节点，并返回该子节点
MenuStore.prototype._parentRemoveItemByItemPathArr = function(childPathArr) {
    //得到要删除元素在children中的索引
    let childIndex = childPathArr.splice(childPathArr.length - 1, 1);
    //删除最后一个得到上一级的路径
    let parentPathStr = childPathArr.join(".");
    // console.log("上一级的路径", parentPathStr, 'pathStr', pathStr)
    let patentObj = this.parsePathStr(parentPathStr);
    // //从children对象删除某个元素
    // let tmpParentObj = [...patentObj]; //解构赋值，不能对原始数据做删减
    let sourseItem = patentObj.splice(childIndex, 1)[0];
    return sourseItem;
};

/*
 * soursePath需要携带索引，
 * targetPath 不需要携带索引
 **/
MenuStore.prototype.move = function(soursePath, targetPath) {
    let soursePathArr = soursePath.split(".");
    let targetPathArr = targetPath.split(".");
    let isChildItem = !Number.isNaN(
        Number(soursePathArr[soursePathArr.length - 1])
    );
    let isChildrenArr = targetPathArr[targetPathArr.length - 1] == "children";
    if (!isChildItem) {
        throw "move 函数的原路径的必须指定某个children下的元素，也就是说路径最后必须是索引";
    }
    if (!isChildrenArr) {
        throw "move 函数的目标路径，必须为children对象";
    }
    let movedItem = this.parsePathStr(soursePath);
    let targetPathObj = this.parsePathStr(targetPath);
    console.log("movedItem", movedItem);
    //修正存储位置
    targetPathObj.push(movedItem);
    //更正路径
    this._store.reflex[movedItem[this.fileNameStr]] = `menu.0.children.${
    this._store.menu[0].children.length - 1
  }`;
};
//解析路径为对象
/**
 * str 为对象路径格式为:格式"menu.0.children.0""
 * data 可选，不提供时候读取当前对象的_stroe属性
 *
 * */
MenuStore.prototype.parsePathStr = function(str, data) {
    //直接应用请勿解构
    data = data ? data : this._store;
    let strArr = str.split(".").map((item) => {
        if (!Number.isNaN(Number(item))) {
            return Number(item);
        }
        return item;
    });
    let matchStr = strArr[0]; //已经遍历到的节点
    let result = {};
    for (let i = 0; i < strArr.length; i++) {
        if (i !== 0) {
            matchStr += "." + strArr[i];
            data = result;
        }
        result = data[strArr[i]];
        if (!result) {
            console.warn(`data.${matchStr} 为undefined`);
            return undefined;
        }
    }
    return result;
};
//新增目录
MenuStore.prototype.addGroup = function(dirName, path) {
    let target = this.parsePathStr(path);
    console.log("target", target);
    if (!Array.isArray(target) && !Array.isArray(target.children)) {
        console.warn(`目标路径${path} 不是根目录，或目标路径下没有children`);
        return false;
    }
    //挂载非根节点下班
    if (target.children) {
        target.children.push({
            [this.fileNameStr]: dirName,
            id: new Date().getTime(),
            children: [],
        });
        this._store.reflex[dirName] = `${path}.children.${
      target.children.length - 1
    } `;
    } else {
        //挂载menu下面
        target.push({
            [this.fileNameStr]: dirName,
            id: new Date().getTime(),
            children: [],
        });
        this._store.reflex[dirName] = `${path}.${target.length - 1}`;
    }
    return true;
};
//获取目录下所有的文件名
MenuStore.prototype._getAllItem = function(pathStr) {
    let self = this;
    let obj = this.parsePathStr(pathStr);
    let fileNamesPaths = [];

    function getLabelsPath(e) {
        if (e.children && Array.isArray(e.children)) {
            e.children.forEach((item) => {
                fileNamesPaths.push(self._store.reflex[item[this.fileNameStr]]);
                if (item.children && Array.isArray(e.children)) {
                    getLabelsPath(item);
                }
            });
        }
    }
    getLabelsPath(obj);
    console.log("_getAllItem", fileNamesPaths);
    return fileNamesPaths;
};
MenuStore.prototype.removeGroup = function(dirName) {
    let pathStr = this.getDirPath(dirName);
    if (!pathStr) {
        console.warn(`目录 ${dirName}不存在`);
        return false;
    }
    let self = this;
    let pathArr = pathStr.split(".");
    let soursePaths = this._getAllItem(pathStr);
    console.log("soursePaths", soursePaths);
    soursePaths.forEach((item) => {
        self.move(item, "menu.0.children");
    });
    this._parentRemoveItemByItemPathArr(pathArr);
    return true;
};
MenuStore.prototype.renameGroup = function(dirName, newName) {
    let pathStr = this.getDirPath(dirName);
    if (!pathStr) {
        console.warn(`目录 ${dirName}不存在`);
        return false;
    }
    let data = this.parsePathStr(pathStr);
    data[this.fileNameStr] = newName;
    this._store.reflex[newName] = pathStr;
    delete this._store.reflex[dirName];
    return true;
};

export default MenuStore;