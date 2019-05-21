cc.Class({
    extends: cc.Component,

    ctro() {
        this._isChange = false;
    },

    properties: {
        index: {
            default: 0,
            type: cc.Integer
        },
    },

    onLoad() {
        const anim = this.node.getComponent(cc.Animation);

        anim.once('finished', () => {
            cc.log('onLoad', this.index, this._isChange);

            if (this._isChange) {
                return;
            }

            this._isChange = true;

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

    changeStage() {
        cc.log('changeStage', this.index);

        if (this._isChange) {
            return;
        }

        this._isChange = true;

        utils.mediator.emit({
            cmd: utils.ACTION.CHANGE_STAGE,
            data: {
                index: this.index
            }
        });
    },

    // 更新音量
    mute() {
        utils.mediator.emit({
            cmd: utils.ACTION.MUTE
        });
    }
});