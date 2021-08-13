<template>
    <Msg></Msg>
    <div id="box">
        <h4 id="time">0時0分0秒</h4>
        <button type="button" @click="hintClick">提示or無解答</button>
        <button type="button" @click="hintClick">剩下牌組</button>
        <div id="tableBoard">
            <Card v-for="c in this.$store.getters.getTableTopCards" :key="c" :ary="c.join(',')"></Card>
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
        //產生所有牌
        this.pushCard();
        //隨機排序
        this.shuffle();
        //紀錄現在檯面上的牌
        if(this.getTableTopCards.length == 0) this.dealNew(12);
    },
    // computed:{
    //     ...mapState(["test"])
    // },
    methods:
    {
        //...mapState(["test"]),
        ...mapMutations(["openMsg", "pushCard", "shuffle", "deal", "dealNew", "removeTableTopCards", "pushMarkCards"]),
        ...mapGetters(["drawCard", "getCards", "getTableTopCard", "getTableTopCards", "getMarkCards"]),
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
                    this.tableBoard.classList.add("ans");
                    document.querySelectorAll("#tableBoard .card").forEach((e, i) =>{ 
                        if(e.classList.contains("lock")){
                            if(this.getTableTopCards.length > 12)
                            {
                                //清除現在檯面上被選走的牌
                                this.removeTableTopCards(i);
                                //刪除外框
                                e.remove();
                            }
                            else
                            {                                
                                //清空或在同位置放上新的牌
                                this.deal(i);
                                // let len:number[] = this.getTableTopCards().map((v: number[]) => v as number[] != []);
                                // console.log(len);
                                // if(len.length == 0)
                                //     this.openMsg({title: "遊戲結束"});
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
            if(this.getMarkCards().length > 0)
            {
                // //選擇第二或三張牌
                let target: number[] = this.drawCard();
                this.clickAry.push(target);
                document.querySelectorAll("#tableBoard div[data-ary='"+ target +"']")[0].classList.add("lock");
                //第三張牌的話，清空、(發牌)、解除反灰
                if(this.getMarkCards().length == 0) this.distribute();
            }
            else
            {
                let jdg = false;
                //產生一組解答
                let len = this.getTableTopCards().length;
                for(let t1 = 0; t1 < len; ++t1)
                {
                    for(let t2 = t1+1; t2 < len; ++t2)
                    {
                        for(let t3 = t2+1; t3 < len; ++t3)
                        {
                            let tmp: number[][] = [this.getTableTopCards()[t1],this.getTableTopCards()[t2],this.getTableTopCards()[t3]];
                            jdg = this.verify(tmp);
                            
                            if (jdg) {
                                this.pushMarkCards(tmp);
                                break;
                            }
                        }
                        if (jdg) break;
                    }
                    if (jdg) break;
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
                    if(this.getCards().length > 0)
                    {
                        this.dealNew(3);
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
            width: 100%
            #time
                height: 1em
            #tableBoard 
                max-width: 746px
                width: 100%
                margin: 0 auto
                padding-top: 18px

                .card.lock 
                    background: #ccc
            #tableBoard.ans 
                .card.lock 
                    border-color: #707070
</style>