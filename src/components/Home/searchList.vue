<template>
  <div class="searchList">
    <!--搜索-->
    <!--城市列表-->
   <header class="navHeader">
     <span class="leftIcon" @click="goback()"><img src="../../assets/leftIcon.png"/></span> 
     <div class="searchInput"><img class="searchIcon" src="../../assets/searchIcon.png"/><input type="search" v-model="keySearch" placeholder="搜索感兴趣课程或讲义" class="Inputvalue"/></div> 
     <span class="rightSearch" @click="fetchSearch">搜索</span>
   </header>

  <div v-show="!isloading">
    <div v-show="showSearch">
        <!--没有搜索的时候-->
   <div v-if="!showValue" class="searchValue">
      <div v-if="searchlist.length!=0"><h3 class="searchTitle" >搜索历史</h3><img src="../../assets/del.png" class="icons" @click="btnDelAll"/></div>
    
      <ul class="searLocation" v-if="searchlist.length!=0">
        <li v-for="(item,i) in searchlist" :key="i" @click="fetchList(item)"><span class="leftText"><img class="leftIcon" src="../../assets/searchlist.png">{{item.length>15?item.slice(0,15)+"...":item}}</span>
        <img src="../../assets/close.png" class="rightIcon" @click="btnDel(item,$event)"/>
         </li>
     </ul>
   <!--暂无数据-->
         <div class="noList" v-else>
            <p ><img src="../../assets/noMessage.gif" class="noMessage"/></p>
            <p>暂无搜索记录</p>   
         </div> 
   </div>

   <!--搜索有结果的时候-->
   <div v-else>
    <ul class="searchli" v-if="showList.length>0">
      <li v-for="(list,k) in showList" :key="k" @click="toVideo(list.goods_id,list.goods_name)">
       <span class="goodsImage"><img :src="list.goods_image"/></span> 
       <div class="rightInfo">
        <p class="goodsName">{{list.goods_name}}</p>
        <p class="className">类目：{{list.gc_id_2_name}}</p>
        <p class="playCount"><img src="../../assets/playCount.png"/>{{list.play_coun}}</p>
       </div>
      </li>
    </ul>
      <div class="noList" v-else>
            <p ><img src="../../assets/noMessage.gif" class="noMessage"/></p>
            <p>暂无符合条件记录</p>   
      </div> 

   </div>
    </div>
   </div>


  </div>
</template>

<script>
import axios from 'axios'  //引入异步加载的网络请求

import { Toast,Indicator,MessageBox} from 'mint-ui';
export default {
  name: 'searchList',
  data () {
    return {
     keySearch:"", //关键字
     noData:false,
     searchlist:[], //搜索历史
     showValue:false,
     showList:[],
     isCount:0,
       pageNum:0,
      noMore:false,
      showMore:false,
      allLoaded: false,
       isMore:false,
      loading:false,
      finished:false,
      key:this.$route.query.key,
      showSearch:true,

    }
  },
  created() {
    
  },
  mounted() {
     this.fetchlocalStorage();
     var that=this;
     $(".Inputvalue").keydown(function(e){
        var keywd = e.target.value;
        if(event.keyCode == 13 && keywd) { 
            that.fetchSearch();
        } 
    });
    var u = navigator.userAgent, app = navigator.appVersion;
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if(isiOS){
      $(".navHeader").css("height",'65px');
    }

  },

  computed:{
   isloading(){
      return this.$store.state.isloading;
    },
  },
  watch:{  //检测属性值的改变
    keySearch:function(newkeySearch){
      if(newkeySearch==""){
          this.showSearch=true; 
         this.showValue=false;
         this.fetchlocalStorage(); 
      }
    },
  },
  methods:{
    fetchlocalStorage(){ //搜索存储记录
      if(this.key!="" && this.key!=undefined && this.key !=null){
        this.$store.commit('increatement');  
        var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
        var that=this;
            axios({
                    method: 'Post',
                    url:domain+'/mobile/index.php?act=index&op=get_goods_keyword',
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
               Indicator.close();
               if(response!=undefined){
                   if(response.data.code==200){
                    var results=response.data.datas.keyword;
                    that.searchlist=results;
              }else if(response.data.code==400){
                  that.noData=true;
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
      }else{
        return "";
      }    
    },
    fetchSearch(val){  //搜索列表
        
      if(this.keySearch!=""){
        Indicator.open(); 
        this.showSearch=true;
        this.showValue=true; 
        this.$store.commit('increatement');  
        var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
        var that=this;
            axios({
                    method: 'Post',
                    url:domain+'/mobile/index.php?act=index&op=search_goods',
                    data:{
                       key:that.$route.query.key,
                       keyword:that.keySearch,
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
               Indicator.close();
               if(response!=undefined){
                   if(response.data.code==200){
                    var results=response.data.datas;
                    that.showList=results;
              }else if(response.data.code==400){
                  that.noData=true;
                  Toast(response.data.datas.error);
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
      }else{
        return "";
      }    

    },
    fetchList(val){
      console.log(val);
      Indicator.open(); 
      this.showSearch=true;
       this.showValue=true; 
      
        this.$store.commit('increatement');  
        var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
        var that=this;
            axios({
                    method: 'Post',
                    url:domain+'/mobile/index.php?act=index&op=search_goods',
                    data:{
                       key:that.key,
                       keyword:val,
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
               Indicator.close();
               if(response!=undefined){
                   if(response.data.code==200){
                    var results=response.data.datas;
                    that.showList=results;
              }else if(response.data.code==400){
                  that.noData=true;
                  Toast(response.data.datas.error);
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
            that.keySearch=val;
    },
    goback(){
      app.back();
    },
    toVideo(gc_Id){  //跳转到视频详情
      console.log(gc_Id,this.$route.query.key);
      app.toVideoDetail(gc_Id,this.$route.query.key);
    },
    btnDel(keyval,e){  //搜索某个特定历史记录
        e.stopPropagation();
        console.log(keyval);
       var that=this;  
      var domain = process.env.NODE_ENV == 'development' ? '' : 'http://' + window.location.host;
       MessageBox.confirm('<span style="color:#333 !important;font-size:1.6rem">确定删除该历史记录？</span>','').then(action => {
          if (action == 'confirm') {  
                Indicator.open();         
               console.log("删除了");
                var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
                var that=this;
                    axios({
                            method: 'Post',
                            url:domain+'/mobile/index.php?act=index&op=del_goods_keyword',
                            data:{
                              key:that.key,
                              keyword:keyval,
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
                      Indicator.close();
                      if(response!=undefined){
                          if(response.data.code==200){
                            that.fetchlocalStorage();
                      }else if(response.data.code==400){
                          Toast(response.data.datas.error);
                      }
                      }else{
                         Toast(response.data.datas.error);
                      }
                    },(err)=>{
                      Indicator.close();
                      that.noFetch=true;
                    }); 
           }else if(action=='cancel'){
            console.log("取消了");
          }  
      });
    },
    btnDelAll(){  //删除全部历史记录
      var that=this;  
      var domain = process.env.NODE_ENV == 'development' ? '' : 'http://' + window.location.host;
       MessageBox.confirm('<span style="color:#333 !important;font-size:1.6rem">确定删除全部历史记录？</span>','').then(action => {
          if (action == 'confirm') {  
                Indicator.open();         
               console.log("删除了");
                var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
                var that=this;
                    axios({
                            method: 'Post',
                            url:domain+'/mobile/index.php?act=index&op=del_goods_keyword',
                            data:{
                              key:that.key,
                              del_all:true,
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
                      Indicator.close();
                      if(response!=undefined){
                          if(response.data.code==200){
                            that.fetchlocalStorage();
                      }else if(response.data.code==400){
                          Toast(response.data.datas.error);
                      }
                      }else{
                         Toast(response.data.datas.error);
                      }
                    },(err)=>{
                      Indicator.close();
                      that.noFetch=true;
                    }); 
           }else if(action=='cancel'){
            console.log("取消了");
          }  
      });
    },
  
    goBack(){
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

.searchList{
    
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
/*
*搜索历史
*/
.searLocation{
    height: auto;
    text-align: left;
}
.searLocation li{
    height: 36px;
    line-height: 36px;
    font-family: PingFangSC-Regular;
    font-size: 1.2rem;
    color: #666666;
    letter-spacing: 0.7px;
    display: block;
    text-align: left;
    margin: 10px;
}
.icons{
    width: 20px;
    height: 20px;
    vertical-align: middle;
    padding: 10px;
    float: right;
}
.leftText{
    color: #666;
    vertical-align: middle;
}
.rightClose{
       width: 16px;
    height: 16px;
    float: right;
    margin-right: 10px;
    margin-top: 12px;
    vertical-align: middle;
}
.searchTitle{
      display: inline-block;
    font-size: 1.6rem;
    color: #333;
    padding-left: 10px;
    padding-top: 10px;
}
.searchValue{
  text-align:left;
}

/*
*空数据状态
*/
.noList{
    width: 100%;
    height: 100%;
    margin-top: 50px;
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

/*
*搜索结果
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
  height:100%;
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
</style>
