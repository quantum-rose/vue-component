<template>
    <section class="movie-clip">
        <div class="event-light-group">
            <EventLight
                class="event-light"
                ref="movieClipPlay"
                eventName="play"
            />
            <EventLight
                class="event-light"
                ref="movieClipPause"
                eventName="pause"
            />
            <EventLight
                class="event-light"
                ref="movieClipStart"
                eventName="start"
            />
            <EventLight
                class="event-light"
                ref="movieClipEnd"
                eventName="end"
            />
        </div>
        <MovieClip
            class="demo"
            ref="MovieClip"
            :frames="frames"
            :duration="1000"
            :width="516"
            :height="118"
            :autoPlay="true"
            :loop="true"
            @play="$refs.movieClipPlay.flash()"
            @pause="$refs.movieClipPause.flash()"
            @start="$refs.movieClipStart.flash()"
            @end="$refs.movieClipEnd.flash()"
        />
        <div class="button-group">
            <button class="btn" @click="$refs.MovieClip.play()">Play</button>
            <button class="btn" @click="$refs.MovieClip.pause()">Pause</button>
            <button class="btn" @click="$refs.MovieClip.replay()">
                Replay
            </button>
        </div>
    </section>
</template>

<script>
import MovieClip from "@/components/MovieClip/MovieClip.vue";
import EventLight from "@/components/EventLight/EventLight.vue";

export default {
    name: "section-01-MovieClip",
    components: {
        MovieClip,
        EventLight,
    },
    data() {
        const frames = [];
        for (let i = 0; i < 12; i++) {
            frames[
                i
            ] = require(`@/assets/movieclip/p5-pop-img-btn_${i
                .toString()
                .padStart(2, "0")}.png`);
        }

        return {
            frames,
        };
    },
};
</script>

<style lang="scss" scoped>
.movie-clip {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: auto;
    padding: 15px;
    background-color: hsl(39, 28%, 77%);

    .event-light {
        margin-left: 2px;
        margin-right: 2px;
    }

    .demo {
        max-width: 100%;
    }

    .btn {
        margin-left: 2px;
        margin-right: 2px;
    }
}
</style>