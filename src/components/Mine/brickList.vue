<template>
  <div class="brickList">
    <!--有网络状态-->
    <div v-if="!noFetch" v-show="!isloading" >
     <div class="brickTitle">
       <div class="leftTitle">排名</div>
      <div class="centerTitle">用户</div>
      <div class="rightTitle">钻石数</div>
     </div>
      <ul class="itemBox"  v-infinite-scroll="loadMore" 
      infinite-scroll-disabled="loading"
      infinite-scroll-distance="0" v-cloak v-if="!noData"
      >
      <li  v-cloak>
          <span class="leftText"><img src="../../assets/first.png" class="icons"/></span>
           <span class="centerText">{{brickLists[0].member_mobile}}</span>
          <span class="rightText">{{brickLists[0].member_points}}<img src="../../assets/zuanshi.png" class="rightIcons"/></span>
        </li>
         <li>
          <span class="leftText"><img src="../../assets/two.png" class="icons"/></span>
          <span class="centerText">{{brickLists[1].member_mobile}}</span>
          <span class="rightText">{{brickLists[1].member_points}}<img src="../../assets/zuanshi.png" class="rightIcons"/></span>
        </li>
         <li>
          <span class="leftText"><img src="../../assets/three.png" class="icons"/></span>
          <span class="centerText">{{brickLists[2].member_mobile}}</span>
          <span class="rightText">{{brickLists[2].member_points}}<img src="../../assets/zuanshi.png" class="rightIcons"/></span>
        </li>
        <li v-for="(list,i) in brickLists" :key="i" v-if="i>2">
           <span class="leftText">&nbsp;&nbsp;&nbsp;{{i+1}}&nbsp;&nbsp; </span>
          <span class="centerText">{{brickLists[i].member_mobile}}</span>
          <span class="rightText">{{list.member_points}}<img src="../../assets/zuanshi.png" class="rightIcons"/></span>
        </li>
          <div class="noMore"  v-show="isMore">
                <div class="textloading" v-if="!showMore"><img src="../../assets/load.gif"/></div>
                 <div class="textloading" v-else></div>
          </div>

      </ul>
       <!--暂无数据-->
         <div class="noNull" v-if="noData">
            <p ><img src="../../assets/noMessage.gif" class="noMessage"/></p>
            <p>暂无数据</p>   
         </div> 
    </div>
    <!--没网络状态-->
    <ul class="noFetch" v-else  v-show="!isloading"  @click="loadFetch()">
          <img src="../../assets/noFetch.png" />
          <p>网络不给力，请点击刷新</p>
      </ul> 
    
  </div>
</template>

<script>
import axios from 'axios'  //引入异步加载的网络请求

import { Toast,Loadmore,Indicator} from 'mint-ui';
export default {
  name: 'brickList',
  data () {
    return {
      noFetch:false,
       isCount:0,
       pageNum:0,
      noMore:false,
      showMore:false,
      allLoaded: false,
       isMore:false,
       noData:false,
      haveMore:false, //是否还有更多内容
      brickLists:[],

    }
  },
   mounted(){
    if(navigator.onLine){   //有网络状态
      Indicator.open();
       this.$store.commit('increatement');  
      setTimeout(()=>{
        this.fetchList();
      },1000);
    }else{   //无网络状态
       this.noFetch=true;
       Toast({message:'网络不可用，请稍后重试',position: 'bottom',duration: 1500})
    }  
  },
  computed:{
   isloading(){
      return this.$store.state.isloading;
    },
  },
  methods:{
    fetchList(){
      var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
        var that=this;
            axios({
                    method: 'Post',
                    url:domain+'/mobile/index.php?act=index&op=points_rank_top',
                    data:{
                       curpage:++that.pageNum 
                    },
                   transformRequest: [function (data) {
                      let ret = ''
                      for (let it in data) {
                        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                      }
                      return ret
                    }],
                    headers: {
                      'Content-Type': 'application/x-www-form-urlencoded',
              }
            }).then(function(response){ 
              console.log(response);
              that.$store.commit("decrement");
              setTimeout(()=>{
                  Indicator.close();
              },500);
               if(response!=undefined){
                   if(response.data.code==200){
                var results=response.data.datas;
               if(that.isCount==0){
                 that.isCount=1;
                 if(results.length!=0 && results.length<=10){
                 that.brickLists=results;
                 that.isMore=false;
                 that.haveMore = false;   
                }else if(results.length==0){
                  that.haveMore = false;
                  that.isMore=false;
                  that.noData=true;
                }else{
                   that.brickLists=that.brickLists.concat(results);
                   that.haveMore=true; //可以加载更多
                   that.isMore=true;
                   that.showMore=false;
                } 
               }else if(that.isCount==1){ //加载第N页面
                   if(results.length==0){
                  that.haveMore = false;
                  that.isMore=true;
                  that.showMore=true;
                  that.pageNum--
                }else{
                   that.brickLists=that.brickLists.concat(results);
                   that.haveMore=true; //可以加载更多
                   that.isMore=true;
                   that.showMore=false;
                } 
               }
                  
              }else if(response.data.code==400){
                  that.noData=true;
                 
              }else{
                 Toast(response.data.datas.error);
                  that.noFetch=true;
              }
               }else{
                 that.noFetch=true;
               }
            },(err)=>{
              Indicator.close();
               that.noFetch=true;
            });     

    },
    loadMore(){
       if(this.haveMore){
        this.loading = true;
        this.showMore=false;
        this.fetchList();
        
      }
    },
    loadFetch(){
      this.noFetch=false;
         if(navigator.onLine){   //有网络状态
            location.reload();
         }else{   //无网络状态
            this.noFetch=true;
              Toast({message:'网络不可用，请稍后重试',position: 'bottom',duration: 1500})
          }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
[v-cloak] {
    display: none;
}
h1, h2 {
  font-weight: normal;
}
ul,li {
  list-style-type: none;
}

.brickList{
    height: auto;
    margin-top: 25px;
}
.brickTitle{
      margin-bottom: 15px;
    text-align: right;
    font-size: 1.6rem;
    color: #666;
    display: -webkit-box;
    display: -moz-flex;
    display: -ms-flexbox;
    display: flex;
    width: 80%;
    margin: 0 auto;
}
.leftTitle{
        display: inline-block;
    text-align: left;
    -webkit-box-flex: 0.5;
    -ms-flex:  0.5;
    flex:  0.5;
}
.rightTitle{
     display: inline-block;
    text-align: right;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
}
.itemBox{
    text-align: left;
    width: 80%;
    margin: 0 auto;
    margin-top:20px;
}
.itemBox li{
     display: -webkit-box; /* Chrome 4+, Safari 3.1, iOS Safari 3.2+ */
    display: -moz-box; /* Firefox 17- */
    display: -webkit-flex; /* Chrome 21+, Safari 6.1+, iOS Safari 7+, Opera 15/16 */
    display: -moz-flex; /* Firefox 18+ */
    display: -ms-flexbox; /* IE 10 */
    display: flex;
    line-height: 42px;
    height: 42px;
    text-align: center;
    font-size: 1.4rem;
    color: #333;
    font-family: PingFangSC-Regular;
    color: #333333;
    letter-spacing: 0;
} 
.centerTitle{
      flex: 1;
    text-align: left;
}
.centerText{
     display: inline-block;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    text-align: left;
}
.leftText{
       display: inline-block;
    -webkit-box-flex: 0.5;
    -ms-flex: 0.5;
    flex:  0.5;
    text-align: left;
}
.rightText{
       display: inline-block;
    text-align: right;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
}
.icons{
    width: 28px;
    height: 26px;
    background-size: contain;
}
.rightIcons{
   width:16px;
   height:16px;
   margin-left:5px;

}
/*
*没网络
*/
.noFetch{
     padding-top: 100px;
}
.loadImg{
  width:100%;
  height:100%;
}
.noFetch p{
   line-height:24px;
   color:#333;
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
    margin-top:30px !important;
    margin-bottom:30px !important;
}
.textloading img{
  width:2.4rem;
  height:2.4rem;
}

</style>
