<template>
    <div class="showcase">
        <section-01 />
    </div>
</template>

<script>
import section_01 from "./components/section-01-MovieClip";

export default {
    name: "Showcase",
    components: {
        "section-01": section_01,
    },
};
</script>

<style lang="scss" scoped>
.showcase {
    width: 100%;
    height: auto;
}
</style>