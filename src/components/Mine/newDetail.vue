<template>
  <div class="newDetail">
   
     
     <div v-if="!noFetch" v-show="!isloading">
        <h3 class="newTitles">{{newTitle}}</h3>
        <p class="newTime">{{createTime}}</p>
        <div v-html="newCount" class="counts"></div>
    
    </div>
     <ul class="noFetch" v-else @click="loadFetch()" v-show="!isloading">
        <img src="../../assets/noFetch.png" />
        <p>网络无法连接,点击刷新</p>
      </ul>  
  </div>
</template>

<script>
import axios from 'axios'  //引入异步加载的网络请求
import { Toast,Loadmore,Indicator,MessageBox} from 'mint-ui';
export default {
  name: 'newDetail',
  data () {
    return {
         noFetch:false,
         newTitle:'',
         createTime:"",
         newCount:"",
         phone:"",
     
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
        this.fetchNew();
      },1000);
    }else{   //无网络状态
       this.noFetch=true;
       Toast({message:'网络不可用，请稍后重试',position: 'bottom',duration: 1500})
    }  
  },
  methods:{
    fetchNew(){
          var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
        var that=this;
         axios({
                    method: 'Post',
                    url:domain+'/mobile/index.php?act=member_index&op=get_my_massage',
                    data:{
                       key:that.$route.query.key,
                       type:that.$route.query.type,
                       push_id:that.$route.params.push_id
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
                 console.log(results);
                 that.newCount=results.push_message;
                 that.createTime=results.push_time;
                 that.newTitle=results.push_title;

              }else{
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
     loadFetch(){  //刷新
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
.newDetail {
    width: 95%;
    margin: 0px auto;
    margin-top: 30px;
    text-align: left;
}
.newTitles{
    font-family: PingFangSC-Medium;
    font-size: 18px;
    color: #333333;
    letter-spacing: 1px;
    line-height: 25px;
    text-align: left;
}
.newTime{
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #999999;
    letter-spacing: 0.78px;
    margin-top: 10px;
    margin-bottom: 10px;
}
.counts{
       font-family: PingFangSC-Regular;
    font-size: 15px;
    color: #666666;
    letter-spacing: 3px;
    line-height: 30px;
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
