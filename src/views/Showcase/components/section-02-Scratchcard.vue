<template>
    <section class="scratch-card">
        <div class="event-light-group">
            <EventLight
                class="event-light"
                ref="change"
                event="change"
                :value="progress"
            />
        </div>
        <div class="card">
            <div class="content">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Nesciunt officiis quisquam voluptatum at earum repellat quae,
                fugit temporibus esse placeat fugiat quidem reiciendis quos ea
                in. Totam eos itaque veritatis? Lorem ipsum dolor sit amet
                consectetur adipisicing elit. Cumque culpa magni soluta
                voluptatem ex blanditiis suscipit architecto eaque velit? Velit,
                porro quasi! Earum sint ab possimus numquam explicabo,
                voluptatibus ad! Lorem ipsum dolor sit amet consectetur
                adipisicing elit. Eius, eligendi! Tempora corporis quidem illum
                laudantium, quibusdam ratione quam? Odit, nesciunt accusamus
                cupiditate voluptates ducimus obcaecati at impedit maxime
                assumenda libero! Lorem ipsum, dolor sit amet consectetur
                adipisicing elit. Quasi reprehenderit debitis repudiandae eos.
                Eveniet cupiditate illum, odit tenetur cum culpa vitae corporis,
                mollitia quam reiciendis placeat at expedita facilis nihil.
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Illo
                veritatis error eveniet ea autem iure maiores omnis ipsam in
                magnam, libero odit quasi quos adipisci? Natus at aperiam
                temporibus fuga!
            </div>
            <Scratchcard
                class="demo"
                ref="Scratchcard"
                :width="850"
                :height="456"
                :cover="cover"
                @change="handleChange"
            />
        </div>
        <div class="btn-group">
            <button class="btn" @click="$refs.Scratchcard.clear()">
                Clear
            </button>
        </div>
    </section>
</template>

<script>
import Scratchcard from "@/components/Scratchcard/Scratchcard.vue";
import EventLight from "@/components/EventLight/EventLight.vue";

export default {
    name: "section-02-Scratchcard",
    components: {
        Scratchcard,
        EventLight,
    },
    data() {
        return {
            cover: require("@/assets/scratchcard/cover.jpg"),
            brush: require("@/assets/scratchcard/brush.png"),
            progress: "0.000000",
        };
    },
    methods: {
        handleChange(e) {
            this.progress = e.progress.toFixed(6);
            this.$refs.change.flash();
        },
    },
};
</script>

<style lang="scss" scoped>
.scratch-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: auto;
    height: auto;
    padding: 15px;
    text-align: center;
    background-color: #eeeeee;

    .event-light-group {
        margin-bottom: 10px;

        .event-light {
            margin-left: 2px;
            margin-right: 2px;
        }
    }

    .card {
        position: relative;
        top: 0;
        left: 0;
        display: inline-block;
        width: auto;
        height: auto;
        font-size: 0;

        .content {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            font-size: 3vw;
            text-align: justify;
            user-select: none;
        }

        .demo {
            position: relative;
            top: 0;
            left: 0;
            max-width: 100%;
        }
    }

    .btn-group::before {
        content: "";
        display: block;
        width: 100%;
        height: 10px;
    }

    .btn {
        margin-left: 2px;
        margin-right: 2px;
    }
}
</style>