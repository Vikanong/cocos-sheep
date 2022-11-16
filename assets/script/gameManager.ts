import { _decorator, Component, Node, SpriteFrame, director, AudioSource } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    @property(Node)
    public bgmIcon: Node = null;

    @property(SpriteFrame)
    public bgmPauseIcon: SpriteFrame = [];

    @property(AudioSource)
    public bgmAudioSource: AudioSource = null;

    private backHome() {
        director.loadScene("start");
    }

    // 背景音乐
    public controlBgm() {
        const sprite = this.bgmIcon.getComponent(cc.Sprite);
        if (this.bgmAudioSource.playing) {
            this.bgmAudioSource.pause();
            sprite.spriteFrame = this.bgmPauseIcon[1];
        } else {
            this.bgmAudioSource.play();
            sprite.spriteFrame = this.bgmPauseIcon[0];
        }
    }
}

