<template>
    <div
        class="event-light"
        :style="{ '--color': color, '--alpha': alpha }"
        v-text="eventName"
    ></div>
</template>

<script>
export default {
    name: "EventLight",
    props: {
        eventName: {
            type: String,
            required: true,
        },
        color: {
            type: String,
            default: "rgba(255,0,0,1)",
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
    --color: rgba(255, 0, 0, 1);
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
        background-color: var(--color);
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
}
</style>