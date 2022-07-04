import MenuStore from "../src/index";
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
    const store = new MenuStore(data);
    expect(store._store.reflex["未分类"]).toBe("menu.0");
});
test("初始化-未格式化", () => {
    var data = ["文件1", "文件2"];
    const store = new MenuStore(data, false);
    expect(store._store.reflex["未分类"]).toBe("menu.0");
});
test("初始化-未格式化-二级元素length", () => {
    var data = ["文件1", "文件2"];
    const store = new MenuStore(data, false);
    expect(store._store.menu[0].children.length).toBe(2);
});

test("目录新增元素", () => {
    var data = ["文件1", "文件2"];
    const store = new MenuStore(data, false);
    store.addToDir("新文件名", "未分类");
    expect(store._store.menu[0].children.length).toBe(3);
});

test("移除某个目录下的元素", () => {
    var data = ["文件1", "文件2"];
    const store = new MenuStore(data, false);
    store.removeFromDir("文件1", "未分类");
    expect(store._store.menu[0].children.length).toBe(1);
});