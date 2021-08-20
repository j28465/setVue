export default {
    namespace: true,
    state: {
        cards: [],
        tableTopCards: [],
        hintCards: [],
        level: -1
    },
    mutations:{
        pushCard(state: { cards: number[][], tableTopCards: number[][], level: number }, payload: { level: number })
        {   //產生牌
            const lvs: number[][] = [[2,1], [2,2], [3,2], [3,3]];
            state.level = payload.level
            const lv: number[] = lvs[payload.level];
            state.cards = [];
            state.tableTopCards = [];
            //形狀
            for (let a = 1; a <= 3; ++a) 
            {   
                //顏色
                for (let b = 1; b <= 3; ++b) 
                {
                    //填充
                    for (let c = 1; c <= lv[0]; ++c) 
                    {
                        //數量
                        for (let d = 1; d <= lv[1]; ++d) 
                        {
                            state.cards.push([a, b, c, d]);
                        }
                    }
                }
            }
        },
        shuffleCards(state: { cards: number[][] })
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
        dealCards(state: { cards: number[][], tableTopCards: number[][] }, index: number)
        {
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
        removeCard(state: { cards: number[][], tableTopCards: number[][] }, payload: {index: number, remove: boolean})
        {
            //移除這張牌
            state.tableTopCards.splice(payload.index, 1);
        },
        pushHintCards(state: { hintCards: number[][] }, card: number[][])
        {
            //符合答案的提示牌組
            state.hintCards = [];
            card.forEach((index: number[]) => 
            {
                state.hintCards.push(index);
            });
        }
    },
    getters:
    {
        drawCard(state: { hintCards: number[][] })
        {   //抽牌一張牌
            return state.hintCards.pop()?.join(',') as string;
        },
        remainingCards(state:{tableTopCards: number[][]}): number{
            return state.tableTopCards.filter(v => v!=[]).length;
        }
    }
}