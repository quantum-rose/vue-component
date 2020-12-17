export default class MovieClip {
    cvs = null;
    cvsCtx = null;

    frames = [];
    get framesNum() {
        return this.frames.length;
    }
    #currentIndex = -1;
    get currentIndex() {
        return this.#currentIndex;
    }
    set currentIndex(v) {
        this.#currentIndex = v;
        if (v === 0) {
            this.#onStart();
        } else if (v === this.framesNum - 1) {
            if (!this.loop) {
                this.playing = false;
            }
            this.#onEnd();
        }
    }
    get currentFrame() {
        return this.frames[this.currentIndex];
    }

    duration = 0;
    interval = 0;
    fps = 0;
    autoPlay = true;
    playing = true;
    loop = true;

    #lastTime = 0;
    #onPlay = null;
    #onPause = null;
    #onStart = null;
    #onEnd = null;

    init({ cvs, frames, duration, width, height, autoPlay, loop, onPlay, onPause, onStart, onEnd }) {
        this.cvs = cvs;
        this.cvsCtx = cvs.getContext('2d');
        this.frames = frames.map(element => {
            const $img = document.createElement('img');
            $img.src = element;
            return $img;
        });
        this.duration = duration;
        this.interval = duration / frames.length;
        this.fps = (1000 * frames.length) / duration;
        this.width = width;
        this.height = height;
        this.autoPlay = this.playing = autoPlay;
        this.loop = loop;

        this.#onPlay = onPlay;
        this.#onPause = onPause;
        this.#onStart = onStart;
        this.#onEnd = onEnd;

        this.#lastTime = Date.now();
        this.#onEnterFrame();
    }

    #onEnterFrame = () => {
        const now = Date.now();
        if (now - this.#lastTime > this.interval) {
            if (this.playing) {
                this.currentIndex = (this.currentIndex + 1) % this.framesNum;
                this.cvsCtx.clearRect(0, 0, this.width, this.height);
                this.cvsCtx.drawImage(this.currentFrame, 0, 0, this.width, this.height);
            }
            this.#lastTime = now;
        }
        requestAnimationFrame(this.#onEnterFrame);
    };

    play() {
        !this.playing && this.#onPlay();
        this.playing = true;
    }

    pause() {
        this.playing && this.#onPause();
        this.playing = false;
    }

    replay() {
        !this.playing && this.#onPlay();
        this.currentIndex = 0;
        this.playing = true;
    }
}
