<template>
    <canvas ref="cvs" id="cvs" :width="width" :height="height"></canvas>
</template>

<script>
import ScratchCard from "./ScratchCard";

export default {
    name: "ScratchCard",
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
        new ScratchCard(this.$refs.cvs, this.cover);
    },
};
</script>

<style lang="scss" scoped>
</style>