<template>
  <div id="detail">
    <!-- 导航栏 -->
    <detail-nav-bar @titleClick="titleClick" class="detail-bar" ref="nav"/>
    <!-- 滚动条 -->
    <scroll class="content" 
            ref="scroll" 
            :probeType="3"
            @scroll="contentScroll"> 

      <!-- 测试是否正常：结果正常 -->
      <!-- <ul>
        <li v-for="item in $store.state.cartList" :key="item.index">
            {{item}}
        </li>
      </ul> -->
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
    <detail-bottom-bar @addCart="addToCart" />
    <!-- 回到顶部的组件 -->
    <back-top @click.native="backClick" v-show="isshowBackTop"></back-top>
    <!-- <toast :message="message" :show="show" /> -->
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
import BackTop from 'components/content/backTop/BackTop'
// import Toast from 'components/common/toast/Toast'

import {getDetail, Goods, Shop, GoodsParam, getRecommend} from 'network/detail'
import {debounce} from "common/utils"
import {itemListenerMixin, backTopMixin} from "common/mixin"

import { mapActions } from 'vuex'

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
    BackTop,
    // Toast
  }, 
  mixins: [itemListenerMixin, backTopMixin],
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
      // message: '',
      // show: false
   }
  },
  created() {
    // 1.保存传入的iid
    this.iid = this.$route.params.iid

    // 2.根据iid请求详细数据
    getDetail(this.iid).then(res => {
      // console.log(res)
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

      // console.log(this.themeTopYs)
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
    // 映射函数，这样可以通过不调用使用下面的addCart
    ...mapActions(['addCart']),
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
      // 3.判断BackTop是否显示
        this.listenShowBackTop(position)
    },
    // 监听回到顶部的方法
    backClick() {
      this.$refs.scroll.scrollTo(0, 0) 
    },
    // 添加到购物车addCart的方法
    addToCart() {
      console.log('在购物车车了~')
      // 1.获取购物车需要展示的信息
      const product = {};
      product.image = this.topImages[0];
      product.title = this.baseInfo.title;
      product.desc = this.baseInfo.desc;
      product.price = this.baseInfo.realPrice;
      product.iid = this.baseInfo.iid;


      // 2.将商品添加到购物车
      // 可以使用vuex保存商品
      this.$store.dispatch('addCart', product).then(res => {

        this.$toast.show(res, 1500);
      })

      this.addCart(product).then(res => {
        console.log(res)
      })

      // 3.添加到购物车

    }
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