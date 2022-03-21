<template>
  <nav-bar>
      <div slot="left" class="back" @click="backHome">
          <img src="@/assets/img/common/back.svg" alt="">
      </div>
      <div slot="center" class="titles">
          <div 
            v-for="(item, i) in titles" 
            :key="i" 
            class="title-item"
            :class="{active: currentIndex === i}"
            @click="titleClick(i)">{{item}}</div>
      </div>
  </nav-bar>
</template>

<script>
import NavBar from '@/components/common/navbar/NavBar';

export default {
    name: 'DetailNavBar',
    data() {
        return {
            titles:['商品','参数','评论','推荐'],
            currentIndex: 0,
        }
    },
    components: {
        NavBar,
    },
    methods: {
        backHome() {
            this.$router.push('/home');
        },
        titleClick(index){
            this.currentIndex = index;
            this.$emit('titleClick', index, 500);
        }
    },
}
</script>

<style scoped>
 .back img {
     width: 24px;
     height: 24px;
     vertical-align: middle;
 }
 .titles {
     display: flex;
 }
 .titles .title-item{
     flex: 1;
 }
 .active {
     color: var(--color-tint);
 }
</style>
