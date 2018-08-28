<template>
  <div class="shareVideo">
    <!--有网络状态-->
    <div v-if="!noFetch"  >
      <ul class="container">
       <li class="listItem">
        <span class="leftName">课程类目:</span>
        <select id="selectInput" name="selectInput" v-model="selecteds" @change="changeSelected($event)" style="  -webkit-appearance: none;">
            <option selected value="">请选择课程</option>
             <option :value="item.gc_id_1"  v-for="(item,i) in videoList" :key="i"  >{{item.gc_name}}</option>     
         </select>
       </li>
       <li class="listItem">
        <span class="leftName">课程科目:</span>
        <select id="selectInput" name="selectInput"  v-model="gcId2" style="  -webkit-appearance: none;">
             <option  selected value="">请选择科目</option>  
             <option :value="item.gc_id_2"  v-for="(item,i) in classList" :key="i" >{{item.gc_name}}</option>         
         </select>
       </li>
         <li class="listItem">
        <span class="leftName">讲师：</span>
        <input type="text"  class="rightText" v-model="teacherName" placeholder="请输入讲师姓名"/>
       </li>
        <li class="listItem">
        <p class="leftName">云链接：</p>
        <input type="url" class="rightInput" v-model="urls" placeholder="请输入云链接(支持任意云盘)"/>
       </li>
        <li class="listItem" style="position:relative;">
        <p class="leftName">视频介绍：</p>
          <textarea Maxlength="120" class="textares" v-model="videomsg" rows="10" cols="42"/>
          <span class="limit" :style="videomsg.length>=120?'color:#f01':''">{{videomsg.length}}/120</span> 
       </li>
      </ul>
      <input type="button" @click="btnShare" value="发布" class="btnShares"/>
    </div>
    <!--没网络状态-->
    <ul class="noFetch" v-else   @click="loadFetch()">
          <img src="../../assets/noFetch.png" />
          <p>网络不给力，请点击刷新</p>
      </ul> 
    
  </div>
</template>

<script>
import axios from 'axios'  //引入异步加载的网络请求

import { Toast,Indicator,MessageBox} from 'mint-ui';
export default {
  name: 'shareVideo',
  data () {
    return {
      selecteds:"",
      gcId2:"",      
      noFetch:false,
      loadImg:"",
      teacherName:"",
      urls:"",
      videomsg:"",
      videoList:[],
      classList:[],


    }
  },
   mounted(){
    if(navigator.onLine){   //有网络状态
       Indicator.open();
      this.fetchShare();
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
     fetchShare(){
      var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
        var that=this;
            axios({
                    method: 'Post',
                    url:domain+'/mobile/index.php?act=index&op=share_get_gc',
                    data:{
                       key:that.$route.query.key,
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
                that.videoList=results;
              
              }else{
                 Toast(response.data.datas.error);
              }
               }else{
                  Toast("请求超时，请稍后重试");
               }
            },(err)=>{
              Indicator.close();
               that.noFetch=true;
            });     

    },
    btnShare(){
     if(this.selecteds==''|| this.urls=='' ||this.teacherName=='' ||this.gcId2==''||this.videomsg==''){
         MessageBox({
          title: '',
          message: '<span style="    color: #333333 !important; font-size: 1.6rem; text-align: center !important; line-height: 36px; height: 36px !important;margin: 20px;">请填写完整的分享信息</span>',
          showCancelButton: false,
          confirmButtonText:"返回填写",
          cancelButtonText:"",
        }).then(action=>{
              
          });
      }else{
        Indicator.open("上传中...");
        var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
        var that=this;
            axios({
                    method: 'Post',
                    url:domain+'/mobile/index.php?act=index&op=share_video',
                    data:{
                       key:that.$route.query.key,
                       gc_id_1:that.selecteds,
                       gc_id_2:that.gcId2,
                       teacher_name:that.teacherName,
                       link:that.urls,
                       video_des:that.videomsg,
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
                 MessageBox({
                  title: '',
                  message: '<span style="    color: #333333 !important; font-size: 1.6rem; text-align: center !important; line-height: 36px; height: 36px !important;margin: 20px;">发布完成!</span>',
                  showCancelButton: false,
                  confirmButtonText:"确认",
                  cancelButtonText:"",
                }).then(action=>{
                      if(action=='confirm'){
                        app.back();
                      }
                  });
              }else{
                 Toast(response.data.datas.error);
              }
               }else{
                  Toast("请求超时，请稍后重试");
               }
            },(err)=>{
              Indicator.close();
               Toast("请求超时，请稍后重试");
            });  
      }


    },
    changeSelected(e){
      var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
        var that=this;
            axios({
                    method: 'Post',
                    url:domain+'/mobile/index.php?act=index&op=share_get_gc',
                    data:{
                       key:that.$route.query.key,
                       gc_id:that.selecteds
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
                that.gcId2="";
                that.classList=results;
              
              }else{
                 Toast(response.data.datas.error);
              }
               }else{
                  Toast("请求超时，请稍后重试");
               }
            },(err)=>{
              Indicator.close();
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

.shareVideo{
    height:auto;
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
select{
  color:#69C0FF ;
}

/*
*分享视频
*/

.container{
     height: auto;
     margin:0px 5px;
}
.listItem{
    line-height: 48px;
    text-align: left;
    font-size: 1.4rem;
    color: #666;
}
.leftName{
  margin-left: 10px;
}
#selectInput{
    width: 68%;
    padding-left:10px;
    line-height: 32px;
    height: 32px;
    float: right;
    margin-top: 10px;
    margin-right: 10px;
    background-color:#fff;
    border:1px solid  #ddd;
}

.rightText{
    width: 65.5%;
    padding-left:5px;
    line-height: 32px;
    height: 32px;
    float:right;
    margin-right: 10px;
    border: 1px solid #ddd;
}

.rightInput{
     width: 88%;
    margin: 0px auto;
    display: block;
    height: 32px;
    border: 1px solid #ddd;
    padding-left: 5px;
    
}
.textares{
   width: 88%;
   padding-left:2%;
    margin: 0 auto;
    display: block;
    border: 1px solid #ddd;
}
.limit{              
  position: absolute;
    right: 8%;
    bottom: -2%;
    color: #999;
}
.btnShares{
  width:90%;
  height:48px;
  line-height:48        px;
 background: #69C0FF;
  border: 1px solid #FFFFFF;
  border-radius: 5px;
  color:#fff;
  margin-top:20px;
  margin-bottom:50px;
}
</style>
