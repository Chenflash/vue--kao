<template>
  <div class="levelClassPage">
      <header class="navHeader">
     <span class="leftIcon" @click="goback()"><img src="../../assets/leftIcon.png"/></span> 
     <div class="searchInput">{{$route.query.gc_name.length>15?$route.query.gc_name.slice(0,15)+"...":$route.query.gc_name}}</div> 
   </header>
    <div v-if="!noFetch" v-show="!isloading">
        
    <!--列表记录-->
     <ul class="searchli" v-if="showList.length>0" 
      v-cloak
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="loading"
      infinite-scroll-distance="0"
     >
      <li v-for="(list,k) in showList" :key="k" @click="toVideo(list.goods_id,list.goods_name)">
       <span class="goodsImage"><img :src="list.goods_image"/></span> 
       <div class="rightInfo">
        <p class="goodsName">{{list.goods_name}}</p>
        <p class="className">类目：{{list.gc_id_2_name}}</p>
        <p class="playCount"><img src="../../assets/playCount.png"/>{{list.play_coun}}</p>
       </div>
      </li>

      <div class="noMore" v-show="isMore">
                <div class="textloading" v-if="!showMore"><img src="../../assets/load.gif"/></div>
                 <div class="textloading" v-else>没有更多了</div>
      </div>

    </ul>
      <div class="noList" v-else>
            <p ><img src="../../assets/noMessage.gif" class="noMessage"/></p>
            <p>暂无数据</p>   
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

import { Toast,Loadmore,Indicator} from 'mint-ui';
export default {
  name: 'levelClassPage',
  data () {
    return {
       noFetch:false,
       isCount:0,
       pageNum:0,
      noMore:false,
      showMore:false,
      allLoaded: false,
       isMore:false,
      showList:[],
      loading:false,
      finished:false,
    }
  },
   mounted(){
    var u = navigator.userAgent, app = navigator.appVersion;
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if(isiOS){
      $(".navHeader").css("height",'65px');
      $(".leftIcon").css("top","30%");
    } 
    if(navigator.onLine){   //有网络状态
      Indicator.open();
       this.$store.commit('increatement');  
      setTimeout(()=>{
        this.fetchLevel();
      },1000);
    }else{   //无网络状态
       this.noFetch=true;
       Toast({message:'网络不可用，请稍后重试',position: 'bottom',duration: 1500})
    }  
  },
  beforeCreate(){
    document.title=this.$route.query.gc_name;
  },
  computed:{
   isloading(){
      return this.$store.state.isloading;
    },
  },
  methods:{
     fetchLevel(){
      var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
        var that=this;
            axios({
                    method: 'Post',
                    url:domain+'/mobile/index.php?act=index&op=get_gc_2_goods_page',
                    data:{
                       key:that.$route.query.key,
                       gc_id:that.$route.params.gc_id,
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
                        if(results.goods_list.length!=0 && results.goods_list.length<=10){
                        that.showList=results.goods_list;
                        that.isMore=false;
                        that.haveMore = false;   
                        }else if(results.goods_list.length==0){
                        that.haveMore = false;
                        that.isMore=false;
                        that.noData=true;
                        }else{
                        that.showList=that.showList.concat(results.goods_list);
                        that.haveMore=true; //可以加载更多
                        that.isMore=true;
                        that.showMore=false;
                        } 
                    }else{ //加载第N页面
                        if(results.goods_list.length==0){
                        that.haveMore = false;
                        that.isMore=true;
                        that.showMore=true;
                        that.pageNum--
                        }else{
                        that.showList=that.showList.concat(results.goods_list);
                        that.haveMore=true; //可以加载更多
                        that.isMore=true;
                        that.showMore=false;
                        }
                    }
              }else{
                  that.noData=true;
                  Toast(response.data.datas.error);
              }
               }else{
                 that.noFetch=true;
               }
            },(err)=>{
              Indicator.close();
               that.noFetch=true;
            });     

    },
     toVideo(gc_Id){  //跳转到视频详情
      console.log(gc_Id,this.$route.query.key);
      app.toVideoDetail(gc_Id,this.$route.query.key);
    },
      loadMore(){
        if(this.haveMore){
           this.loading = true;
           this.showMore=false;
           this.isCount=1;
           this.fetchTitle();
        }
    },
    loadFetch(){
        this.noFetch=false;
         if(navigator.onLine){   //有网络状态
          this.fetchLevel();
         }else{   //无网络状态
            this.noFetch=true;
            this.showMore=true;
              Toast({message:'网络不可用，请稍后重试',position: 'bottom',duration: 1500})
          }
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

.levelClassPage{
    
}
/*
*二级分类页面
*/
.ulLevel{
    overflow: scroll;
    -ms-flex-wrap: wrap;
    -webkit-box-pack: justify;
    -ms-flex-pack: distribute;
    -ms-flex-wrap: nowrap;
    flex-wrap: nowrap;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
   
    
}
.listItem{
     
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;

}
.ulLevel img{
    width: 45px;
    height: 45px;
    background-size: contain;
    padding: 10px 40px;
}
.ulLevel p{
    font-size: 14px;
    font-family: PingFangSC-Regular;
		font-size: 14px;
		color: #999;
        margin: 0px 20px;
}

/*
*头部导航栏
*/
.navHeader{
    width: 100%;
    height: 46px;
    font-size: 1.6rem;
    display: -webkit-box; /* Chrome 4+, Safari 3.1, iOS Safari 3.2+ */
    display: -moz-box; /* Firefox 17- */
    display: -webkit-flex; /* Chrome 21+, Safari 6.1+, iOS Safari 7+, Opera 15/16 */
    display: -moz-flex; /* Firefox 18+ */
    display: -ms-flexbox; /* IE 10 */
    display: flex; /* Chrome 29+, Firefox 22+, IE 11+, Opera 12.1/17/18, Android 4.4+ */
    align-items: center;
    flex-direction: row;
    justify-content: center;
    position:relative;
    align-items:center;
    border-bottom:5px solid #eee;
}
.leftIcon{
     width: 22px;
    height: 22px;
    position:absolute;
    top:25%;
    left:10px;
}
.leftIcon img{
  width:100%;
  height:100%;
}
.searchInput{
  text-align:center;
}
/*
*二级分类页面
*/
.searchli{
  height: auto;
    text-align: left;
    margin-top: 10px;
}
.searchli li{
   height: 10rem;
    border-bottom: 1px solid #eee;
}
.searchli li:last-of-type{
  border-bottom:0 none;
}
.goodsImage{
     display: inline-block;
    width: 10rem;
    height: 8rem;
    overflow: hidden;
    margin: 10px;
}
.goodsImage img{
  width:100%;
  background-size:cover;
}
.rightInfo{
      display: inline-block;
    vertical-align: top;
    margin-top: 10px;
    line-height: 28px;
    font-family: PingFangSC-Regular;
    font-size: 15px;
    color: #333333;
}
.goodsName{
   margin-bottom: 10px;
}
.className{
  font-family: PingFangSC-Regular;
    font-size: 13px;
    color: #999999;
}
.playCount{
      font-family: PingFangSC-Regular;
    font-size: 13px;
    color: #999999;
    letter-spacing: 0;
}
.playCount img{
  width: 16px;
    height: 16px;
    margin-right: 10px;
    vertical-align: sub;
}

/*
*暂无数据
*/
.noNull{
  display:block;
  padding-top:100px;
  background-color: #fff;
}
.noMessage{
    width: 15rem;
    height: 15rem;
    margin-top: 50px;

}
.noNull p{
  font-size: 14px;
  color: #999999;
  line-height: 60px;
  padding-top:10px;
}


/*网络状态*/
.noFetch{
    height: 100vh;
    color: #999999;
    font-size: 14px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
}
.noFetch img{
    width: 94px;
    height: 94px;
}
.noFetch p{
    line-height: 48px;
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
.noList{
    width: 100%;
    height: 100vh;
    display: block;
    text-align: center;
     background-color:#fff;
}
.noList img{
     width: 16rem;
    height: auto;
    margin: 0 auto;
    padding-right: 10px;
}
.noList p{
  font-size:1.4rem;
   color:#666666
}
</style>
