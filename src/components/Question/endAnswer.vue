<template>
  <div class="endAnswer">
   
      <header data-v-04f39bc3="" class="mint-header" style="line-height:60px !important;">
  <div class="mint-header-button is-left" @click="goback">
    <a data-v-04f39bc3="" href="javascript:;" class="router-link-active">
    <button data-v-04f39bc3="" class="mint-button mint-button--default mint-button--normal">
    <span class="mint-button-icon"><i class="mintui mintui-back"></i></span>
    <label class="mint-button-text"></label></button>
    </a>
    </div>
      <h1 class="mint-header-title" style="color:#333!important;font-size:1.8rem">答题结束</h1> 
      <div class="mint-header-button is-right"></div>
    </header>
     <div v-if="!noFetch" v-show="!isloading">
        <div class="endContainer">
         <p class="toCount">本次答题数量<br/></p>
         <p class="count">{{toCount}}</p>

         <ul class="answer">
          <li class="items" ><p>答题时间：</p><p class="toTime">{{AnswerTime}}</p></li>  
          <li class="items" ><p>答题数：</p><p class="toTime">{{toCount}}</p></li>  
         </ul>
         <div class="btnlook" @click="btnlook()">查看错题</div>
        </div>
    
    </div>
     <ul class="noFetch" v-else @click="loadFetch()" v-show="!isloading">
        <img src="../../assets/noFetch.png" />
        <p>网络无法连接</p>
        <p    class="btnFetch">刷新</p>
      </ul>  
  </div>
</template>

<script>
import axios from 'axios'  //引入异步加载的网络请求
import { Toast,Loadmore,Indicator,MessageBox} from 'mint-ui';
export default {
  name: 'endAnswer',
  data () {
    return {
         noFetch:false,
         toCount:this.$route.query.this_count,
         AnswerTime:"180:00",

     
    }
  },
 
  computed:{
   isloading(){
      return this.$store.state.isloading;
    },
  },
  mounted(){
    if(navigator.onLine){   //有网络状态
      Indicator.open();
       this.$store.commit('increatement');  
      setTimeout(()=>{
        this.fetchAnswer();
      },1000);
    }else{   //无网络状态
       this.noFetch=true;
       Toast({message:'网络不可用，请稍后重试',position: 'bottom',duration: 1500})
    }  
  },
  methods:{
    fetchAnswer(){
       this.$store.commit("decrement");
       Indicator.close();
    },
    btnlook(){
       var domain = process.env.NODE_ENV == 'development' ? '' : 'http://' + window.location.host+"/wap/dist/";
        window.location.href=domain+"#/wrongQuestionBank?key="+this.$route.query.key;

    },
    goback(){
      app.back();
    }
   
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul,li {
  list-style-type: none;
}

.endAnswer{
    
}

.endContainer{
      height: auto;
    background-color: #fff;
    font-size: 1.6rem;
    font-family: PingFangSC-Regular;
    color: #999999;
    letter-spacing: 0;
}
.toCount{
   padding-top: 20px;
    padding-bottom: 20px;
}
.count{
       font-family: PingFangSC-Medium;
    font-size: 36px;
    color: #69C0FF;
    letter-spacing: 0;
}

.answer{
    width: 80%;
    height: 8rem;
    margin: 0 auto;
    text-align: center;
     display: -webkit-box;  /* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
    display: -moz-box;     /* 老版本语法: Firefox (buggy) */
    display: -ms-flexbox;  /* 混合版本语法: IE 10 */
    display: -webkit-flex; /* 新版本语法: Chrome 21+ */
    display: flex;         /* 新版本语法: Opera 12.1, Firefox 22+ */;
    background: #FFFFFF;
    border: 1px solid #69C0FF;
    border-radius: 5px;
    margin-top: 30px;
    margin-bottom: 30px;
    line-height: 36px;
    vertical-align: middle;
    text-align: left;
    align-items: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    justify-content: center;
}

.items{
      display: inline-block;
    height: 6rem;
    border-right: 1px solid #69C0FF;
    flex: 0.5;
    text-align: center;
}
.items:last-of-type{
  border-right:0 none;
}
.toTime{
    font-family: PingFangSC-Regular;
    font-size: 15px;
    color: #69C0FF;
    letter-spacing: 0;
}
.btnlook{
  background: #69C0FF;
  border-radius: 5px;
  height:48px;
  line-height:48px;
  letter-spacing: 1;
  width:80%;
  margin:0 auto;
  color:#fff;
  font-size:1.8rem;

}

/*
*加载中
*/
.textloading{
    width: 100%;
    text-align: center;
    color: #333;
    height: 36px;
    font-size: 1.5rem;
}
.textloading img{
  width:2.4rem;
  height:2.4rem;
}
/*
*暂无数据
*/
.noList{
    width: 100%;
    height: 100vh;
    display: block;
    text-align: center;
     background-color:#fff;
}
.noMessage{
    width: 15rem;
    height: 15rem;
    margin-top: 50px;

}
.noList p{
  font-size: 14px;
  color: #666;
}


/*网络状态*/
.noFetch{
    text-align:center;
    color: #999999;
    font-size: 14px;
    background-color: #ffffff;
}
.noFetch img{
    width: 94px;
    height: 94px;
    padding-top: 56px;
}
.noFetch p{
    line-height: 36px;
}
.btnFetch{
    width: 82px;
    height: 36px;
    background-color: #00BCD4;
    color: #ffffff;
    font-size: 16px;
    letter-spacing: 4px;
    border-radius: 5px;
}

</style>
