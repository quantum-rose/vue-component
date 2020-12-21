class Footprint {
    cvsCtx = null;
    startX = 0;
    startY = 0;
    endX = 0;
    endY = 0;
    duration = 0;
    #startTime = 0;

    constructor({ cvsCtx, startX, startY, endX, endY, duration = 0 }) {
        this.cvsCtx = cvsCtx;
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        if (!isNaN(duration) && parseInt(duration) > 0) {
            this.duration = parseInt(duration);
        }
        this.#startTime = Date.now();
    }

    #p = 0;
    get destroyed() {
        return this.#p === 1;
    }
    render() {
        const { cvsCtx, duration, startX, startY, endX, endY } = this;
        cvsCtx.beginPath();
        cvsCtx.strokeStyle = '#000000';
        if (duration) {
            this.#p = this.#easeInQuad(Math.min((Date.now() - this.#startTime) / duration, 1));
            cvsCtx.lineWidth = 50 * (1 - this.#p) + 1;
        } else {
            cvsCtx.lineWidth = 50;
        }
        cvsCtx.lineCap = 'round';
        cvsCtx.moveTo(startX, startY);
        cvsCtx.lineTo(endX, endY);
        cvsCtx.stroke();
        cvsCtx.closePath();
    }

    #easeInQuad = x => {
        return x * x;
    };
}

class Scratchcard {
    cvs = null;
    cvsCtx = null;
    footprints = [];
    cover = null;
    progress = 0;
    completed = false;

    #onComplete = null;
    #onChange = null;

    constructor(cvs, { cover = null, brush = null, onComplete = null, onChange = null } = {}) {
        this.cvs = cvs;
        this.cvsCtx = cvs.getContext('2d');

        console.log(brush);
        if (typeof cover === 'string') {
            this.cover = document.createElement('img');
            this.cover.src = cover;
            this.cover.addEventListener('load', this.#init);
            this.cover.addEventListener('error', () => {
                this.cover = null;
                this.#init();
            });
        } else {
            this.cover = cover;
            this.#init();
        }

        this.#onComplete = onComplete;
        this.#onChange = onChange;
    }

    #init = () => {
        this.#bindMouseEvent();
        this.#bindTouchEvent();
        this.#onEnterFrame();
    };

    #pixelRatio = { x: 1, y: 1 };
    #offset = { left: 0, top: 0 };
    #lastPoint = {};
    #bindMouseEvent = () => {
        const { cvs } = this;
        cvs.addEventListener('mousedown', e => {
            this.#wipeStart(e);
            cvs.addEventListener('mousemove', this.#wiping);
        });
        cvs.addEventListener('mouseup', () => {
            cvs.removeEventListener('mousemove', this.#wiping);
        });
    };
    #bindTouchEvent = () => {
        const { cvs } = this;
        cvs.addEventListener(
            'touchstart',
            e => {
                e.preventDefault();
                e.changedTouches.forEach(item => {
                    this.#wipeStart(item);
                });
            },
            { passive: false }
        );
        cvs.addEventListener(
            'touchmove',
            e => {
                e.preventDefault();
                e.changedTouches.forEach(item => {
                    this.#wiping(item);
                });
            },
            { passive: false }
        );
    };
    #wipeStart = e => {
        const id = e.identifier || 0;
        const lastPoint = this.#lastPoint[id] || (this.#lastPoint[id] = { x: 0, y: 0 });
        const {
            cvs,
            cvs: { width, height, offsetWidth, offsetHeight },
        } = this;
        this.#pixelRatio.x = width / offsetWidth;
        this.#pixelRatio.y = height / offsetHeight;
        const { left, top } = this.#getOffset(cvs);
        this.#offset.left = left;
        this.#offset.top = top;
        const { pageX, pageY } = e;
        lastPoint.x = (pageX - left) * this.#pixelRatio.x;
        lastPoint.y = (pageY - top) * this.#pixelRatio.y;
    };
    #wiping = e => {
        const lastPoint = this.#lastPoint[e.identifier || 0];
        const { left, top } = this.#offset;
        const { x, y } = lastPoint;
        const { pageX, pageY } = e;
        lastPoint.x = (pageX - left) * this.#pixelRatio.x;
        lastPoint.y = (pageY - top) * this.#pixelRatio.y;
        this.footprints.push(
            new Footprint({
                cvsCtx: this.cvsCtx,
                startX: x,
                startY: y,
                endX: lastPoint.x,
                endY: lastPoint.y,
            })
        );
    };

    #onEnterFrame = () => {
        const {
            cvs: { width, height },
            cvsCtx,
            cover,
        } = this;
        cvsCtx.clearRect(0, 0, width, height);
        this.footprints = this.footprints.filter(item => (!item.destroyed && item.render(), !item.destroyed));
        this.#watchPixel();
        cvsCtx.save();
        cvsCtx.globalCompositeOperation = 'source-out';
        if (cover) {
            cvsCtx.drawImage(cover, 0, 0, width, height);
        } else {
            cvsCtx.fillStyle = '#808080';
            cvsCtx.fillRect(0, 0, width, height);
        }
        cvsCtx.restore();
        requestAnimationFrame(this.#onEnterFrame);
    };

    #getOffset = el => {
        const { offsetLeft: left, offsetTop: top, offsetParent: parent } = el;
        if (parent) {
            const offset = this.#getOffset(parent);
            offset.left += left;
            offset.top += top;
            return offset;
        } else {
            return {
                left,
                top,
            };
        }
    };

    #watchPixel = () => {
        const {
            cvs: { width, height },
            cvsCtx,
        } = this;
        const imageData = cvsCtx.getImageData(0, 0, width, height);
        let alpha = 0;
        for (let i = 0; i < imageData.data.length / 4; i++) {
            alpha += imageData.data[i * 4 + 3];
        }
        const p = alpha / (width * height * 255);
        if (p !== this.progress) {
            this.progress = p;
            this.#onChange(p);
        }
        if (p > 0.5 && !this.completed) {
            this.completed = true;
            this.#onComplete();
        }
    };
}

export default Scratchcard;
