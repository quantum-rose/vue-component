<template>
    <div class="home">
        <h1>vue-component</h1>
        <p>
            一些方便在Vue项目中使用的组件。目前已经完成的有：序列帧、刮刮卡。
            <a href="https://github.com/quantum-rose/vue-component">Github</a>，
            <a href="https://gitee.com/quantum-rose/vue-component">码云</a>。
        </p>
    </div>
</template>

<script>
export default {
    name: "Home",
};
</script>

<style lang="scss" scoped>
.home {
    padding: 15px;
    color: #2c3e50;

    h1 {
        text-align: center;
    }

    p {
        text-indent: 2em;
    }
}
</style>
