<template>
  <div class="wrongQuestionBank">
     <div v-if="!noFetch" v-show="!isloading">
        
    <!--列表记录-->
     <ul class="searchli" v-if="!noData" 
      v-cloak
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="loading"
      infinite-scroll-distance="0"
     >
      <li v-for="(list,k) in answerList" :key="k">
        <span class="leftText">{{list.parent_name}}</span> 
        <span class="timeText">{{list.add_time}}</span>
        <span class="countText">{{list.error_count}}题</span>

       <div class="rightbtn">
         <button class="btnlook" @click="btnlook(list.mq_id)">查看</button>
         <button class="btndel" @click="btndel(list.mq_id)">删除</button>
       </div>
       <div style="clear:both"></div>
      </li>

      <div class="noMore" v-if="isMore">
          <div class="textloading" v-if="!showMore"><img src="../../assets/load.gif"/></div>
                 <div class="textloading" v-else>没有更多了</div>
      </div>

    </ul>
      <div class="noList" v-else>
            <p ><img src="../../assets/noMessage.gif" class="noMessage"/></p>
            <p>恭喜！答题全部正确</p>   
      </div> 

    </div>
     <ul class="noFetch" v-else @click="loadFetch()" v-show="!isloading">
        <img src="../../assets/noFetch.png" />
        <p>网络无法连接</p>
        <p >刷新</p>
      </ul>  
  </div>
</template>

<script>
import axios from 'axios'  //引入异步加载的网络请求
import { Toast,Loadmore,Indicator,MessageBox} from 'mint-ui';
export default {
  name: 'wrongQuestionBank',
  data () {
    return {
         noFetch:false,
        isCount:0,
        pageNum:0,
        noMore:false,
        showMore:false,
        allLoaded: false,
        isMore:false,
        loading:false,
        noData:false,
       answerList:[]
     
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
        this.fetchAnswer();
      },1000);
    }else{   //无网络状态
       this.noFetch=true;
       Toast({message:'网络不可用，请稍后重试',position: 'bottom',duration: 1500})
    }  
  },
  methods:{
    fetchAnswer(){
        var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
        var that=this;
         axios({
                    method: 'Post',
                    url:domain+'/mobile/index.php?act=questions&op=get_ques_error_list',
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
                 if(that.isCount==0){
                   that.isCount=1;
                 if(results.length!=0 && results.length<10){
                that.answerList=results;
                 that.isMore=false;
                 that.haveMore = false;   
                }else if(results.length==0){
                  that.haveMore = false;
                  that.isMore=false;
                  that.noData=true;
                }else{
                   that.answerList=that.answerList.concat(results);
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
                   that.answerList=that.answerList.concat(results);
                   that.haveMore=true; //可以加载更多
                   that.isMore=true;
                   that.showMore=false;
                } 
               }
              }else{
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
      loadMore(){
        if(this.haveMore){
           this.loading = true;
           this.showMore=false;
           this.isCount=1;
           this.fetchAnswer();
        }
    },
    
    btnlook(quId){
      console.log(quId);
       var domain = process.env.NODE_ENV == 'development' ? '' : 'http://' + window.location.host+"/wap/dist/";
        window.location.href=domain+"#/wrongPage/"+this.$route.params.bankId+"/"+quId+"?key="+this.$route.query.key+"&next_q_id="+this.$route.query.next_q_id;

    },
    btndel(anId){
      var that=this;  
      var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
       MessageBox.confirm('<span style="color:#333 !important;font-size:1.6rem">确定要删除该考卷？</span>','').then(action => {
          if (action == 'confirm') {  
                Indicator.open();         
                axios({
                      method: 'Post',
                      url:domain+'/mobile/index.php?act=questions&op=del_ques_error',
                      data:{
                        key:that.$route.query.key,
                        mq_id:anId,
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
                      that.isCount=0
                      Toast(response.data.datas);
                      that.fetchAnswer();
                    }else{
                      Toast(response.data.datas.error);
                    }
                }else{
                  that.noFetch=true;
                }
              },(err)=>{
                Indicator.close();
                Toast('请求超时，请稍后重试');
              }); 
           }else if(action=='cancel'){
            console.log("取消了");
          }  
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

.wrongQuestionBank{
    
}
/*
*searchli
*/
.searchli{
      display: block;
    height: auto;
    text-align: left;
}
.searchli li{
    height: 64px;
    line-height: 64px;
     display: -webkit-box;  /* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
    display: -moz-box;     /* 老版本语法: Firefox (buggy) */
    display: -ms-flexbox;  /* 混合版本语法: IE 10 */
    display: -webkit-flex; /* 新版本语法: Chrome 21+ */
    display: flex;         /* 新版本语法: Opera 12.1, Firefox 22+ */
    border-bottom: 1px solid #ddd;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    letter-spacing: 0;
    color: #333333;
    letter-spacing: 0;
}
.leftText{
   color: #69C0FF;
    margin-right: 5px;
    margin-left: 10px;
}
.timeText{
    
    margin-right: 5px;
}
.countText{

}
.btnlook{
      border: 0px none;
    width: 48px;
    height: 24px;
    background: #69C0FF;
    border-radius: 5px;
    color: #fff;
    margin-right: 5px;
}
.rightbtn{
     display: inline-block;
    text-align: right;
    flex: 1;
    margin-right: 5px;
}
.btndel{
       width: 50px;
    height: 24px;
    background: #69C0FF;
    border-radius: 5px;
    color: #69C0FF;
    margin-right: 5px;
    background: #FFFFFF;
    border: 1px solid #69C0FF;
    border-radius: 5px;
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
    display:block;
    text-align:center;
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
