<template>
  <div class="share">
   <header   class="mint-header disabled" style="line-height: 60px;">
   <div class="mint-header-button is-left" @click="toback">
   <a  href="javascrip:;" class="router-link-active">
   <button  class="mint-button mint-button--default mint-button--normal">
   <span class="mint-button-icon"><i class="mintui mintui-back"></i></span> 
   <label class="mint-button-text"></label></button></a></div>
    <h1 class="mint-header-title">分享有奖</h1>
     <div class="mint-header-button is-right" @click="shareTitle"><button  class="mint-button mint-button--default mint-button--normal"><!---->
      <label class="mint-button-text"><img  src="../../assets/Share.png"></label></button>
      </div>
    </header>

    <!--有网络状态-->
    <div v-if="!noFetch" v-show="!isloading" style="height:100vh;width:100%">
      
      <mt-swipe  :show-indicators="false" :auto="0">
      <mt-swipe-item v-for="(item,i)  in  loadImg" :key="i">
          <img v-if="item!=''"  :src="item" class="loadImg" :onerror="defaultImg" alt="图片地址不存在"/>
      </mt-swipe-item>
    </mt-swipe>
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

import { Toast,Indicator} from 'mint-ui';
export default {
  name: 'share',
  data () {
    return {
      noFetch:false,
      loadImg:"",
      showShare:this.$route.query.showShare,
       defaultImg:'this.src="' + require('../../assets/noImg.png') + '"'   //加载失败，显示默认图片

     
      

    }
  },
   mounted(){
     
    if(navigator.onLine){   //有网络状态
      if(this.showShare==1){
       $(".disabled").css("display","flex ");
       Indicator.open();
     }
       this.$store.commit('increatement');  
      setTimeout(()=>{
        this.fetchPhone();
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
    fetchPhone(){
      var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
        var that=this;
            axios({
                    method: 'Post',
                    url:domain+'/mobile/index.php?act=index&op=get_posters',
                    data:{
                       type:2
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
               that.loadImg=response.data.datas;
              }else if(response.data.code==400){
                that.noData=true;
              }else{
                 Indicator.close();
                 that.noFetch=true;
              }
             }else{
                Indicator.close();
               that.noFetch=true;
             }

            },(err)=>{
               that.noFetch=true;
                Indicator.close();
            });     

    },
    toback(){
     app.back();
    },
    shareTitle(){ //分享详情
       var that=this;
      var title="法考、公考、研考高清视频免费看，等你来！";
      var text="多资分享APP提供大量的法考、公考、研考高清视频，学员可以免费观看，也可以分享自己的视频给其他学员，从而获得钻石奖励。钻石可以升级高级会员、兑换礼品等。高级会员可以免费海量下载高清视频、讲义。";
      var url="http://kaoshi.duoziedu.com/wap/dist/#/share?key="+that.$route.query.key;
      var icon="http://pb81t6qre.bkt.clouddn.com/shop/common/05866236176531485.png";
      app.share(title,text,url,icon);
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
h1, h2 {
  font-weight: normal;
}
ul,li {
  list-style-type: none;
}

.share{
    height:auto;
}
.navHeader{
    width: 100%;
    height: 46px;
    text-align: left;
    font-size: 1.6rem;
    display: -webkit-box; /* Chrome 4+, Safari 3.1, iOS Safari 3.2+ */
    display: -moz-box; /* Firefox 17- */
    display: -webkit-flex; /* Chrome 21+, Safari 6.1+, iOS Safari 7+, Opera 15/16 */
    display: -moz-flex; /* Firefox 18+ */
    display: -ms-flexbox; /* IE 10 */
    display: flex; /* Chrome 29+, Firefox 22+, IE 11+, Opera 12.1/17/18, Android 4.4+ */
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
    border-bottom:5px solid #f2f2f2;
}
.leftIcon{
     width: 22px;
    height: 22px;
    margin-right: 5px;
    vertical-align: middle;
    display: inline-block;
}
.rightIcon{
    width: 20px;
    height: 20px;
    vertical-align: middle;
    float: right;
    margin-top: 10px;
}
.leftIcon img{
     width: 20px;
    height: 20px;
}
.searchInput{
    display: inline-block;
    height: 36px;
    line-height: 36px;
    background-color: #efefef;
    border-radius: 5px;
    text-align: left;
    vertical-align: middle;
    color: #999;
    position: relative;
    flex: 1.5;
}
.searchInput img{
     width: 26px;
    height: 26px;
    margin-left: 10px;
    margin-right: 10px;
    vertical-align: middle;
}
.Inputvalue{
        width: 75%;
    border: 0 none;
    height: 34px;
    line-height: 34px;
    background: #efefef;
    z-index: 1002;
    vertical-align: middle;
    text-align: left;
}
.rightSearch{
      font-family: PingFangSC-Regular;
    font-size: 16px;
    color: #69C0FF;
    letter-spacing: 0.75px;
    margin-right: 10px;
    margin-left: 10px;
    float: right
}
.disabled{
  display:none;
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
</style>
