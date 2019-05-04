// 数据组件连接
export default class Mediator {
    constructor() {
        // 监听列表
        this._list = [];
        // 执行栈
        this._todoStack = [];
        // 字典型数据存取类
        this._data = new Map();
    }

    // 获取监听列表
    get list() {
        return this._list;
    }

    /*
     * 发射事件
     * @param {object} res 数据
     */
    emit(res) {
        this._pushTodoStack(res.cmd, res.data);
    }

    /*
     * 新增组件和数据连接
     * @param (string) scene 场景 *
     * @param (string) action 动作 *
     * @param (function) callback 回调函数 *
     */
    add({
        scene,
        action,
        callback
    }) {
        const result = this._list.filter((obj) => {
            return obj.scene === scene && obj.action === action;
        });

        if (result.length > 0) {
            return;
        }

        this._list.push({
            scene,
            action,
            callback
        });
    }

    // 更新状态
    update() {
        if (this._todoStack.length > 0) {
            const data = this._popTodoStack();

            this._dispatch(data);
        }
    }

    /*
     * 根据名称清理监听
     * @param (string) name 场景名称
     */
    clear(name) {
        this._list = this._list.filter((obj, index) => {
            return obj.scene !== name;
        });
    }

    // 清理所有监听
    clearAll() {
        this._list = [];
    }

    /*
     * 推送数据到todo栈中
     * @param (string) action 命令
     * @param (object) data 数据
     */
    _pushTodoStack(action, data) {
        this._todoStack.push({
            type: action,
            payload: data
        });
    }

    /*
     * 获取todo栈中数据
     * @return (object) data 数据
     */
    _popTodoStack() {
        let data = null;

        if (this._todoStack.length > 0) {
            data = this._todoStack.shift()
        }

        return data;
    }

    /*
     * 数据分发
     * @param (object) data 数据
     */
    _dispatch(data) {
        // 数据行为在监听列表中，分派数据
        const result = this._get(data.type);

        if (result.length === 0) {
            return;
        }

        result[0].callback(data.payload);
    }

    /*
     * 通过action获取监听事件
     * @param (string) action 动作
     * @return (array) result 结果
     */
    _get(action) {
        const result = this._list.filter((obj) => {
            return obj.action === action;
        });

        return result;
    }

    // 存储数据
    setData(key, value) {
        this._data.set(key, value);
    }

    // 获取数据
    getData(key) {
        return this._data.get(key);
    }

    // 删除数据
    deleteData(key) {
        this._data.delete(key);
    }
}