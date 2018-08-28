import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    /**
     * 首页
     * **/
    {
      path: '/levelClassification/:gc_id',    //课程-二级分类页面，传递课程分类id
      name: 'levelClassification',
      component: resolve => require(['@/components/Home/levelClassification'],resolve),
      meta:{
        keepAlive: true,
      }
    },
    {
      path: '/levelClassPage/:gc_id',    //课程-二级分类页面，传递课程分类id,分页
      name: 'levelClassPage',
      component: resolve => require(['@/components/Home/levelClassPage'], resolve),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/searchList', //搜索
      name: 'searchList',
      component: resolve => require(['@/components/Home/searchList'], resolve),
      meta: {
        keepAlive: true,
      }
    }, {
      path: '/studentSee',
      name: 'studentSee',
      component: resolve => require(['@/components/Home/studentSee'], resolve),
      meta: {
        keepAlive: true,
        title: "考生必看"
      }
    }
    /***
     * 答题区域
     * 
    */
    , {
      path: '/answerPage/:bankId', //考卷页面,传递考卷id,跟token做参数,以?keys的形式
      name: 'answerPage',
      component: resolve => require(['@/components/Question/answerPage'], resolve),
      meta: {
        keepAlive: true
      }
    },{
      path: '/endAnswer/:bankId', //答题结束,传递考卷id,跟token做参数
      name: 'endAnswer',
      component: resolve => require(['@/components/Question/endAnswer'], resolve),
      meta: {
        keepAlive: true,
      }
    }, {
      path: '/wrongQuestionBank', //错题库，传递考卷id,跟token做参数
      name: 'wrongQuestionBank',
      component: resolve => require(['@/components/Question/wrongQuestionBank'], resolve),
      meta: {
        keepAlive: true,
        title: "错题库",
      }
    }, {
      path: '/wrongPage/:bankId/:quId', //错题页面，传递考卷id,错题ID,跟token做参数
      name: 'wrongPage',
      component: resolve => require(['@/components/Question/wrongPage'], resolve),
      meta: {
        keepAlive: true,
        title: "查看",
      }
    },
    {
      /**
       * 我的模块
       * **/
      path: '/shareVideo', //分享视频，跟token做参数
      name: 'shareVideo',
      component: resolve => require(['@/components/Mine/shareVideo'], resolve),
      meta: {
        keepAlive: true,
        title:"分享视频",
      }
      
    },
    {
      /**
       * 我的模块
       * **/
      path: '/newDetail/:push_id', 
      name: 'newDetail',
      component: resolve => require(['@/components/Mine/newDetail'], resolve),
      meta: {
        keepAlive: true,
        title: "我的消息",
      }

    },
    {
      path: '/callPhone', //我的客服
      name: 'callPhone',
      component: resolve => require(['@/components/Mine/callPhone'], resolve),
      meta: {
        keepAlive: true,
        title:"客服"
      }
    }, {
      path: '/brickList', //我的砖石,跟token做参数
      name: 'brickList',
      component: resolve => require(['@/components/Mine/brickList'], resolve),
      meta: {
        keepAlive: true,
        title:"钻石排行榜",
      }
    },
    {
      path: '/share', //share
      name: 'share',
      component: resolve => require(['@/components/Mine/share'], resolve),
      meta: {
        keepAlive: true,
        title: "分享有奖"
      }
    },
    {
      path: '/registAgree', //share
      name: 'registAgree',
      component: resolve => require(['@/components/Mine/registAgree'], resolve),
      meta: {
        keepAlive: true,
        title: "用户协议"
      }
    },
  ],
  //滚动位置
  scrollBehavior(to, from, savedPosition) {
    return {
      x: 0,
      y: 0
    }
  }
})
