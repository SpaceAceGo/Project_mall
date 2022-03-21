<template>
  <div id="detail">
    <!-- 导航栏 -->
    <detail-nav-bar @titleClick="titleClick" class="detail-bar" ref="nav"/>
    <!-- 滚动条 -->
    <scroll class="content" 
            ref="scroll" 
            :probeType="3"
            @scroll="contentScroll"> 
      <!-- 轮播图 -->
      <detail-swiper :topImages="topImages"/>
      <!-- 商品基本信息的展示 -->
      <detail-base-info :baseInfo="baseInfo"/>
      <!-- 店铺信息的展示 -->
      <detail-shop-info :shop-info="shopInfo" />
      <!-- 商品详细数据 -->
      <detail-goods-info :goods-info="goodsInfo" @goodsInfoImgLoad="goodsInfoImgLoad" />
      <!-- 商品参数信息 -->
      <detail-param-info ref="params" :param-info="paramInfo" />
      <!-- 评论信息 -->
      <detail-comment-info ref="comment" :comment-info="commentInfo" />
      <!-- 商品推荐信息 -->
      <goods-list ref="recommend" :goods="recommends" />
    </scroll>
    <!-- 底部工具栏 -->
    <detail-bottom-bar/>
    <!-- 回到顶部的组件 -->
  </div>
</template>

<script>
import DetailNavBar from './childComps/DetailNavBar';
import DetailSwiper from './childComps/DetailSwiper';
import DetailBaseInfo from './childComps/DetailBaseInfo';
import DetailShopInfo from './childComps/DetailShopInfo';
import DetailGoodsInfo from './childComps/DetailGoodsInfo';
import DetailParamInfo from './childComps/DetailParamInfo';
import DetailCommentInfo from './childComps/DetailCommentInfo';
import DetailBottomBar from './childComps/DetailBottomBar';

import Scroll from 'components/common/scroll/Scroll.vue';
import GoodsList from 'components/content/goods/GoodsList'

import {getDetail, Goods, Shop, GoodsParam, getRecommend} from 'network/detail'
import {debounce} from "common/utils"
import {itemListenerMixin} from "common/mixin"

export default {
  name: "Detail", 
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailBottomBar,
    Scroll,
    GoodsList,
    
  }, 
  mixins: [itemListenerMixin],
  data() {
    return {
      iid: null,
      topImages: [],
      goods: null,
      goodsInfo: {},
      baseInfo: {},
      shopInfo: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      themeTopYs: [],
      getThemeTopY: null,
      currentIndex: 0,
      // imgItemListener: null //用于监听home和image,已经使用混入
      isshowBackTop: false,// 用来判断回到顶部是否出现
   }
  },
  created() {
    // 1.保存传入的iid
    this.iid = this.$route.params.iid

    // 2.根据iid请求详细数据
    getDetail(this.iid).then(res => {
      console.log(res)
      const data = res.result;
      // 1.获取顶部的图片轮播数据
      this.topImages = data.itemInfo.topImages;
      // 2.获取商品信息
      this.baseInfo = new Goods(data.itemInfo, data.columns, data.shopInfo.services);
      // 3.创建店铺信息的对象
      this.shopInfo = new Shop(data.shopInfo);
      // 4.保存商品的详情数据
      this.goodsInfo = data.detailInfo;
      // 5.获取参数的信息
      this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)
      // 6.取出评论的信息
      if( data.rate.cRate !== 0 ){
        this.commentInfo = data.rate
      }

      // this.$nextTick(() => {
      //   // 根据最新的数据,对应的DOM是已经被渲染出来
      //   // 但是图片依然是没有加载完(目前获取到的offsetTop不包含其中的图片)
      //   this.themeTopYs = []

      //   // 点击标题滚动到相应内容
      //   this.themeTopYs.push(0)
      //   this.themeTopYs.push(this.$refs.params.$el.offsetTop)
      //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
      //   this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
        
      //   console.log(this.themeTopYs)
      // })

    })

    // 3.请求推荐数据
    getRecommend().then(res => {
      this.recommends = res.data.list
    })

    // 4.给getThemeTopY赋值
    this.getThemeTopY = debounce(() => {
      // 点击标题滚到相应的内容
      this.themeTopYs = []

      this.themeTopYs.push(0)
      this.themeTopYs.push(this.$refs.params.$el.offsetTop)
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
      this.themeTopYs.push(Number.MAX_VALUE)

      console.log(this.themeTopYs)
    })
  },
  mounted() {

    
  },
  update() {
    

  },
  destroyed() {
    this.$bus.$off('itemImgLoad', this.imgItemListener);
  },
  methods: {
  // 3.页面商品详情图片加载
    goodsInfoImgLoad() {
      this.refresh;
      this.getThemeTopY()
    },
    titleClick(index) {
      // console.log(index);
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 500)
    },
    contentScroll(position) {
      // 1.获取y值
      const positionY = -position.y

      // 2.positionY和主题中的值进行对比:hack写法
      // 用空间换时间
      let length = this.themeTopYs.length
      for(let i = 0; i < length - 1; i++) {
        if ( this.currentIndex != i && (positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i + 1]) ){
          this.currentIndex = i
          this.$refs.nav.currentIndex = this.currentIndex
        }
      }
    },
  }
}
</script>

<style scoped>
#detail {
  position: relative;
  z-index: 1;
  background: #fff;
  height: 100vh;
}
.detail-bar {
  position: relative;
  z-index: 9;
  background-color: #fff;
}

.content {
  height: calc(100% - 44px);
  background-color: #fff;
  /* position: absolute;
  top: 44px;
  left: 0;
  right: 0;
  bottom: 58px;
  overflow: hidden; */
}
</style>