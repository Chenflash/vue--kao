<template>
  <div class="registAgree">
         <!--有网络状态-->
            
        <div class="registAgreeContainer"  v-if="!noFetch" v-show="!isloading">
          <p v-html="content" ></p>
          <p class="update">{{update_date}}</p>
         </div>
         
  </div>
</template>

<script>
import axios from 'axios'  //引入异步加载的网络请求
axios.defaults.timeout = 3000
import { Toast,Loadmore,Indicator} from 'mint-ui';
export default {
  name: 'registAgree',
  data () {
    return {
        title:"",
        content:"",
        update_date:"",
         noFetch:false,
     
    }
  },
  mounted(){
    if(navigator.onLine){   //有网络状态
      Indicator.open();
       this.$store.commit('increatement');  
      setTimeout(()=>{
        this.fetchAgree();
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
      fetchAgree(){
          var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
        var that=this;
            axios({
                    method: 'Post',
                    url:domain+'/mobile/index.php?act=index&op=get_member_agreement',
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
                 that.content=response.data.datas.content;
                 that.update_date=response.data.datas.update_date;
              }else if(response.data.code==400){
                that.noData=true;
              }
              }else{
                 setTimeout(()=>{
                  Indicator.close();
              },500);
               that.noFetch=true;
                Toast({message:'网络不可用，请稍后重试',position: 'bottom',duration: 1500})
              }

            },(err)=>{
                setTimeout(()=>{
                  Indicator.close();
              },500);
               that.noFetch=true;
                Toast({message:'网络不可用，请稍后重试',position: 'bottom',duration: 1500})
            });     

      }
  
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;

}
a {
  color: #42b983;
}
.registAgree{
      background-color: #fff;
     height: auto;
}
.registAgreeContainer{
    background-color: #fff;
    font-size: 14px !important;
    width: 95%;
    margin: 10px auto;
    text-align: left;
}
.registAgreeContainer h3{
  margin-top:10px;
  text-align:center;
}

.update{
 padding-top:20px;
 text-align:right;
}

</style>
