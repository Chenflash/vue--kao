<template>
  <div class="wrongPage">
      <div v-if="!noFetch" v-show="!isloading">
    <div class="centerPage">
      <p class="listType">{{listType}}</p>
      <p class="listContent">{{questionName}}</p>

      <ul class="centerInfo">
        <li v-for="(item,i ) in questionList" :key="i" :class="[isError.indexOf(questionList[i][0])>-1?'wrongActive':'titleName']">
        <input id="selectedId" type="radio"   :val="questionList[i][0]" :class="isError.indexOf(questionList[i][0])>-1?'disable':''" name="answer" />{{questionList[i][0]}}.{{questionList[i][1]}}
        </li>
      </ul>
    </div>
    <div class="bottomPage">
      <p class="answerTitle">解析</p>
      <p class="hrbottom"></p>
      <p class="realAnswer">正确答案：{{isReal}}</p>
      <p class="answer">{{trueContent}}</p>
    </div>
     <div class="bottomnext">
      <span class="nextText" @click="nextAnswer">下一题</span>
    </div>

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
import { Toast,Loadmore,Indicator,MessageBox} from 'mint-ui';
export default {
  name: 'wrongPage',
  data () {
    return {
      noFetch:false,
       isSelected:"",
      "listType": "",
      questionName:"",
      questionList:[],
      mq_id:"", //会员ID
      q_id:"",//当前题目ID
      next_q_id:this.$route.query.next_q_id,//下一个题目ID
      trueContent:"",
      isError:"",
      isReal:"",

    }
  },
   computed:{
   isloading(){
      return this.$store.state.isloading;
    },
  },
    mounted() {
      if(navigator.onLine){   //有网络状态
      Indicator.open();
       this.$store.commit('increatement');  
      setTimeout(()=>{
        this.fetcherror();
      },1000);
    }else{   //无网络状态
       this.noFetch=true;
       Toast({message:'网络不可用，请稍后重试',position: 'bottom',duration: 1500})
    } 
     var that=this;
    },
     methods:{
       fetcherror(){
          var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
        var that=this;
         axios({
                    method: 'Post',
                    url:domain+'/mobile/index.php?act=questions&op=get_ques_error',
                    data:{
                       key:that.$route.query.key,
                       mq_id:that.$route.params.quId,
                       next_q_id:that.next_q_id
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
                 that.listType=results.type;
                 that.questionName=results.title;
                 that.questionList=results.options;
                 that.mq_id=results.mq_id;
                 that.next_q_id=results.next_q_id;
                 that.q_id=results.q_id;
                 that.trueContent=results.parsing;
                 that.isReal=results.real.join("、");
                 that.isError=results.error;
                 

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
       nextAnswer(){  //下一题
          if(this.next_q_id==''){
            Toast("已经是最后一题");
          }else{
            var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
            var that=this;
                axios({
                        method: 'Post',
                        url:domain+'/mobile/index.php?act=questions&op=get_ques_error',
                        data:{
                          key:that.$route.query.key,
                          mq_id:that.mq_id,
                          next_q_id:that.next_q_id,
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
                      that.listType=results.type;
                      that.questionName=results.title;
                      that.questionList=results.options;
                      that.mq_id=results.mq_id;
                      that.next_q_id=results.next_q_id;
                      that.q_id=results.q_id;
                      that.trueContent=results.parsing;
                      that.isReal=results.real.join("、");
                      that.isError=results.error;
                 
                    var domain = process.env.NODE_ENV == 'development' ? '' : 'http://' + window.location.host+"/wap/dist/";
                      window.location.href=domain+"#/wrongPage/"+that.$route.params.bankId+"/"+that.$route.params.quId+"?key="+that.$route.query.key+"&next_q_id="+that.$route.query.q_id;

                  }else{
                    Toast(response.data.datas.error);
                  }
                  }else{
                    that.noFetch=true;
                  }
                },(err)=>{
                  Indicator.close();
                    Toast(response.data.datas.error);
                });
          }  
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

.wrongPage{
       height: auto;
    text-align: left;  
}
.titleName,.wrongActive,.trueActive{
  font-family: PingFangSC-Regular;
  font-size: 15px;
  letter-spacing: 0;
} 
.titleName{
  
  color: #666666;
}
.wrongActive{
  color:#ff0000;
}
.trueActive{
  color:#69C0FF;
}
.centerPage{
      font-family: PingFangSC-Regular;
    font-size: 15px;
    color: #333333;
    letter-spacing: 0;
    width: 90%;
    margin: 0 auto;
}
.listType{
      margin-top: 10px;
    margin-bottom: 10px;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #69C0FF;
    letter-spacing: 0;
    border: 1px solid #69C0FF;
    display: inline-block;
    padding: 3px;
}
.listContent{
   text-indent: 30px;
}
.centerInfo{
   font-family: PingFangSC-Regular;
    font-size: 15px;
    color: #666666;
    letter-spacing: 0;
    margin-top: 10px;
}
.centerInfo li{
       
       padding: 10px 0px;
}
.bottomPage{
      display: block;
    font-family: PingFangSC-Regular;
    font-size: 15px;
    color: #999999;
    letter-spacing: 0;
    text-align: center;
    width: 90%;
    margin: 0 auto;
}
.answerTitle{
   padding-bottom: 10px;
    padding-top: 16px;
    display: inline-block;
    width: 20%;
    height: 20%;
    z-index: 999;
    background-color: #fff;
}
.hrbottom{
      height: 1px;
    background-color: #ddd;
    margin-top: -23px;
}
.answer{
     text-indent: 25px;
    text-align: left;
    line-height: 22px;
    padding-top: 10px;
}
.radioChecked{
      width: 20px;
    height: 20px;
    border: 1px solid #ddd;
    border-radius: 50%;
    vertical-align: top;
    margin-right: 10px;
}
.realAnswer{
   text-align: left;
    margin-top: 10px;
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
#selectedId{
    width: 20px;
    height: 20px;
    border: 1px solid #ddd;
    border-radius: 50%;
    vertical-align: sub;
    margin-right:10px;
}
.disable{
   background:url('../../assets/isSelected.png') no-repeat center center;/*背景图的写法是生效的*/
   
}
.bottomnext{
  text-align:center;
  color:#69C0FF;
  font-size:1.6rem;
  margin-bottom:30px;
  margin-top:30px;
}
.nextText{
  text-align:center;
}
</style>
