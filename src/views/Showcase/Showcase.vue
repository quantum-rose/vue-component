<template>
    <div class="showcase">
        <section-01 />
        <section-02 />
    </div>
</template>

<script>
import section_01 from "./components/section-01-MovieClip";
import section_02 from "./components/section-02-ScratchCard";

export default {
    name: "Showcase",
    components: {
        "section-01": section_01,
        "section-02": section_02,
    },
};
</script>

<style lang="scss" scoped>
.showcase {
    width: 100%;
    height: auto;
}
</style>