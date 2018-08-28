<template>
  <div id="app">
    
     <keep-alive>
    <!--缓存-->
     <transition :name="transitionName"> 
    <router-view v-if="$route.meta.keepAlive"  v-show="isRouterAlive" class="clearTop"></router-view>
    </transition>
   </keep-alive>
 
   <!--不缓存-->
   <router-view v-if="!$route.meta.keepAlive"  v-show="isRouterAlive"  class="clearTop"></router-view>
    
    
  </div>
</template>

<script>
import store from './VueX/store'
import {mapState,mapGetters,mapActions,mapMutations}from'vuex' 
import axios from 'axios'
export default {
  name: 'App',
   data(){
   return{
     　transitionName: 'slide-right',  // 默认动态路由变化为slide-right
        isRouterAlive:true, //刷新
   }
  },
   provide(){
    return{
      reload:this.reload
    }
  },
   watch: {
　　　'$route' (to, from) {
　　　　let isBack = this.$router.isBack  //  监听路由变化时的状态为前进还是后退
　　　　　　if(isBack) {
　　　　　　　　this.transitionName = 'slide-right'
　　　　　　} else {
　　　　　　       this.transitionName = 'slide-left'
　　　　　}
　　this.$router.isBack = false
　　}
  },
  methods:{
    reload(){
      this.isRouterAlive=false;
      this.$nextTick(function(){
        this.isRouterAlive=true;
      })
    }
  },
}
</script>

<style>

* {
		margin: 0;
		padding: 0;
    -webkit-touch-callout:none;  /*系统默认菜单被禁用*/
    -webkit-user-select:none; /*webkit浏览器*/
    -khtml-user-select:none; /*早期浏览器*/
    -moz-user-select:none;/*火狐*/
    -ms-user-select:none; /*IE10*/
    user-select:none;
    scrollbar-3dlight-color:#fff; 
    scrollbar-highlight-color:#fff; 
    scrollbar-arrow-color:#fff;
    scrollbar-shadow-color:#fff;
    scrollbar-darkshadow-color:#fff;
    scrollbar-base-color:#fff; 
    scrollbar-track-color:#fff;
}

/*vue*/
			[v-cloak] {
			  display: none;
			}
html,body{
  font-size:10px;
}
input,button,select,textarea{ outline:none; -webkit-user-select:auto; /*webkit浏览器*/}
textarea{resize:none}
ol,ul,li{
	list-style: none;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  /*增加该属性可以增加弹性*/
  -webkit-overflow-scrolling: touch;
}
iframe{
  opacity:0  !important;
  display:none !important;
  z-index:-999;
}
input{ 
-webkit-appearance: none;   /*兼容ios的内影效果*/
-webkit-tap-highlight-color:rgba(0,0,0,0);


}
::-webkit-scrollbar {/*隐藏滚轮*/
　　display: none;
}

textarea{ 
-webkit-appearance: none;   /*兼容ios的内影效果*/
-webkit-tap-highlight-color:rgba(0,0,0,0);
}
button{
  -webkit-appearance: none;   /*兼容ios的内影效果*/
  -webkit-tap-highlight-color:rgba(0,0,0,0);
}
img{
  background-size:cover;
  vertical-align:middle;
}
img:not([src]){opacity:0;}
/*
*没有更多
*/
.noMore{
  margin-top:50px !important;
  margin-bottom:10px !important;
}
.TwoNomore{
   margin-top:50px !important;
  margin-bottom:10px !important;
}

.mint-header{
  background-color:#ffffff !important;
  color:#333 !important;
  height:60px !important;

}
.mint-header .mint-button{
  color: #69C0FF !important;
}
.mint-search{
  height:100% !important;
}
.mint-msgbox-content{
     padding: 20px 20px 20px !important;
}
/*
*MessageBox的样式
*/
/*

.mint-msgbox-btns{
      font-size: 1.6rem !important;
      display: block !important;
      text-align: right !important;
}
.mint-msgbox-cancel{
   border-right: 0 none !important;
    width:20% !important;

}
.mint-msgbox-confirm{
  color: #24b628 !important;
    margin-right: 10px !important;
    width: 20% !important; 
}
.mint-msgbox-content{
  border-bottom:0 none !important;
}
.mint-msgbox-btn{
  flex:0 !important; 
   display: inline-block !important;
  text-align: right !important;

}
*/
</style>
