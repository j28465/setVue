<template>
    <Msg></Msg>
    <div id="box">
        <h4 id="time">0時0分0秒</h4>
        <div id="remain">剩下{{this.$store.state.card.cards.length}}張牌</div>
        <button type="button" @click="this.$store.commit('pushCard', { level: this.$store.state.card.level}); this.start();">重新開始</button> |
        <button type="button" @click="hintClick">提示or無解答</button> |
        <button type="button" @click="$router.push('remaining')">剩下牌組</button>
        <div id="tableBoard">
            <Card v-for="c in this.$store.state.card.tableTopCards" :key="c" :ary="c.join(',')"></Card>
        </div>
    </div>
</template>

<script lang="ts">
import Card from '@/components/Card.vue'
import Msg from '@/components/MsgBox.vue'
import { defineComponent } from 'vue'
import { mapState, mapMutations, mapGetters } from 'vuex'

class desk{
    tableBoard: HTMLElement;
    clickAry: number[][];

    constructor(){
        this.tableBoard = new HTMLElement;
        this.clickAry = [];
    }
}

export default defineComponent({
    components:{
        Card, Msg
    },
    data(): desk
    {
        return {
            tableBoard: document.getElementById("tableBoard") as HTMLFormElement,            
            clickAry: []    //已選擇的牌
        }
    },
    mounted(): void{
        this.tableBoard = document.getElementById("tableBoard") as HTMLFormElement;
        if(this.tableTopCards.length == 0) {
            if(this.cards.length == 0) 
                this.$router.push("/");
            else
                this.start();
        }
    }, 
    computed: {
        //...mapState("card", ["cards", "tableTopCards", "hintCards"]),
        ...mapState({
            cards: (state: any) => state.card.cards,
            tableTopCards: (state: any) => state.card.tableTopCards,
            hintCards: (state: any) => state.card.hintCards
        })
    },
    methods:
    {
        ...mapMutations(["openMsg", "pushCard", "shuffleCards", "dealCards", "changeCard", "removeCard", "pushHintCards"]),
        ...mapGetters(["drawCard", "remainingCards"]),
        start(): void
        {
            //隨機排序
            this.shuffleCards();
            //紀錄現在檯面上的牌
            this.dealCards(12);
        },
        choose(t: HTMLElement):void 
        {
            let target: HTMLElement = t;
            //選取的card
            while (!target.classList.contains("card")) 
            {
                target = target.parentNode as HTMLElement;
            }

            if (target.classList.contains("lock")) {
                //取消選擇
                var index = this.clickAry.indexOf(target.getAttribute("data-ary")?.split(',').map(v => parseInt(v)) as number[]);
                this.clickAry.splice(index, 1);
                target.classList.remove("lock");
            }
            else {
                this.clickAry.push(target.getAttribute("data-ary")?.split(',').map(v => parseInt(v)) as number[]);
                target.classList.add("lock");
                if(this.clickAry.length == 3){
                    //檢查所選牌組是否符合
                    let jdg: boolean = this.verify(this.clickAry);
                    //清空、(發牌)、解除反灰
                    this.distribute(jdg);
                }
            }            
        },
        distribute (jdg = true): void 
        {   
            //補牌
            //清空
            this.clickAry = [];
            //答對
            if (jdg) 
            {        
                 setTimeout( () => { 
                    //被刪除的牌INDEX
                    let rmIndex  = 0;
                    this.tableBoard.classList.add("ans");
                    document.querySelectorAll("#tableBoard .card").forEach((e, i) =>{ 
                        if(e.classList.contains("lock")){
                            if(this.tableTopCards.length > 12)
                            {
                                //刪除外框
                                e.remove();
                                //清除現在檯面上被選走的牌
                                this.removeCard({index: i-rmIndex});
                                rmIndex++;
                            }
                            else
                            {                                
                                //清空或在同位置放上新的牌
                                this.changeCard(i);
                                let len:number[][] = this.tableTopCards.filter((v: number[]) => v.length != 0);
                                if(len.length == 0)
                                    this.openMsg({title: "遊戲結束"});
                                
                            }
                        }
                    });
                    //解除反灰
                    this.tableBoard.classList.remove("ans");
                    document.querySelectorAll("#tableBoard div.lock").forEach(function(e){ e.classList.remove("lock"); });
                 }, 500);
            }
            else
            {
                //解除反灰   
                setTimeout(function () {
                    document.querySelectorAll("#tableBoard div.lock").forEach(function(e){
                        e.classList.remove("lock");
                    });
                }, 300);
                this.openMsg({title: "答錯ㄌ"});
            }
        },
        hintClick(): void 
        {   
            //提示or無解答
            if(this.hintCards.length > 0)
            {
                //選擇第二或三張牌
                let target: number[] = this.drawCard();
                this.clickAry.push(target);
                document.querySelectorAll("#tableBoard div[data-ary='"+ target +"']")[0].classList.add("lock");
                //第三張牌的話，清空、(發牌)、解除反灰
                if(this.hintCards.length == 0) this.distribute();
            }
            else
            {
                let jdg = false;
                //產生一組解答
                let len = this.tableTopCards.length;
                for(let t1 = 0; t1 < len; ++t1)
                {
                    if(this.tableTopCards[t1].length > 0)
                    {
                        for(let t2 = t1+1; t2 < len; ++t2)
                        {
                            if(this.tableTopCards[t2].length > 0)
                            {
                                for(let t3 = t2+1; t3 < len; ++t3)
                                {
                                    if(this.tableTopCards[t3].length > 0)
                                    {
                                        let tmp: number[][] = [this.tableTopCards[t1],this.tableTopCards[t2],this.tableTopCards[t3]];
                                        jdg = this.verify(tmp);
                                        
                                        if (jdg) {
                                            console.log(tmp);
                                            this.pushHintCards(tmp);
                                            break;
                                        }
                                    }
                                }
                                if (jdg) break;
                            }
                        }
                        if (jdg) break;
                    }
                }
                //有無解答
                if(jdg)
                {   
                    //清空所選
                    this.clickAry = [];
                    //解除全部反灰
                    document.querySelectorAll("#tableBoard div.lock").forEach(function(e){
                        e.classList.remove("lock");
                    });
                    //選擇第一張牌                  
                    this.hintClick();
                }
                else    
                {
                    //沒答案發牌
                    if(this.cards.length > 0)
                    {
                        this.dealCards(3);
                    }
                    else
                    {
                        //clearInterval(Timer);
                        this.openMsg({title: "遊戲結束"});
                    }
                }
            }
        },
        verify(ary: number[][]): boolean
        {
            //檢查所選牌組是否符合
            let jdg = true;
            for (let i = 0; i <= 3; ++i) {
                let tmp = 0;
                //三張牌
                for (var j = 0; j <= 2; ++j) {
                    tmp += ary[j][i];
                }
                //有誤
                if (tmp % 3 > 0) {
                    jdg = false;
                    break;
                }
            }
            return jdg;
        }
    }
});
</script>

<style lang="sass">
    html, body 
        touch-action: manipulation
        #box 
            text-align: center
            position: relative
            max-width: 746px
            width: 100%
            margin: 0 auto
            #time
                height: 1em
            #remain
                position: absolute
                right: 0
            #tableBoard 
                padding-top: 18px
                .card.lock 
                    background: #ccc
            #tableBoard.ans 
                .card.lock 
                    border-color: #707070
</style>