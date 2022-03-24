<template>
  <div class="bottom-bar" >

      <div class="check-content">
        <check-button 
              :isSelected=isSelectAll 
              class="check-button"
              @click.native="checkClick"
        />
        <span>全选</span>
      </div>
      <div class="price">
        合计：{{totalPrice}}
      </div>
      <div class="calculate" @click="calcClick">
        去结算({{checkLength}})
      </div>

  </div>

</template>

<script>
import CheckButton from 'components/content/checkButton/CheckButton';

import { mapGetters } from 'vuex'

export default {
  
  name: 'CartBottomBar',
  components:{
    CheckButton
  },
  computed:{
    ...mapGetters(['cartList']),
    totalPrice() {
      return '￥' + this.cartList.filter(item => {
        return item.checked
      }).reduce((preValue, item) => {
        return preValue + item.price * item.count
      }, 0).toFixed(2)
    },
    checkLength() {
      return this.cartList.filter(item => item.checked).length
    },
    isSelectAll() {
      // return !(this.cartList.filter(item => item.checked).length)
      // 只要一个没有选中就返回不选中
      if(this.cartList.length ===0 ) {
        return false
      }
      return !this.cartList.find(item => !item.checked)
    }
  },
  methods:{
    checkClick() {
      if (this.isSelectAll) {//全部选中
        this.cartList.forEach(item => item.checked = false)
      } else {//部分或全部不选中
        this.cartList.forEach(item => item.checked = true)
      }
      // this.cartList.forEach(item => item.checked = !this.isSelectAll)
    },
    calcClick() {
      if (!this.isSelectAll) {
        this.$toast.show('请选择购买的商品', 2000)
      }
    }
  }
}
</script>

<style scoped>
/* 设置底部汇总格式 */
.bottom-bar {
  position: relative;
  background-color: #eee;
  display: flex;
  
  height: 40px;
  bottom: 89px;
  line-height: 40px;
}

/* 设置全选框和字的格式 */
.check-content {
  display: flex;
  align-items: center;
  padding: 8px 8px;
  text-align: center;
  width: 100px;
}

/* 设置全选框和字的距离 */
.check-content span {
  margin-left: 8px;
}



/* 总价 */
.price {
  margin-left: 30px;
  flex: 1;
}

/* 去计算 */
.calculate{
  background-color: red;
  color: #fff;
  text-align: center;
  width: 100px;

}
</style>