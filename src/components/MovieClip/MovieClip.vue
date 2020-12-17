<template>
    <canvas ref="cvs" :width="width" :height="height"></canvas>
</template>

<script>
import MovieClip from "./MovieClip";

export default {
    name: "MovieClip",
    props: {
        frames: {
            type: Array,
            required: true,
        },
        duration: {
            type: Number,
            required: true,
        },
        width: {
            type: Number,
            required: true,
        },
        height: {
            type: Number,
            required: true,
        },
        autoPlay: {
            type: Boolean,
            default: true,
        },
        loop: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            movieClip: new MovieClip(),
        };
    },
    mounted() {
        const {
            $refs: { cvs },
            frames,
            duration,
            width,
            height,
            autoPlay,
            loop,
        } = this;
        this.movieClip.init({
            cvs,
            frames,
            duration,
            width,
            height,
            autoPlay,
            loop,
            onPlay: () => {
                this.$emit("play", null);
            },
            onPause: () => {
                this.$emit("pause", null);
            },
            onStart: () => {
                this.$emit("start", null);
            },
            onEnd: () => {
                this.$emit("end", null);
            },
        });
    },
    methods: {
        play() {
            this.movieClip.play();
        },

        pause() {
            this.movieClip.pause();
        },

        replay() {
            this.movieClip.replay();
        },
    },
};
</script>