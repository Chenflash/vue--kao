<template>
  <div class="studentSee"  >
   
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
  name: 'studentSee',
  data () {
    return {
      noFetch:false,
      loadImg:"",
      defaultImg:'this.src="' + require('../../assets/noImg.png') + '"'   //加载失败，显示默认图片

    }
  },
   mounted(){
    if(navigator.onLine){   //有网络状态
      Indicator.open();
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
                       type:3
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
              if(response.data.code==200){
               that.loadImg=response.data.datas;
              }else if(response.data.code==400){
                that.noData=true;
              }else{
                Toast(response.data.datas.error)
              }

            },(err)=>{
               that.noFetch=true;
            });     

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

.studentSee{
    height:auto;
}


/*
*没网络
*/
.noFetch{
     padding-top: 100px;
}
.bg{
  
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
