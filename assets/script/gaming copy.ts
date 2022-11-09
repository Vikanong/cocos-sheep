import { _decorator, Component, Node, Prefab, Vec3, math, tween, instantiate, Input, Color, Sprite } from 'cc';
import { card } from './card';

const { ccclass, property } = _decorator;

interface cardInfo {
    zIndex: number;
    pos: number;
}

@ccclass('gaming')
export class gaming extends Component {

    // 容器
    @property({ type: Node })
    public container: Node = null

    // 卡牌
    @property({ type: Prefab })
    public cardPrefab: Prefab = null

    // 卡牌宽高
    private _cardWidth: number = 80
    private _cardHeight: number = 80

    // 点位数量
    private _point: number = 182
    private _pointPostion: object = {}

    // 总卡牌数
    private _cardTotal = 40
    // 所有卡片
    private _allCard: cardInfo[] = []

    private _cardsObj: object = {}

    // 每层多少张卡
    private _layerNumArr: number[] = []


    // 卡牌总类型
    private _cardTypeTotal: number = 5

    // 最大层级
    private _zIndex = 8

    // 游戏状态
    private gameStatus = 0   //0：游戏准备，1：游戏进行中，2：游戏结束


    // 生成总坐标
    private getCoordinates() {
        const a = this._cardWidth / 2;
        let x = 0;
        let y = 0;
        for (let i = 1; i <= this._point; i++) {
            x += a;
            if ((i - 1) % 13 == 0) {
                x = a;
                y -= a;
            }
            this._pointPostion[i] = { x, y };
        }
    }

    // 生成卡片
    private createCard() {
        // const zIndex = math.randomRangeInt(6, this._zIndex);
        // this._layerNumArr = this.randomLevel(this._cardTotal, zIndex);
        // console.log(this._layerNumArr);
        // let s = this._layerNumArr[0];
        // let z = 1;

        for (let i = 0; i < this._cardTotal; i++) {

            // if (i === s && s < this._cardTotal) {
            //     z++;
            //     s += this._layerNumArr[z - 1];
            // }

            let Card = instantiate(this.cardPrefab);
            let cardComponent = Card.getComponent(card);
            const _type = math.randomRangeInt(1, this._cardTypeTotal + 1);
            cardComponent.setIcon(_type);

            const pointPos = math.randomRangeInt(1, this._point + 1);

            const pos = this._pointPostion[pointPos];

            this.container.addChild(Card);

            this._allCard.push({
                index: i,
                pos: pointPos,
            });

            // cardComponent.setIndex(`${i}_${pointPos}`);
            cardComponent.setPosition(pointPos, i);

            Card.setPosition(new Vec3(280, -300, 0));
            tween(Card).to(0.5, { position: new Vec3(pos.x, pos.y, 0) }).call(() => {
                Card.on(Input.EventType.TOUCH_START, this.cardClick, this);
            }).start();

            const roundArr = this.getRound(pointPos);
            for (let r = 0; r < roundArr.length; r++) {
                const n = roundArr[r];
                const arr = this._cardsObj[n];

                if (arr !== undefined) {
                    for (let a = 0; a < arr.length; a++) {
                        const ele = arr[a];
                        if (ele < i) {
                            let item = this.container.children[ele];
                            let _card = item.getComponent(card);
                            _card._clickable = false;
                        }
                    }
                }
            }
            if (this._cardsObj[pointPos]) {
                this._cardsObj[pointPos].push(i)
            } else {
                this._cardsObj[pointPos] = [i];
            }
        }
    }

    private randomLevel(m, num) {
        var m = m, Num = num, arr = [], all = m
        for (var i = 1; i < Num; i++) {
            var n1 = Math.floor(Math.random() * m + 1)
            if (n1 < 9) {
                n1 = 9
            }
            if (n1 > 20) {
                n1 = 20
            }
            arr.push(n1)
            m = m - n1
            if (i == Num - 1) {
                let sum = 0;
                for (let i = 0; i < arr.length; i++) {
                    sum += Number(arr[i])
                }
                var last = all - sum
                arr.push(last)
            }
        }
        return arr;
    }


    private cardClick(e) {
        let node = e.currentTarget;
        let Card = node.getComponent(card)
        // console.log(node);
        if (Card._clickable) {
            // node.active = false;
            this.clickableCheck(Card);

            node.setPosition(500, 500)

            // this.isCardTop(Card._point, Card._index);
        }
    }


    private clickableCheck(_card) {
        const roundArr = this.getRound(_card._point);
        console.log("roundArr", roundArr);

        console.log("_card.index", _card._index);

        roundArr.forEach(point => {
            const i_arr = this._cardsObj[point];

            if (i_arr !== undefined) {
                const n_i_arr = i_arr.filter(i => i != _card._index);
                if (n_i_arr.length > 0) {
                    const ind = n_i_arr.slice(-1)[0];
                    const is = this.isCardTop(point, ind, _card._index);
                    console.log("is", is);
                    if (is) {
                        // console.log("point", point);
                        // console.log("ind", ind);
                        let item = this.container.children[ind];
                        // console.log("item", item);
                        let _itemCard = item.getComponent(card);
                        _itemCard._clickable = true;
                        // item.active = false;
                    }
                }
            }
        })
    }

    private isCardTop(point, index, exclude) {
        const pointArr = this.getRound(point);
        const is = pointArr.every(p => {
            if (p > 0 && p < this._point) {
                const i_arr = this._cardsObj[p];
                // console.log(index, i_arr);
                if (i_arr) {
                    // console.log("i_arr", i_arr, exclude);
                    const n_i_arr = i_arr.filter(i => i != exclude && i != index);
                    // console.log("n_i_arr", n_i_arr);
                    if (n_i_arr.length > 0) {
                        const a = n_i_arr.slice(-1)[0];
                        // console.log(a);
                        // console.log(index);
                        return a <= index;
                    }
                }
            }
            return true
        })
        return is;
    }

    private getRound(pos) {
        const i = 13;
        let arr = [pos - i, pos + i, pos];
        if (pos != 1 && pos % i != 1) {
            arr = arr.concat([pos - i - 1, pos - 1, pos + i - 1]);

        }
        if (pos % i != 0) {
            arr = arr.concat([pos - i + 1, pos + 1, pos + i + 1]);
        }
        return arr;
    }


    public _init() {
        this.getCoordinates();
        this.createCard();
    }


    start() {
        this._init();
    }

    update(deltaTime: number) {

    }
}

