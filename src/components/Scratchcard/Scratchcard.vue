<template>
    <canvas ref="cvs" id="cvs" :width="width" :height="height"></canvas>
</template>

<script>
import Scratchcard from "./Scratchcard";

export default {
    name: "Scratchcard",
    props: {
        width: {
            type: Number,
            required: true,
        },
        height: {
            type: Number,
            required: true,
        },
        cover: {
            type: String,
            default: "",
        },
    },
    mounted() {
        new Scratchcard(this.$refs.cvs, this.cover);
    },
};
</script>

<style lang="scss" scoped>
</style>