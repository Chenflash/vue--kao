<template>
  <div class="levelClassification" >
   <header class="navHeader">
     <span class="leftIcon" @click="goback()"><img src="../../assets/leftIcon.png"/></span> 
     <div class="searchInput">{{$route.query.gc_name.length>15?$route.query.gc_name.slice(0,15)+"...":$route.query.gc_name}}</div> 
     
   </header>
    <div v-if="!noFetch" v-show="!isloading">
      <ul class="ulLevel">
    <li class="listItem" v-for="(item,i) in levelClass" :key="i" @click="toLevelPage(item.gc_id,item.gc_name)">
      <p class="gc_image"><img :src="item.gc_icon_pic" class=""/></p>
      <p class="gc_Title">{{item.gc_name.length>6?item.gc_name.slice(0,6)+"...":item.gc_name}}</p>
    </li>

   </ul> 
    <!--列表记录-->
     <ul class="searchli" v-if="showList.length>0" >
      <li v-for="(list,k) in levelClass[0].goods_list" :key="k" @click="toVideo(list.goods_id,list.goods_name)">
       <span class="goodsImage"><img v-lazy="list.goods_image"/></span> 
       <div class="rightInfo">
        <p class="goodsName">{{list.goods_name}}</p>
        <p class="className">类目：{{list.gc_id_2_name}}</p>
        <p class="playCount"><img src="../../assets/playCount.png"/>{{list.play_coun}}</p>
       </div>
      </li>
    </ul>
      <div class="noList" v-else v-show="!isloading">
            <p ><img src="../../assets/noMessage.gif" class="noMessage"/></p>
            <p>暂无数据</p>   
      </div> 
    </div>

   
  </div>
</template>

<script>
import axios from 'axios'  //引入异步加载的网络请求

import { Toast,Loadmore,Indicator} from 'mint-ui';
export default {
  name: 'levelClassification',
  data () {
    return {
       noFetch:false,
       isCount:0,
       pageNum:0,
      noMore:false,
      showMore:false,
      allLoaded: false,
       isMore:false,
       levelClass: [],
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
  computed:{
   isloading(){
      return this.$store.state.isloading;
    },
  },
   beforeCreate(){
  },
  methods:{
     fetchLevel(){
      var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
        var that=this;
            axios({
                    method: 'Post',
                    url:domain+'/mobile/index.php?act=index&op=get_gc_2',
                    data:{
                       key:that.$route.query.key,
                       gc_id:that.$route.params.gc_id
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
                that.levelClass=results;
                that.showList=results[0].goods_list;
                
                 
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
    toLevelPage(gc_id,gc_name){
      console.log(gc_name+"当前。。。");
      var domain = process.env.NODE_ENV == 'development' ? '' : 'http://' + window.location.host+"/wap/dist/";
       window.location.href=domain+"#/levelClassPage/"+gc_id+"?key="+this.$route.query.key+"&gc_name="+gc_name;
    },
    toVideo(gc_Id,goods_name){  //跳转到视频详情
      console.log(gc_Id,goods_name);
      app.toVideoDetail(gc_Id,this.$route.query.key);
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

.levelClassification{
    
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
    background-color:#fff;
    margin-bottom:5px;
   
    
}
.ulLevel::-webkit-scrollbar {display:none}

.listItem{
    text-align:center;

}
.ulLevel img{
    width: 45px;
    height: 45px;
    background-size: contain;
    padding: 15px 5px;
    border-radius: 50%;
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
.levelClassification {
  background-color:#f2f2f2;
}
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
    border-bottom:5px solid #f2f2f2;
    background-color:#fff;
}
.leftIcon{
     width: 22px;
    height: 22px;
    position:absolute;
    left:10px;
    top:25%;
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
    background-color:#fff;
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
  height:100%;
  min-height:8rem;
  min-width:10rem;
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
/*
*空数据状态
*/
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
