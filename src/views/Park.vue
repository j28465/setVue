<template>
    <Msg></Msg>
    <div id="box">
        <h4 id="time">0時0分0秒</h4>
        <button type="button" id="hint" @click="hintClick">提示or無解答</button>
        <div id="tableBoard">
            <Card v-for="c in tableCards" :key="c" :ary="c"></Card>
        </div>
    </div>
</template>

<script lang="ts">
import Card from '@/components/Card.vue'
import Msg from '@/components/MsgBox.vue'
import { defineComponent } from 'vue'
import { mapMutations } from 'vuex'

class desk{
    tableBoard: HTMLElement;
    cards: number[][];
    tableCards: string[];
    clickAry: string[];
    hint: string[];

    constructor(){
        this.tableBoard = new HTMLElement;
        this.cards = [[]];
        this.tableCards = [];
        this.clickAry = [];
        this.hint = [];
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
            cards: [[]],    //海底的牌
            tableCards: [], //桌面上的牌
            clickAry: [],   //已選擇的牌
            hint: []        //這次提示的牌
        }
    },
    mounted(): void{
        //產生所有牌
        for (let a = 1; a <= 3; ++a) {
            for (let b = 1; b <= 3; ++b) {
                for (let c = 1; c <= 3; ++c) {
                    for (let d = 1; d <= 3; ++d) {
                        this.cards.push([a, b, c, d]);
                    }
                }
            }
        }
        //隨機排序
        let len: number = this.cards.length;
        let index: number;
        let tmp: number[];
        while (len > 0) {
            index = Math.floor(Math.random() * len);
            len--;

            tmp = this.cards[len];
            this.cards[len] = this.cards[index];
            this.cards[index] = tmp;
        }
        //紀錄現在檯面上的牌
        for(let i = 0; i<12;++i){
            this.tableCards.push(this.cards.pop()?.join(',') ?? "");
        }
    },
    methods:
    {
        ...mapMutations({msgOpen: "msgOpen"}),
        choose(t: HTMLElement):void 
        {
            
            let target: HTMLElement = t;
            //選取的card
            while (!target.classList.contains("card")) 
            {
                target = target.parentNode as HTMLElement;
            }

            if (target.classList.contains("lock")) {
                this.removeArray(this.clickAry, target.getAttribute("data-ary") ?? "");
                target.classList.remove("lock");
            }
            else {
                this.clickAry.push(target.getAttribute("data-ary") as string);
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
                    document.querySelectorAll("#tableBoard div.lock").forEach((e) =>{ 
                        if(this.tableCards.length > 12)
                        {
                            //清除現在檯面上被選走的牌
                            this.removeArray(this.tableCards, e.getAttribute("data-ary") as string);
                            e.remove();
                        }
                        else
                        {
                            //清除現在檯面上被選走的牌
                            this.removeArray(this.tableCards, e.getAttribute("data-ary") as string);
                            //清除被選走的牌
                            e.setAttribute("data-ary", "");
                            //e.firstElementChild.innerHTML = "";
                            //放上新的牌
                            if(this.cards.length > 0) 
                            {
                                for(let i = 0; i < 3;++i){
                                    this.tableCards.push(this.cards.pop()?.join(',') as string);
                                }      
                            }
                            else if(this.tableCards.length == 0)
                                this.msgOpen({title: "遊戲結束"});
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
                this.msgOpen({title: "答錯ㄌ"});
            }
        },
        hintClick(): void 
        {   
            //提示or無解答
            if(this.hint.length > 0)
            {
                //選擇第二或三張牌
                let target: string = this.hint.pop() as string;
                this.clickAry.push(target);
                document.querySelectorAll("#tableBoard div[data-ary='"+ target +"']")[0].classList.add("lock");
                //第三張牌的話，清空、(發牌)、解除反灰
                if(this.hint.length == 0) this.distribute();
            }
            else
            {
                let jdg = false;
                //產生一組解答
                let len = this.tableCards.length;
                for(let t1 = 0; t1 < len; ++t1)
                {
                    for(let t2 = t1+1; t2 < len; ++t2)
                    {
                        for(let t3 = t2+1; t3 < len; ++t3)
                        {
                            this.hint = [this.tableCards[t1],this.tableCards[t2],this.tableCards[t3]];
                            jdg = this.verify(this.hint);
                            if (jdg) break;
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
                    let target: string = this.hint.pop() as string;
                    this.clickAry.push(target);
                    document.querySelectorAll("#tableBoard div[data-ary='"+ target +"']")[0].classList.add("lock");
                }
                else    
                {
                    this.hint = [];
                    //沒答案發牌
                    if(this.cards.length > 0)
                    {
                        for(let i = 0; i < 3;++i){
                            this.tableCards.push(this.cards.pop()?.join(',') as string);
                        }   
                    }
                    else
                    {
                        //clearInterval(Timer);
                        alert("遊戲結束");
                    }
                }
            }
        },
        removeArray(array: string[], _target: string): void 
        {
            //取消選擇
            var index = array.indexOf(_target);
            array.splice(index, 1);
        },
        verify(ary: string[]): boolean
        {
            //檢查所選牌組是否符合
            let jdg = true;
            for (let i = 0; i <= 3; ++i) {
                let tmp = 0;
                //三張牌
                for (var j = 0; j <= 2; ++j) {
                    tmp += parseInt(ary[j].split(',')[i]);
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
    @font-face
        font-family: 'icomoon'
        src: url('../css/fonts/icomoon.eot?v00024'), url('../css/fonts/icomoon.eot?#iefixv00024') format('embedded-opentype'), url('../css/fonts/icomoon.woff?v00024') format('woff'), url('../css/fonts/icomoon.ttf?v00024') format('truetype'), url('../css/fonts/icomoon.svg?v00024#icomoon') format('svg')
        font-weight: normal
        font-style: normal
    i
        font-family: 'icomoon'
        font-style: normal
        font-weight: normal
        font-variant: normal
        text-transform: none
        line-height: 1
        -webkit-text-rendering: optimizeLegibility
        -webkit-font-smoothing: antialiased
        -moz-text-rendering: optimizeLegibility
        -moz-font-smoothing: antialiased
        -ms-text-rendering: optimizeLegibility
        -ms-font-smoothing: antialiased
        -o-text-rendering: optimizeLegibility
        -o-font-smoothing: antialiased
        text-rendering: optimizeLegibility
        /*font-smoothing: antialiased;*/
        margin: 0 1px
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
                > div 
                    cursor: pointer
                    font-size: calc(3.8vw)
                    line-height: 2em
                    width: 25%
                    float: left
                    user-select: none
                    -webkit-user-select: none
                    -moz-user-select: none
                    > div 
                        border: 1px solid #ccc
                        margin: 1px
                > div.lock 
                    background: #ccc
            #tableBoard.ans 
                > div.lock 
                    border-color: #707070

        .red 
            color: #c90202
        .green 
            color: #1b6206
        .blue 
            color: #001eca
</style>