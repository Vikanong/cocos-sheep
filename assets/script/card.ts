import { _decorator, Component, Node, SpriteFrame, Sprite, Color, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('card')
export class card extends Component {

    public _clickable: boolean = true

    private _point: number = null
    private _index: number = null
    private _type: number = null

    @property({ type: SpriteFrame })
    public card1: SpriteFrame = null
    @property({ type: SpriteFrame })
    public card2: SpriteFrame = null
    @property({ type: SpriteFrame })
    public card3: SpriteFrame = null
    @property({ type: SpriteFrame })
    public card4: SpriteFrame = null
    @property({ type: SpriteFrame })
    public card5: SpriteFrame = null
    @property({ type: SpriteFrame })
    public card6: SpriteFrame = null
    @property({ type: SpriteFrame })
    public card7: SpriteFrame = null
    @property({ type: SpriteFrame })
    public card8: SpriteFrame = null
    @property({ type: SpriteFrame })
    public card9: SpriteFrame = null
    @property({ type: SpriteFrame })
    public card10: SpriteFrame = null

    public setIcon(type: number) {
        let icon = this.node.getChildByName('icon');
        icon.getComponent(Sprite).spriteFrame = this[`card${type}`];
        icon.setScale(0.5, 0.5);
    }

    public setCard(point: number, index: number, type: number) {
        this._point = point;
        this._index = index;
        this._type = type;
        this.setIcon(type);
    }


    public setIndex(t) {
        let indexLabel = this.node.getChildByName('indexLabel');
        indexLabel.getComponent(Label).string = t;
    }

    public prohibit() {
        const c = new Color(150, 137, 137, 255);
        let _sprite = this.node.getComponent(Sprite);
        _sprite.color = c;
        let icon = this.node.getChildByName('icon').getComponent(Sprite);
        icon.color = c;
    }


    update(deltaTime: number) {
        const c = this._clickable ? new Color(255, 255, 255, 255) : new Color(150, 137, 137, 255);
        let _sprite = this.node.getComponent(Sprite);
        _sprite.color = c;
        let icon = this.node.getChildByName('icon').getComponent(Sprite);
        icon.color = c;
    }
}

