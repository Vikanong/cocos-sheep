import { _decorator, Component, Node, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('start')
export class start extends Component {
    start() {
        director.preloadScene("game");
    }

    onStart() {
        director.loadScene("game");
    }
}

