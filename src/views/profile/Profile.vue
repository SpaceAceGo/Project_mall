<template>
    <div id="profile">
        <nav-bar class="profile-bar">
            <div slot="center">个人中心</div>
        </nav-bar>
    </div>
</template>

<script>
import Scroll from 'components/common/scroll/Scroll'
import NavBar from '@/components/common/navbar/NavBar';

export default {
    name:'Profile',
    components: {
        NavBar,
        Scroll
    }
}
</script>

<style scoped>
.profile-bar {
    background: var(--color-tint);
    color: #fff;
}
</style>