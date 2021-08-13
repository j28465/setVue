export default {
    namespace: true,
    state: {
        cards: [],
        tableTopCards: [],
        markCards: [],
        test: "ttt"
    },
    mutations:{
        pushCard(state: { cards: number[][] })
        {   //產生牌
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
        shuffle(state: { cards: number[][] })
        {   //隨機排序
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
        deal(state: { cards: number[][], tableTopCards: number[][] }, index: number)
        {
            //清空或在同位置放上新的牌
            state.tableTopCards[index] = state.cards.pop() ?? [];
        },
        dealNew(state: { cards: number[][], tableTopCards: number[][] }, index: number)
        {
            //發牌
            for(let i = 0; i < index; ++i)
            {
                state.tableTopCards.push(state.cards.pop() as number[]);
            }
        },
        removeTableTopCards(state: { cards: number[][], tableTopCards: number[][] }, index: number)
        {
            //
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
        // pushMarkCards(state: { markCards: number[][] }, card: number[])
        // {
        //     //
        //     state.markCards.push(card);
        // },
        pushMarkCards(state: { markCards: number[][], tableTopCards: number[][] }, card: number[][])
        {
            state.markCards = [];
            card.forEach((index: number[]) => 
            {
                state.markCards.push(index);
            });
        }
    },
    getters:
    {
        drawCard(state: { markCards: number[][] })
        {   //抽牌一張牌
            //return state.cards.pop()?.join(',') as String;
            return state.markCards.pop()?.join(',') as string;
        },
        getCards(state: { cards: number[][] }): number[][]
        {   
            //海底的所有牌
            return state.cards;
        },
        getTableTopCard(state:{tableTopCards: number[][]}, index: number): number[]
        {
            //選出桌上一張牌
            return state.tableTopCards[index];
        },
        getTableTopCards(state:{tableTopCards: number[][]}): number[][]
        {
            //桌面上的所有牌
            return state.tableTopCards;
        },
        getMarkCards(state: { markCards: number[][] })
        {
            return state.markCards;
        }
    }
}