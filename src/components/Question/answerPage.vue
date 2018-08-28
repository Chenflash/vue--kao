<template>
  <div class="answerPage">
  <header data-v-04f39bc3="" class="mint-header"  style="line-height:60px !important;">
  <div class="mint-header-button is-left" @click="toreturn()">
    <a data-v-04f39bc3="" href="javascript:;" class="router-link-active">
    <button data-v-04f39bc3="" class="mint-button mint-button--default mint-button--normal">
    <span class="mint-button-icon"><i class="mintui mintui-back"></i></span>
    <label class="mint-button-text"></label></button>
    </a>
    </div>
      <h1 class="mint-header-title" style="color:#333!important;font-size:1.8rem">{{anTitle}}</h1> 
      <div class="mint-header-button is-right"></div>
    </header>
    <div v-if="!noFetch" v-show="!isloading">
      <div class="centerPage">
      <div class="listType"><span class="types">{{listType}}</span></div>
      <p class="listContent">{{questionName}}</p>

      <ul class="centerInfo">
        <li v-for="(item,i ) in questionList" :key="i">
        <input :id="i" type="radio"  :val="questionList[i][0]" class="radioChecked" data-count="0" name="answer" />{{questionList[i][0]}} {{questionList[i][1]}}
        </li>
      </ul>
    
    <div class="bottomnext">
      <span class="nextText" @click="nextAnswer">下一题</span>
      <div class="time">答题时间：<span class="centerTime">{{toTime}}</span>/<span class="totalTime">{{totalTime}}</span></div>
    </div>
    <div class="footerPage">
      <span class="count"><img src="../../assets/trueSelected.png"/>{{trueSeceted}}</span>
      <span class="count"><img src="../../assets/falseSelected.png"/>{{falseSelected}}</span>
      <span class="total"><img src="../../assets/countSelected.png"/>{{nowCount}}/{{toCount}}</span>
      <span class="btnHandover" @click="btnQuestions">交卷</span>
   
    </div>
    </div> 
    </div>
    
    
  </div>
</template>

<script>
import axios from 'axios'  //引入异步加载的网络请求
import { Toast,Loadmore,Indicator,MessageBox} from 'mint-ui';
export default {
   inject:['reload'], //依赖注入
  name: 'answerPage',
  data () {
    return {
      noFetch:false,
      isSelected:"",
      "listType": "",
      "toTime":"00:00",
      newTime:0,
      countTime:180*60,
      "totalTime":"180:00",
      "trueSeceted":'',
      "falseSelected":'',
      nowCount:'',
      toCount:'',
      questionName:"",
      questionList:[],
      mq_id:"", //会员ID
      q_id:"",//当前题目ID
      next_q_id:"",//下一个题目ID
      selectedOptions:'',
      anTitle:this.$route.query.anTitle,
      isCount:0,

      
          
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
        this.fetchAnswer();
      },1000);
    }else{   //无网络状态
       this.noFetch=true;
       Toast({message:'网络不可用，请稍后重试',position: 'bottom',duration: 1500})
    } 
    this.countTimes();
     var that=this;
    $(".centerInfo").on('click','.radioChecked',function(e){
         if(that.listType=='单选题' ){
            for(var i=0;i<$(e.target.parentElement).siblings().length;i++){
            var event=$(e.target.parentElement).siblings()[i].children[0];
            $(event).removeClass('disable');
          }
          $(e.target).addClass('disable');
           that.isSelected=$(e.target).attr('val');
         }else {
             if($(e.target).attr("data-count")==0){
                $(e.target).addClass('disable');
              $(e.target).attr('data-count','1');
              var str=$(e.target).attr('val')+";"+that.isSelected;
              str=str.split(';');
              str=Array.from(new Set(str));
              str=str.join(';');
              that.isSelected=str;
              console.log(that.isSelected);
             }else if($(e.target).attr("data-count")==1){
                 $(e.target).removeClass('disable');
                  $(e.target).attr('data-count','0');
                  var strs=$(e.target).attr('val');
                  if(that.isSelected.indexOf(strs)>-1){
                    var selectedList=[];
                    that.isSelected=that.isSelected.split(";");                    
                   for(var i=0;i<that.isSelected.length;i++){
                      if(that.isSelected[i]!=strs ){
                        selectedList.push(that.isSelected[i]);
                      }
                    }
                    console.log(selectedList.join(";"));
                    that.isSelected=selectedList.join(";");
                    return  that.isSelected;
                  }
             } 
            
         }
          
     })
  },
  methods:{
    fetchAnswer(){
        var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
        var that=this;
         axios({
                    method: 'Post',
                    url:domain+'/mobile/index.php?act=questions&op=star_questions',
                    data:{
                       key:that.$route.query.key,
                       parent_id:that.$route.params.bankId
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
                 that.listType=results.this_ques.type;
                 that.questionName=results.this_ques.title;
                 that.questionList=results.this_ques.options;
                 that.trueSeceted=results.member_ques.real_count;
                 that.falseSelected=results.member_ques.error_count;
                 that.nowCount=results.member_ques.this_ques_count;
                 that.toCount=results.member_ques.ques_count;
                 that.mq_id=results.member_ques.mq_id;
                 that.next_q_id=results.member_ques.next_q_id;
                 that.q_id=results.this_ques.q_id;
              }else{
                 Toast(response.data.datas.error);
              }
               }else{
                 Indicator.close();
                 Toast("请求网络超时，请稍后重试");
                 that.noFetch=true;
               }
            },(err)=>{
              Indicator.close();
               that.noFetch=true;
            });   
    },
    btnQuestions(){   //交卷
      var that=this;
      if(that.isSelected==""){
        Toast("请先选择答案");
      }else{
          MessageBox({
          title: '',
          message: '<span style="    color: #333333 !important; font-size: 1.6rem; text-align: center !important; line-height: 36px; height: 36px !important;margin: 20px;">是否确认交卷？</span>',
          showCancelButton: true,
          confirmButtonText:"确认",
          cancelButtonText:"取消",
        }).then(action=>{
              if (action == 'confirm') {
                that.formData();
              } 
          });
      }

    },
   
    nextAnswer(){
      if(this.isSelected==""){
        Toast({message:"请先选择答案"});
      }else{

        if(this.next_q_id!=''){
        this.nowCount++  
        var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
        var that=this;
            axios({
                    method: 'Post',
                    url:domain+'/mobile/index.php?act=questions&op=next_ques',
                    data:{
                       key:that.$route.query.key,
                       q_id:that.q_id,
                       options:that.isSelected,
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
                 that.listType=results.this_ques.type;
                 that.questionName=results.this_ques.title;
                 that.questionList=results.this_ques.options;
                 that.trueSeceted=results.member_ques.real_count;
                 that.falseSelected=results.member_ques.error_count;
                  that.nowCount=results.member_ques.this_ques_count;
                 that.toCount=results.member_ques.ques_count;
                 that.mq_id=results.member_ques.mq_id;
                 that.next_q_id=results.member_ques.next_q_id;
                 that.q_id=results.this_ques.q_id;
                 $(".radioChecked").removeClass("disable");
                 that.isSelected="";
                 that.$router.push({name:'answerPage',params:{ parent_id:that.$route.params.bankId},query:{key:that.$route.query.key,q_id:that.q_id}}); 
                 
              }else{
                 Toast(response.data.datas.error);
              }
               }else{
                  Indicator.close();
                 Toast("请求网络超时，请稍后重试");
               }
            },(err)=>{
              Indicator.close();
                Toast(response.data.datas.error);
            });  
        }else{
          var that=this;
             MessageBox({
              title: '',
              message: '<span style="    color: #333333 !important; font-size: 1.6rem; text-align: center !important; line-height: 36px; height: 36px !important;margin: 20px;">答题完毕!请交卷？</span>',
              showCancelButton: false,
              confirmButtonText:"确认",
              cancelButtonText:"取消",
            }).then(action=>{
                  if (action == 'confirm') {
                    that.formData();
                  } 
              });
           }

      }
    },
    toreturn(){ //返回
      var that=this;
       if(that.nowCount==1){
         app.back();
       }else{
       MessageBox({
          title: '',
          message: '<span style="    color: #333333 !important; font-size: 1.6rem; text-align: center !important; line-height: 36px; height: 36px !important;margin: 20px;">是否确认返回？</span>',
          showCancelButton: true,
          confirmButtonText:"确认",
          cancelButtonText:"取消",
        }).then(action=>{
          if (action == 'confirm') {
            that. getBack();
          } 
      });
      }
    },
     countTimes(){
        var that=this;
        if(that.newTime==parseInt(that.countTime-600)){ //倒计时10分钟
       MessageBox({
          title: '',
          message: '<span style="    color: #333333 !important; font-size: 1.6rem; text-align: center !important; line-height: 36px; height: 36px !important;margin: 20px;">你的考试时间只剩下<span style="color:#ff0011">10分钟</span>!</span>',
          showCancelButton: false,
          confirmButtonText:"确认",
          cancelButtonText:"",
        });
        that.newTime++;  
        that.countTimes();
        }else if(that.newTime==that.countTime){
          MessageBox({
          title: '',
          message: '<span style="    color: #333333 !important; font-size: 1.6rem; text-align: center !important; line-height: 36px; height: 36px !important;margin: 20px;">考试时间已结束<span style="color:#ff0011">,请交卷!</span>!</span>',
          showCancelButton: false,
          confirmButtonText:"确认",
          cancelButtonText:"",
        }).then(action=>{
          if (action == 'confirm') {
            that.formData();
          } 
      });
          clearTimeout(that.timer); //清楚定时器
        }else if(that.newTime>=0 && that.newTime!=parseInt(that.countTime-600)){ 
          that.newTime++;                     
          that.timer=setTimeout(function(){
              var ms=that.newTime%60; //s钟
              var mis=Math.floor(that.newTime/60); //分钟
              ms=ms<10?'0'+ms:ms;
              mis=mis<10?'0'+mis:mis;
              that.toTime=mis+":"+ms; 
                that.countTimes(); 
          },1000);    
        } 
     },
    getBack(){
       var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
        var that=this;
         axios({
                    method: 'Post',
                    url:domain+'/mobile/index.php?act=questions&op=end_questions',
                    data:{
                       key:that.$route.query.key,
                       mq_id:that.mq_id,
                       q_id:that.q_id,
                       options:that.isSelected,
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
                app.back();
              }else{
                 Toast(response.data.datas.error);
              }
               }else{
                  Toast("请求网络超时，请稍后重试");
               }
            },(err)=>{
              Indicator.close();
               Toast("请求网络超时，请稍后重试");
            }); 
    },
    formData(){  //提交考试数据
       var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
        var that=this;
         axios({
                    method: 'Post',
                    url:domain+'/mobile/index.php?act=questions&op=end_questions',
                    data:{
                       key:that.$route.query.key,
                       mq_id:that.mq_id,
                       q_id:that.q_id,
                       options:that.isSelected,
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
                that.$router.push({name:'endAnswer',params:{ parent_id:that.$route.params.bankId},query:{key:that.$route.query.key,this_count:response.data.datas.this_count}});
              }else{
                 Toast(response.data.datas.error);
              }
               }else{
                 Toast("请求网络超时，请稍后重试");
               }
            },(err)=>{
              Indicator.close();
               Toast('请求超时，请稍后重试');
            });   
    },
    loadFetch(){
      location.reload();
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

.answerPage{
       height: auto;
    text-align: left;  
}
 input{
   -webkit-tap-highlight-color:!important transparent;
   -webkit-appearance: none; 
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
    
}
.types{
  font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #69C0FF;
    letter-spacing: 0;
    border: 1px solid #69C0FF;
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
    margin-bottom:80px;
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
.answer{
       text-indent: 25px;
    text-align: left;
    line-height: 22px;
    border-top: 1px solid #ddd;
    margin-top: -20px;
    padding-top: 25px;
}
.radioChecked{
      width: 20px;
    height: 20px;
    border: 1px solid #ddd;
    border-radius: 50%;
    vertical-align: middle;
    margin-right: 10px;
    background-color:#fff;
    -webkit-tap-highlight-color:transparent !important; /*移除ios内阴影*/
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
/*
*底部
*/
.bottomnext{
    background-color:#fff;
    position: fixed;
    left: 0px;
    right: 0px;
    bottom: 44px;
    height: 36px;
    font-size: 1.6rem;
    border-bottom: 1px solid #ddd;
     border-top: 1px solid #ddd;
}
.nextText{
   display: inline-block;
    width: 20%;
    line-height: 36px;
    text-align: center;
    font-family: PingFangSC-Regular;
    font-size: 1.6rem;
    color: #69C0FF;
    letter-spacing: 0;
    border-right: 1px solid #ddd;
}
.time{
      display: inline-block;
    margin-left: 5%;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #666666;
    letter-spacing: 0;
}
.centerTime{
      font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #69C0FF;
    letter-spacing: 0;
    line-height: 20px;
    margin-right: 5px;
}
.totalTime{
   margin-left:5px;
}
.footerPage{
   position: fixed;
    bottom: 0px;
    left: 0px;
    right: 0px;
    height: 44px;
    line-height: 44px;
    z-index: 1200;
    font-size:1.6rem;
    background-color:#fff;
}
.count{
      display: inline-block;
    margin: 0px 15px;
    font-family: PingFangSC-Regular;
    font-size: 1.6rem;
    color: #666666;
    letter-spacing: 0;
    vertical-align: middle;
}
.count img{
      width: 18px;
    height: 16px;
    vertical-align: middle;
    margin-right: 10px;
    
}
.total{
      display: inline-block;
    margin: 0px 10px;
    font-family: PingFangSC-Regular;
    font-size: 15px;
    color: #666666;
    letter-spacing: 0;
}
.total img{
     width: 18px;
    height: 16px;
    vertical-align: middle;
    margin-right: 10px;
}
.btnHandover{
        display: inline-block;
    float: right;
    width: 24%;
    height: 100%;
    background-color: #69C0FF;
    text-align: center;
    font-family: PingFangSC-Regular;
    font-size: 16px;
    color: #FFFFFF;
    letter-spacing: 0;
}
/*
*是否被选中
*/
.disable{
   background:url('../../assets/isSelected.png') no-repeat center center;/*背景图的写法是生效的*/
   
}

</style>
