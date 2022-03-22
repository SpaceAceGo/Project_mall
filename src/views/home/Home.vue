<template>
  <div id="home">
    <!-- 导航代码 -->
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>

    <!-- 流行，新款，精选复制过来 -->
    <tab-control class="tab-control" 
    :titles="['流行', '新款', '精选']"
    @tabClick="tabClick"
    ref="tabControl1"
    v-show="isTabFixed"
    />
    <!-- 滚动条的样式，上拉，监听滚动位置 -->
    <scroll 
      class="content" 
      ref="scroll" 
      :probe-type="3"  
      @scroll="contentScroll"
      :pull-up-load="true"
      @loadMore = "loadMore"
    >
      <!-- 轮播图  监听轮播图图片的高度 -->
      <home-swiper :banners="banners" @swiperImgLoad = "swiperImgLoad"/>
      <!-- 推荐信息 -->
      <recommend-view :recommends="recommends"/>
      <!-- 本周流行图片 -->
      <feature-view/>
      <!-- 流行，新款，精选 -->
      <tab-control class="tab-control" 
      :titles="['流行', '新款', '精选']"
      @tabClick="tabClick"
      ref="tabControl2"
      />
      <!-- 流行-新款-精选的商品展示 -->
      <goods-list :goods="showGoods"/>
    </scroll>
    <!-- 回到顶部的组件 -->
    <!-- 组件不能监听事件，如果要监听需要加入ative -->
    <back-top @click.native="backClick" v-show="isshowBackTop"></back-top>
  
  </div>
</template>

<script>
  import HomeSwiper from './childComps/HomeSwiper'
  import RecommendView from './childComps/RecommendView'
  import FeatureView from './childComps/FeatureView'

  import NavBar from 'components/common/navbar/NavBar'
  import TabControl from 'components/content/tabControl/TabControl' 
  import GoodsList from 'components/content/goods/GoodsList'
  import Scroll from 'components/common/scroll/Scroll'
  import BackTop from 'components/content/backTop/BackTop'

  import { getHomeMultidata, getHomeGoods} from "network/home";
  import { debounce } from 'common/utils'
  import {itemListenerMixin,  backTopMixin} from 'common/mixin'

  export default {
    name: "Home",
    components: {
      HomeSwiper,
      RecommendView,
      FeatureView,
      NavBar,
      TabControl,
      getHomeGoods,
      GoodsList,
      Scroll,
      BackTop
    },
    data() {
      return {
        banners: [],
        recommends: [],

        goods: {
          'pop': {page: 0, list: []},
          'new': {page: 0, list: []},
          'sell': {page: 0, list: []},
        },
        
        isshowBackTop: false,// 用来判断回到顶部是否出现
        currentType: 'pop',// 默认流行-新款-精选的类型是 pop
        tabOffsetTop: 0,  // 轮播图是否加载完成
        isTabFixed: false,// 是否吸顶，默认不吸顶
        saveScrollY: 0,// 保留离开的值
        // imgItemListener: null //用于监听home和image,已经使用混入

      }
    },
    mixins: [itemListenerMixin,  backTopMixin],
    computed: {
      showGoods() {
        return this.goods[this.currentType].list
      }
    },
    created() {
      // 1.请求多个数据
      this.getHomeMultidata()
      
      // 2. 请求商品数据
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell') 
    },
    destroyed(){
        console.log('home destroy')
    },
    mounted() {
      // 2.获取tabControl的offSetTop
      // 所有的组件都有一个属性$el，这个属性是获取元素的
      // console.log(this.tabOffsetTop = this.$refs.tabControl.$el.offsetTop);
    },
    //保留页面的滚动位置
    activated() {
      if( this.$refs.scroll){
          this.$refs.scroll.scrollTo(0, this.saveScrollY);
          this.$refs.scroll.refresh();
      }
    },
    deactivated() {
      // 1.页面失活时获取页面Y轴滚动的位置
      this.saveScrollY = this.$refs.scroll.getScrollY();
      
      // 2.取消全局事件监听
      this.$bus.$off('itemImgLoad', this.imgItemListener)
    },
    methods: {
      // 事件监听相关的方法
      tabClick(index) {
        switch(index) {
          case 0:
            this.currentType = 'pop'
            break
          case 1:
            this.currentType = 'new'
            break
          case 2:
            this.currentType = 'sell'
        }
        this.$refs.tabControl1.currentIndex = index;
        this.$refs.tabControl2.currentIndex = index;
      },  
      // 监听回到顶部的方法
      // backClick() {
      //   this.$refs.scroll.scrollTo(0, 0) 
      // },
      // 加载更多的方法
      loadMore() {
        this.getHomeGoods(this.currentType)
      },
      // 监听滚轮位置的方法
      contentScroll(position){
        // y是负值，需要先转成正值
        // 1.判断BackTop是否显示
        this.listenShowBackTop(position)
        
        // 2.决定tabControl是否吸顶（position:flex）
        this.isTabFixed = (-position.y) > this.tabOffsetTop
      },
      // 监听轮播图图片高度的方法
      swiperImgLoad() {
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
      },
      
      /**
       * 网络请求相关的方法
       */
      // 1.获取首页轮播图以及推荐数据
      getHomeMultidata(){
        getHomeMultidata().then(res => {
          this.banners = res.data.banner.list;
          this.recommends = res.data.recommend.list;
        }).catch(err => {
          console.log(err);
        });
      },
      // 2.获取商品数据
      getHomeGoods(type) {
        const page = this.goods[type].page + 1
        getHomeGoods(type, page).then(res => {
          // ...的方法可以对数组进行解析，然后塞到res.data.list里面去
          this.goods[type].list.push(...res.data.list)
          this.goods[type].page += 1

          // 结束上拉加载更多
          this.$refs.scroll.scroll.finishPullUp();
        })
      }

    }
  }
</script>

<style scoped>
#home {
  /* padding-top: 44px; */
  height: 100vh;
  position: relative;
}

.home-nav {
  background: var(--color-tint);
  color: #fff;

  /* 因为使用了better-scroll，所以导航栏用不到原生的滚动了 */
  /* position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 9; */
}

.tab-control {
  /* 实现流行-新款-精选的悬浮 */
  position: relative;
  z-index: 9;
}

.content{
  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
  overflow: hidden;
}



.goods-list {
  padding: 8px;
}
</style>
