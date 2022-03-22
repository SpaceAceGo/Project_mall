import {debounce} from "common/utils"
import BackTop from 'components/content/backTop/BackTop'

export const itemListenerMixin = {
  data() {
    return {
      itemImgListener: null,
      refresh: null
    }
  },
  mounted() {
    this.refresh = debounce(this.$refs.scroll.refresh, 500)
    
    this.imgItemListener =  () => {
      this.refresh;
    }
    
    this.$bus.$on('itemImgLoad', this.imgItemListener)
  }
}

export const backTopMixin = {
  components: {
    BackTop
  },
  data() {
    return {
      isShowBackTop: false
    }
  },
  methods: {
    // 回到顶部的按钮
    backClick() {
      this.$refs.scroll.scrollTo(0, 0, 500) 
    },
    // 判断回到顶部是否显示
    listenShowBackTop(position) {
      this.isshowBackTop = (-position.y) > 1000 
    }
  }

}