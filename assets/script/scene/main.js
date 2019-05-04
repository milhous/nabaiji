// 工具
import utils from 'utils.game';

let SCENE = null;
let ACTION = null;

cc.Class({
    extends: cc.Component,

    properties: {
        config: {
            default: null,
            type: cc.JsonAsset,
        },
        btnStart: {
            default: null,
            type: cc.Node,
            tooltip: '按钮 - 开始'
        },
        forewordAnim: {
            default: null,
            type: cc.Animation,
            tooltip: '组件 - 动画'
        },
    },

    onLoad() {
        // 初始化配置
        this.initConfig();

        // 初始化组件
        this.initComponent();

        // 初始化事件
        this.initEvent();

        // 初始化组件数据连接
        this.initConnect();
    },

    start () {

    },

    update(dt) {
        utils.mediator.update(dt);
    },

    // 初始化配置
    initConfig() {
        const config = this.config.json;
        utils.SCENE = SCENE = config.SCENE;
        utils.ACTION = ACTION = config.ACTION;

        // 关闭全屏
        cc.view.enableAutoFullScreen(false);
    },

    // 初始化组件
    initComponent() {
    },

    // 初始化事件
    initEvent() {
        this.btnStart.on(cc.Node.EventType.TOUCH_END, () => {
            this.changeStage(1);
        }, this);
    },

    // 组件数据连接
    initConnect() {
        // 切换舞台
        utils.mediator.add({
            scene: SCENE.MAIN,
            action: ACTION.CHANGE_STAGE,
            callback: (props) => {
                cc.log(props);
            }
        });
    },

    // 切换舞台
    changeStage(index) {
        switch (index) {
            case 1:
                this.forewordAnim.play();

                break;
            default:
                // statements_def
                break;
        }
    }
});
