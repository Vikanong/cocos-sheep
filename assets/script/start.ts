import { _decorator, Component, Node, director } from 'cc';
import request from './request'
const { ccclass, property } = _decorator;

@ccclass('start')
export class start extends Component {
    start() {
        director.preloadScene("game");
    }

    onStart() {
        director.loadScene("game");
        // request({
        //     url: 'http://192.168.110.88:8013/test/test',
        //     method: 'GET',
        //     data: {
        //         type: 1
        //     },
        //     success: function (res) {
        //     },
        //     error: function (err) {
        //     }
        // })
    }
}