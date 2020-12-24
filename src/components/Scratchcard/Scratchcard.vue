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
        brush: {
            type: String,
            default: "",
        },
        brushLifetime: {
            type: Number,
            default: 0,
        },
    },
    data() {
        return {
            Scratchcard: new Scratchcard(),
        };
    },
    mounted() {
        this.Scratchcard.init(this.$refs.cvs, {
            cover: this.cover,
            brush: this.brush,
            brushLifetime: this.brushLifetime,
            onComplete: () => {
                this.$emit("complete", {});
            },
            onChange: () => {
                this.$emit("change", {});
            },
        });
    },
    methods:{
        clear(){
            this.Scratchcard.clear()
        }
    }
};
</script>

<style lang="scss" scoped>
</style>