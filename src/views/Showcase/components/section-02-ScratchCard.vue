<template>
    <section class="scratch-card">
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
            <ScratchCard
                class="demo"
                :width="850"
                :height="456"
                :cover="cover"
            />
        </div>
    </section>
</template>

<script>
import ScratchCard from "@/components/ScratchCard/ScratchCard.vue";

export default {
    name: "w",
    components: {
        ScratchCard,
    },
    data() {
        return {
            cover: require("@/assets/scratchcard/bg.jpg"),
        };
    },
};
</script>

<style lang="scss" scoped>
.scratch-card {
    width: auto;
    height: auto;
    padding: 15px;
    text-align: center;

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
}
</style>