<template>
  <div class="cart-list">
    <scroll class="content" ref="scroll">

      <!-- 购物车商品的列表 -->
      <cart-list-item 
        v-for="(item, index) in cartList" 
        :key="index"
        :goodsItem="item" 
      />
      
    </scroll>
  </div>
</template>

<script>
import Scroll from 'components/common/scroll/Scroll'
import CartListItem from './CartListItem';

import {mapGetters} from 'vuex'

export default {
  name: "CartList",
  components: {
    Scroll,
    CartListItem,
  },
  computed: {
    ...mapGetters(['cartList'])
  },
  activated() {
    // 作用：用于在页面内容加载完成之后进行刷新
    // 解决不能滚动的问题
    this.$refs.scroll.refresh()
  }

}
</script>

<style scoped>
.cart-list {
  height: calc(100% - 44px)
}

.content {
  height: calc(100% - 44px - 40px);
  overflow: hidden;
}
</style>