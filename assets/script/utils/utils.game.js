// 工具类 - 数据中介转发
import Mediator from 'Mediator.game';

const utils = {
    mediator: new Mediator()
};

export default utils;

if (typeof window !== 'undefined') {
    // exports to window
    window.utils = utils
}