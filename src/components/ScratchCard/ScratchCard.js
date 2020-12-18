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

class ScratchCard {
    cvs = null;
    cvsCtx = null;
    footPrint = [];
    cover = null;

    constructor(cvs, img) {
        this.cvs = cvs;
        this.cvsCtx = cvs.getContext('2d');

        this.cover = document.createElement('img');
        this.cover.src = img;
        this.cover.addEventListener('load', this.#onLoad);
    }

    #onLoad = () => {
        this.#bindMouseEvent();
        this.#bindTouchEvent();
        this.#onEnterFrame();
    };

    #pixelRatio = { x: 1, y: 1 };
    #offset = { left: 0, top: 0 };
    #lastPoint = { x: 0, y: 0 };
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
        cvs.addEventListener('touchstart', e => {
            e.changedTouches.forEach(item => {
                this.#wipeStart(item);
            });
        });
        cvs.addEventListener('touchmove', e => {
            e.preventDefault();
            e.changedTouches.forEach(item => {
                this.#wiping(item);
            });
        });
    };
    #wipeStart = e => {
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
        this.#lastPoint.x = (pageX - left) * this.#pixelRatio.x;
        this.#lastPoint.y = (pageY - top) * this.#pixelRatio.y;
    };
    #wiping = e => {
        const { left, top } = this.#offset;
        const { x, y } = this.#lastPoint;
        const { pageX, pageY } = e;
        this.#lastPoint.x = (pageX - left) * this.#pixelRatio.x;
        this.#lastPoint.y = (pageY - top) * this.#pixelRatio.y;
        this.footPrint.push(
            new Footprint({
                cvsCtx: this.cvsCtx,
                startX: x,
                startY: y,
                endX: this.#lastPoint.x,
                endY: this.#lastPoint.y,
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
        this.footPrint = this.footPrint.filter(item => (!item.destroyed && item.render(), !item.destroyed));
        cvsCtx.save();
        cvsCtx.globalCompositeOperation = 'source-out';
        cvsCtx.drawImage(cover, 0, 0, width, height);
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
}

export default ScratchCard;
