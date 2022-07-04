import QTreeObj from "../src/index";
test("初始化-已经格式化", () => {
    var data = [{
        label: "未分类",
        id: "x1",
        children: [{
            label: "未分类.jm",
            path: "c:/path/xxx/未分类.jm",
            id: "x2",
        }, ],
    }, ];
    const store = new QTreeObj(data, { formated: true });
    expect(store._store.reflex["未分类"]).toBe("menu.0");
});
test("初始化-未格式化", () => {
    var data = ["文件1", "文件2"];
    const store = new QTreeObj(data, { formated: false });
    expect(store._store.reflex["未分类"]).toBe("menu.0");
});
test("初始化-未格式化-二级元素length", () => {
    var data = ["文件1", "文件2"];
    const store = new QTreeObj(data, { formated: false });
    expect(store._store.menu[0].children.length).toBe(2);
});
//文件操作=====================================================
test("目录新增元素", () => {
    var data = ["文件1", "文件2"];
    const store = new QTreeObj(data, { formated: false });
    store.addToDir("新文件名", "未分类");
    expect(store._store.menu[0].children.length).toBe(3);
});

test("移除某个目录下的元素", () => {
    var data = ["文件1", "文件2"];
    const store = new QTreeObj(data, { formated: false });
    store.removeFromDir("文件1", "未分类");
    expect(store._store.menu[0].children.length).toBe(1);
});
test("移除某个的元素", () => {
    var data = ["文件1", "文件2"];
    const store = new QTreeObj(data, { formated: false });
    store.removeByName("文件1");
    expect(store._store.menu[0].children.length).toBe(1);
});

test("rename某个的元素", () => {
    var data = ["文件1", "文件2"];
    const store = new QTreeObj(data, { formated: false });
    store.rename("文件1", "新文件1");
    expect(store._store.menu[0].children[0].label).toBe("新文件1");
});
//文件夹操作=========================================
test("addGroup 新增文件夹", () => {
    var data = ["文件1", "文件2"];
    const store = new QTreeObj(data, { formated: false });
    store.addGroup("新文件夹");
    expect(store._store.menu.length).toBe(2);
});
test("removeGroup 移除文件夹", () => {
    var data = [{
            label: "未分类",
            id: "x1",
            children: [],
        },
        {
            label: "已分类",
            id: "x1",
            children: [],
        },
    ];
    const store = new QTreeObj(data, { formated: true });
    store.removeGroup("已分类");
    expect(store._store.menu.length).toBe(1);
});

test("renameGroup文件夹", () => {
    var data = [{
            label: "未分类",
            id: "x1",
            children: [],
        },
        {
            label: "已分类",
            id: "x1",
            children: [],
        },
    ];
    const store = new QTreeObj(data, { formated: true });
    store.renameGroup("已分类", "已分类2");
    expect(store._store.menu[1].label).toBe("已分类2");
});

test("update test add", () => {
    var data = [{
            label: "未分类",
            id: "x1",
            children: [{
                    label: "文件1.txt"
                },
                {
                    label: "文件2.txt"
                },
            ],
        },
        {
            label: "已分类",
            id: "x1",
            children: [{
                label: "文件5.txt"
            }, ],
        },
    ];
    const store = new QTreeObj(data, { formated: true });
    store.update(['文件1.txt', "文件2.txt", '文件3.txt']);
    expect(store.getStore().menu[0].children.length).toBe(3);
});
test("update test remove", () => {
    var data = [{
            label: "未分类",
            id: "x1",
            children: [{
                    label: "文件1.txt"
                },
                {
                    label: "文件2.txt"
                },
            ],
        },
        {
            label: "已分类",
            id: "x1",
            children: [{
                label: "文件5.txt"
            }, ],
        },
    ];
    const store = new QTreeObj(data, { formated: true });
    store.update(['文件1.txt', "文件2.txt"]);
    expect(store.getStore().menu[1].children.length).toBe(0);
});