<template>
  <div class="goods">
    <!-- {{goods}} -->
    <goods-list-item v-for="item in goods" :goods-item="item" :key="item.index"/>
  </div>
</template>

<script>
  import GoodsListItem from './GoodsListItem'

  export default {
    name: "GoodsList",
    components: {
      GoodsListItem
    },
    props: {
      goods: {
        type: Array,
        default() {
          return []
        }
      }
    }
  }
</script>

<style scoped>
  .goods {
    display: flex;
    /* 默认情况下包裹
    会根据宽度,一行显示多少个 */
    flex-wrap: wrap;
    justify-content: space-around;

    padding: 2px;
  }


</style>
