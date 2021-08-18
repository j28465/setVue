export default {
    namespace: true,
    state: {
        cards: [],
        tableTopCards: [],
        hintCards: []
    },
    mutations:{
        pushCard(state: { cards: number[][], tableTopCards: number[][] })
        {   //產生牌
            state.cards = [];
            state.tableTopCards = [];
            for (let a = 1; a <= 3; ++a) {
                for (let b = 1; b <= 3; ++b) {
                    for (let c = 1; c <= 2; ++c) {
                        for (let d = 1; d <= 1; ++d) {
                            state.cards.push([a, b, c, d]);
                        }
                    }
                }
            }
        },
        shuffleCards(state: { cards: number[][] })
        {   //隨機排序
            console.log("shuffleCards");
            let len: number = state.cards.length;
            let index: number;
            let tmp: number[];
            while (len > 0) {
                index = Math.floor(Math.random() * len);
                len--;
    
                tmp = state.cards[len];
                state.cards[len] = state.cards[index];
                state.cards[index] = tmp;
            }
        },
        dealCards(state: { cards: number[][], tableTopCards: number[][] }, index: number)
        {
            console.log("dealCards");
            //發牌
            for(let i = 0; i < index; ++i)
            {
                state.tableTopCards.push(state.cards.pop() as number[]);
            }
        },
        changeCard(state: { cards: number[][], tableTopCards: number[][] }, index: number)
        {
            //清空或在同位置放上新的牌
            state.tableTopCards[index] = state.cards.pop() ?? [];
        },
        removeCard(state: { cards: number[][], tableTopCards: number[][] }, index: number)
        {
            //移除這張牌
            state.tableTopCards.splice(index, 1);
        },
        // checkCards(state: { tableTopCards: Number[][] }, _target: number[])
        // {   //清除桌上成對的牌
        //     state.tableTopCards.forEach((element, index: number) =>{
        //         if(element[0] == _target[0] &&
        //             element[1] == _target[1] &&
        //             element[2] == _target[2] &&
        //             element[3] == _target[3])
        //         {
        //             state.tableTopCards.splice(index, 1);
        //             return;
        //         }
        //     });
        // },
        // pushHintCards(state: { markCards: number[][] }, card: number[])
        // {
        //     //
        //     state.markCards.push(card);
        // },
        pushHintCards(state: { hintCards: number[][] }, card: number[][])
        {
            //符合答案的提示牌組
            state.hintCards = [];
            card.forEach((index: number[]) => 
            {
                state.hintCards.push(index);
            });
            // state.hintCards = card;
        }
    },
    getters:
    {
        drawCard(state: { hintCards: number[][] })
        {   //抽牌一張牌
            //return state.cards.pop()?.join(',') as String;
            return state.hintCards.pop()?.join(',') as string;
        },
        // getTableTopCard(state:{tableTopCards: number[][]}, index: number): number[]
        // {
        //     //選出桌上一張牌
        //     return state.tableTopCards[index];
        // }
        remainingCards(state:{tableTopCards: number[][]}): number{
            return state.tableTopCards.filter(v => v!=[]).length;
        }
    }
}