import { _decorator, Component, Node, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    start() {
    }

    update(deltaTime: number) {

    }




    private backHome() {
        director.loadScene("start");
    }

    gameOver() {
        console.log("game Over");
    }
}

