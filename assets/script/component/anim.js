cc.Class({
    extends: cc.Component,

    properties: {
        index: {
            default: 0,
            type: cc.Integer
        },
    },

    onLoad() {
        const anim = this.node.getComponent(cc.Animation);

        anim.once('finished', () => {
            utils.mediator.emit({
                cmd: utils.ACTION.CHANGE_STAGE,
                data: {
                    index: this.index
                }
            });
        }, this);
    },

    start() {

    },

    // update (dt) {},

    changeStage(name) {
        cc.log(name);
    }
});