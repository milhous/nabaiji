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
        btnPass: {
            default: null,
            type: cc.Node,
            tooltip: '按钮 - 跳过'
        },
        btnFast: {
            default: null,
            type: cc.Node,
            tooltip: '按钮 - 加速'
        },
        forewordAnim: {
            default: null,
            type: cc.Animation,
            tooltip: '组件 - 动画'
        },
        sueAnim: {
            default: [],
            type: [cc.Animation],
            tooltip: '组件 - 动画'
        },
        zoeAnim: {
            default: null,
            type: cc.Animation,
            tooltip: '组件 - 动画'
        },
        adaAnim: {
            default: null,
            type: cc.Animation,
            tooltip: '组件 - 动画'
        }
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
        // 自动播放音效
        this.audioAutoPlay();
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
        this.forewordAnim.node.on(cc.Node.EventType.TOUCH_END, () => {
            this.changeStage(1);
        }, this);

        this.btnPass.on(cc.Node.EventType.TOUCH_START, (evt) => {
            evt.stopPropagation();
            
            this.goToUrl();
        }, this);

        this.btnFast.on(cc.Node.EventType.TOUCH_START, (evt) => {
            evt.stopPropagation();
            
            this.fast();
        }, this);
    },

    // 组件数据连接
    initConnect() {
        // 切换舞台
        utils.mediator.add({
            scene: SCENE.MAIN,
            action: ACTION.CHANGE_STAGE,
            callback: (props) => {
                cc.log(props.index);

                this.changeStage(props.index);
            }
        });

        // 切换舞台
        utils.mediator.add({
            scene: SCENE.MAIN,
            action: ACTION.MUTE,
            callback: (props) => {
                this.mute();
            }
        });
    },

    // 自动播放
    audioAutoPlay() {
        var audio = document.getElementById('audio');

        if (audio === null) {
            return;
        }

        if (window.WeixinJSBridge) {
            WeixinJSBridge.invoke('getNetworkType', {}, function(e) {
                audio.play();
            }, false);
        } else {
            document.addEventListener('WeixinJSBridgeReady', function() {
                WeixinJSBridge.invoke('getNetworkType', {}, function(e) {
                    audio.play();
                });
            }, false);
        }

        audio.play();
    },

    // 切换舞台
    changeStage(index) {
        switch (index) {
            case 1:
                this.forewordAnim.play();

                this.sueAnim[0].play();

                break;
            case 2:
                this.sueAnim[1].play();

                break;
            case 3:
                this.sueAnim[2].play();

                break;
            case 4:
                this.sueAnim[2].node.parent.active = false;

                this.zoeAnim.play();

                break;
            case 5:
                this.zoeAnim.node.active = false;

                this.adaAnim.play();

                break;
            case 6:
                this.goToUrl();

                break;
            default:
                // statements_def
                break;
        }
    },

    // 跳过
    goToUrl() {
        location.href = 'http://nabaiji.yuncoupons.com/photo.php';
    },

    // 静音
    mute() {
        const audio = document.getElementById('audio');

        if (!!audio) {
            let volume = 100;
            const diff = 10;

            let timer = setInterval(() => {
                if (volume > 0) {
                    volume -= diff;

                    audio.volume = volume / 100;
                } else {
                    clearInterval(timer);
                }
            }, 200);
        }
    },

    // 加速
    fast() {
        this.btnFast.active = false;

        cc.director.getScheduler().setTimeScale(1.5)
    }
});
