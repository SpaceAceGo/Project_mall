<template>
    <div class="recommend">
        <div v-for="item in recommends" :key="item.index" class="recommend-item">
            <a :href="item.link">
                <img :src="item.image" alt="">
                <div>{{item.title}}</div>
            </a>
        </div>
    </div>
</template>

<script>
export default {
    name: 'RecommendView',
    props:{
        recommends:{
            type: Array,
            default() {
                return [];
            }
        }
    }
}
</script>

<style>
.recommend {
    display: flex;
    width: 100%;
    text-align: center;
    font-size: 12px;
    padding: 8px 0 10px;
    border-bottom: 10px solid #eee;
}
.recommend-item {
    flex: 1;
}
.recommend-item img {
    width: 60px;
    margin-bottom: 6px;
}

</style>
