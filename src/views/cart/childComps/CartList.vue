<template>
  <div class="cart-list">
    <scroll class="content">
      <!-- <li v-for="item in cartList" :key="item.index">{{item}}</li> -->
      <!-- 购物车商品的列表 -->
      <cart-list-item 
            v-for="(item, index) in cartList" 
            :product="item" 
            :key="index"/>
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
  }

}
</script>

<style scoped>
.cart-list {
  height: calc(100% - 44px)
}

.content {
  height: calc(100% - 44px);
  overflow: hidden;
}
</style>