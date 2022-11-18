// 随机生成卡片位置

import { _decorator, Component, Node, Label, Prefab, Vec3, math, tween, instantiate, Input, Color, Sprite } from 'cc';
import { card } from './card';
import { GameManager } from './gameManager'

const { ccclass, property } = _decorator;

interface cardInfo {
    index: number;
    pos: number;
    isClick: boolean;
    type: number;
}

@ccclass('gaming')
export class gaming extends Component {

    @property
    public _gameManager: GameManager = null

    // 容器
    @property({ type: Node })
    public container: Node = null

    // 卡牌
    @property({ type: Prefab })
    public cardPrefab: Prefab = null

    // 游戏结束界面
    @property(Node)
    public gameOverPage: Node = null

    // 游戏完成界面
    @property(Node)
    public gameOverSuccessPage: Node = null

    // 卡牌宽高
    private _cardWidth: number = 80
    private _cardHeight: number = 80

    // 点位数量
    private _point: number = 182
    // 总坐标
    private _pointPostion: object = {}

    // 总生成卡牌数
    private _cardTotal = 225

    // 当前剩余的卡片数量
    private _remainingCardNum = 225

    // 所有卡片
    private _allCard: cardInfo[] = []

    // 每个坐标的卡片
    private _cardsObj: object = {}

    // 每类多少张卡片数组
    private _typeNumArr: number[] = []

    // 卡牌总类型
    private _cardTypeTotal: number = 15

    // 游戏状态
    private gameStatus = 0   //0：游戏准备，1：游戏进行中，2：游戏结束

    // 暂存的卡片
    private columnArr: object[] = []

    // 是否可以点击
    private isClick: boolean = true

    // 可撤销次数
    private withdrawTotal: number = 5
    @property(Label)
    public withdrawTotalLabel: Label = null

    // 可洗牌次数
    private shuffleTotal: number = 2
    @property(Label)
    public shuffleTotalLabel: Label = null


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
        for (let i = 0; i < this._cardTotal; i++) {

            let Card = instantiate(this.cardPrefab);
            let cardComponent = Card.getComponent(card);
            // const _type = math.randomRangeInt(1, this._cardTypeTotal + 1);
            const _type = this.getCurrentType();
            // console.log(_type);

            const pointPos = math.randomRangeInt(1, this._point + 1);
            cardComponent.setCard(pointPos, i, _type);

            const pos = this._pointPostion[pointPos];

            this.container.addChild(Card);
            this._allCard.push({
                index: i,
                pos: pointPos,
                isClick: true,
                type: _type
            });

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

        this.gameStatus = 1;
    }


    // 生成每类卡片数量
    private randomType(m, num) {
        const n = this._cardTotal / this._cardTypeTotal;
        for (let i = 0; i < this._cardTypeTotal; i++) {
            this._typeNumArr.push({
                type: i + 1,
                num: n
            })
        }
        // console.log(this._typeNumArr);
        // _typeNumArr
        // var m = m, Num = num, arr = [], all = m
        // for (var i = 1; i < Num; i++) {
        //     var n1 = Math.floor(Math.random() * m + 1)
        //     if (n1 < 9) {
        //         n1 = 9
        //     }
        //     if (n1 > 20) {
        //         n1 = 20
        //     }
        //     arr.push(n1)
        //     m = m - n1
        //     if (i == Num - 1) {
        //         let sum = 0;
        //         for (let i = 0; i < arr.length; i++) {
        //             sum += Number(arr[i])
        //         }
        //         var last = all - sum
        //         arr.push(last)
        //     }
        // }
        // return arr;
    }

    // 生成当前卡牌类型
    private getCurrentType() {
        let t = null;
        let l = math.randomRangeInt(0, this._typeNumArr.length);
        t = this._typeNumArr[l].type;
        this._typeNumArr[l].num--;

        if (this._typeNumArr[l].num == 0) {
            this._typeNumArr.splice(l, 1);
        }
        return t
    }

    // 点击卡片
    private cardClick(e) {
        if (!this.isClick) return;
        const l = this.columnArr.length;
        if (l < 7) {
            let node = e.currentTarget;
            let Card = node.getComponent(card)
            if (Card._clickable) {
                this.isClick = false;
                node.off(Input.EventType.TOUCH_START, this.cardClick, this);

                let arr = this._cardsObj[Card._point];
                this._cardsObj[Card._point].splice(arr.indexOf(Card._index), 1);
                this._allCard[Card._index].isClick = false;

                this.columnArr.push({
                    index: Card._index,
                    point: Card._point,
                    type: Card._type
                });

                this.clickableCheck(Card);
                node.setSiblingIndex(999);
                const x = this.columnArr.length * 80 - 40;
                tween(node).to(0.1, { scale: new Vec3(1.13, 1.13, 1.13) }).to(0.3, { position: new Vec3(x, -835, 0) }).to(0.1, { scale: new Vec3(1, 1, 1) }).call(() => {
                    node.setSiblingIndex(Card._index);
                    this.eliminate();
                    // this.isClick = true;
                }).start();
            }
        }

    }

    // 判断当前卡片点击后，盖住的卡片那些高亮
    private clickableCheck(_card) {
        const roundArr = this.getRound(_card._point);
        roundArr.forEach(point => {
            const i_arr = this._cardsObj[point];
            if (i_arr !== undefined) {
                if (i_arr.length > 0) {
                    const ind = i_arr.slice(-1)[0];
                    const is = this.isCardTop(point, ind, _card._index);
                    if (is) {
                        let item = this.container.children[ind];
                        let _itemCard = item.getComponent(card);
                        _itemCard._clickable = true;
                    }
                }
            }
        })
    }

    // 撤回一步
    private withdraw() {
        if (this.gameStatus != 1) return;
        if (this.withdrawTotal <= 0) return;
        this.withdrawTotal--;
        this.withdrawTotalLabel.string = this.withdrawTotal.toString();

        if (this.columnArr.length <= 0) return;
        this.isClick = false;

        const obj = this.columnArr.slice(-1)[0];
        this.columnArr.pop();
        if (this._cardsObj[obj.point]) {
            this._cardsObj[obj.point].push(obj.index);
        } else {
            this._cardsObj[obj.point] = [obj.index];
        }
        let node = this.container.children[obj.index];
        let Card = node.getComponent(card)
        const pos = this._pointPostion[obj.point];
        node.setSiblingIndex(999);
        tween(node).to(0.3, { position: new Vec3(pos.x, pos.y, 0) }).call(() => {
            node.setSiblingIndex(obj.index);
            node.on(Input.EventType.TOUCH_START, this.cardClick, this);
            this.checkAround(Card);
        }).start();
    }

    // 撤回后原位置后附近卡牌置灰
    private checkAround(Card) {
        const roundArr = this.getRound(Card._point);
        console.log(roundArr);
        roundArr.forEach(point => {
            if (point != Card._point) {
                const i_arr = this._cardsObj[point];
                if (i_arr !== undefined) {
                    const ind = i_arr.slice(-1)[0];
                    let item = this.container.children[ind];
                    let _itemCard = item.getComponent(card);
                    _itemCard._clickable = false;
                }
            }
        })
        this.isClick = true;
    }



    // 判断传入卡片是否是周围卡片的顶层
    private isCardTop(point, index, exclude) {
        const pointArr = this.getRound(point);
        const is = pointArr.every(p => {
            if (p > 0 && p <= this._point) {
                const i_arr = this._cardsObj[p];
                if (i_arr) {
                    const n_i_arr = i_arr.filter(i => i != exclude && i != index);
                    if (n_i_arr.length > 0) {
                        const a = n_i_arr.slice(-1)[0];
                        return a <= index;
                    }
                }
            }
            return true
        })
        return is;
    }

    // 获取当前点位周围的坐标
    private getRound(pos) {
        const i = 13;
        let arr = [pos];
        if (pos > 13) {
            arr.push(pos - i);
        }
        if (pos < 170) {
            arr.push(pos + i);

        }
        if (pos % i != 0) {
            arr.push(pos + 1);

            if (pos < 170) {
                arr.push(pos + i + 1)
            }

            if (pos > 13) {
                arr.push(pos - i + 1);
            }
        }
        if (pos % i != 1) {
            arr.push(pos - 1);

            if (pos < 170) {
                arr.push(pos + i - 1)
            }

            if (pos > 13) {
                arr.push(pos - i - 1);
            }
        }
        return arr;
    }

    // 三消逻辑
    private eliminate() {
        this.isClick = false;
        let temp = [];
        const is = this.columnArr.every(item => {
            const arr = this.columnArr.filter(i => {
                return item.type == i.type
            });
            if (arr.length == 3) {
                arr.forEach(i => {
                    const ind = this.columnArr.indexOf(i);
                    this.columnArr.splice(ind, 1);

                    const node = this.container.children[i.index];
                    tween(node).to(0.15, { scale: new Vec3(0.2, 0.2, 0.2) }).call(() => {
                        node.active = false;
                    }).start();
                })
                this._remainingCardNum -= 3;
                return false;
            }
            return true;
        });

        if (is || this.columnArr.length == 0) {
            this.isClick = true;
        } else {
            // this.scheduleOnce(() => {
            this.resetColumnPos();
            // }, 0.16);
        }

        // 游戏结束
        if (this.columnArr.length >= 7) {
            this.gameStatus = 2;
            this.isClick = false;
            this.gameOver();
        }
        // console.log(this._remainingCardNum);

        if (this._remainingCardNum <= 0) {
            this.gameOverSuccess();
        }
    }

    // 重置位置
    private resetColumnPos() {
        // this.isClick = false;
        this.columnArr.forEach((item, i) => {
            let node = this.container.children[item.index];
            const x = (i + 1) * 80 - 40;
            tween(node).to(0.15, { position: new Vec3(x, -835, 0) }).start();
            this.isClick = true;
        })
    }

    // 重新洗牌
    private shuffle() {
        if (this.shuffleTotal <= 0) return;
        this.shuffleTotal--;
        this.shuffleTotalLabel.string = this.shuffleTotal.toString();

        const arr = this._allCard.filter(i => i.isClick == true);
        let first_t = null;
        this._allCard.forEach((item, i) => {
            if (item.isClick) {
                const node = this.container.children[item.index];
                let t = null;
                if (!first_t) first_t = item.type;

                let nextItem = this._allCard.slice(i + 1).find(item_n => (item_n.isClick));
                if (nextItem) {
                    t = nextItem.type;
                } else {
                    t = first_t;
                }

                item.type = t;
                const pos = this._pointPostion[item.pos];
                tween(node).to(0.3, { position: new Vec3(280, -350, 0) }).call(() => {
                    let _card = node.getComponent(card);
                    _card.setIcon(t);
                }).delay(0.1).to(0.4, { position: new Vec3(pos.x, pos.y, 0) }).start();
            }
        })
    }

    // 重置游戏
    private resetGame() {
        this._allCard = [];
        this._cardsObj = {};
        this.gameStatus = 0;
        this.columnArr = [];
        this.isClick = true;
        this._remainingCardNum = this._cardTotal;
        this.container.removeAllChildren();
        this.container.destroyAllChildren();
        this.gameOverPage.active = false;
        this.gameOverSuccessPage.active = false;
        this.withdrawTotal = 3;
        this.withdrawTotalLabel.string = this.withdrawTotal.toString();

        this.shuffleTotal = 2;
        this.shuffleTotalLabel.string = this.shuffleTotal.toString();

        this.randomType();
        this.createCard();
    }

    // 游戏失败
    private gameOver() {
        this.gameOverPage.active = true
    }

    // 游戏完成 并结束
    private gameOverSuccess() {
        this.gameOverSuccessPage.active = true
    }

    private _init() {
        this.getCoordinates();
        this.randomType();
        this.createCard();
        this.withdrawTotalLabel.string = this.withdrawTotal.toString();
        this.shuffleTotalLabel.string = this.shuffleTotal.toString();
    }


    start() {
        this._init();
    }

    update(deltaTime: number) {

    }
}

