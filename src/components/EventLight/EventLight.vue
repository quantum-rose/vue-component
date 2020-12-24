<template>
    <div class="event-light" :style="{ '--alpha': alpha }">
        <div class="event-name" v-text="event"></div>
        <div class="event-value" v-text="value"></div>
    </div>
</template>

<script>
export default {
    name: "EventLight",
    props: {
        event: {
            type: String,
            required: true,
        },
        value: {
            type: String,
            default: "",
        },
    },
    data() {
        return {
            p: 1,
            t: 0,
        };
    },
    computed: {
        alpha() {
            return this.p ** 3 * 0.75;
        },
    },
    mounted() {
        this.onEnterFrame();
    },
    methods: {
        flash() {
            this.p = 0;
        },
        onEnterFrame() {
            const now = Date.now();
            if (now - this.t > 16) {
                this.t = now;
                if (this.p < 1) {
                    this.p += 0.03125;
                }
            }
            requestAnimationFrame(this.onEnterFrame);
        },
    },
};
</script>

<style lang="scss" scoped>
.event-light {
    --alpha: 0.7;

    position: relative;
    top: 0;
    left: 0;
    width: auto;
    height: 12px;
    display: inline-flex;
    align-items: center;
    font-size: 12px;
    line-height: 1;
    color: #000000;

    &::before {
        content: "";
        margin-right: 2px;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background-color: rgba(255, 0, 0, 1);
    }

    &::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background-color: #000000;
        opacity: var(--alpha);
    }

    .event-name {
        margin-right: 2px;
    }

    .event-value {
        color: rgba(0, 110, 255, 1);
    }
}
</style>