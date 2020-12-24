class Footprint {
    cvsCtx = null;
    startX = 0;
    startY = 0;
    endX = 0;
    endY = 0;
    brush = null;
    lifetime = 0;

    constructor({ cvsCtx, startX, startY, endX, endY, brush = null, lifetime = 0 }) {
        this.cvsCtx = cvsCtx;
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        this.brush = brush;
        if (!isNaN(lifetime) && parseInt(lifetime) > 0) {
            this.lifetime = parseInt(lifetime);
        }
    }

    #startTime = Date.now();
    get remainingTime() {
        return Math.max(this.#startTime + this.lifetime - Date.now(), 0);
    }
    get destroyed() {
        return this.lifetime > 0 && this.remainingTime === 0;
    }
    #progress = 0;

    render() {
        const { cvsCtx, lifetime, remainingTime, startX, startY, endX, endY, brush } = this;
        if (lifetime > 0) {
            this.#progress = (1 - remainingTime / lifetime) ** 2;
        }
        cvsCtx.save();
        if (brush) {
            cvsCtx.globalAlpha = 1 - this.#progress;
            cvsCtx.drawImage(brush, endX - brush.width / 2, endY - brush.height / 2);
        } else {
            cvsCtx.beginPath();
            cvsCtx.strokeStyle = '#000000';
            cvsCtx.lineWidth = 50 * (1 - this.#progress);
            cvsCtx.lineCap = 'round';
            cvsCtx.moveTo(startX, startY);
            cvsCtx.lineTo(endX, endY);
            cvsCtx.stroke();
            cvsCtx.closePath();
        }
        cvsCtx.restore();
    }
}

class Scratchcard {
    cvs = null;
    cvsCtx = null;
    cover = null;
    brush = null;
    brushLifetime = 0;
    progress = 0;

    #onChange = null;

    init(cvs, { cover = null, brush = null, brushLifetime = 0, onChange = null } = {}) {
        this.cvs = cvs;
        this.cvsCtx = cvs.getContext('2d');
        this.brushLifetime = brushLifetime;

        const taskLoadCover = Scratchcard.#preloadImage(cover);
        const taskLoadBrush = Scratchcard.#preloadImage(brush);
        Promise.allSettled([taskLoadCover, taskLoadBrush]).then(result => {
            this.cover = result[0].value;
            this.brush = result[1].value;
            this.#bindMouseEvent();
            this.#bindTouchEvent();
            this.#onEnterFrame();
        });

        this.#onChange = onChange;
    }

    #footprints = [];
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
        const { left, top } = Scratchcard.#getOffset(cvs);
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
        this.#footprints.push(
            new Footprint({
                cvsCtx: this.cvsCtx,
                startX: x,
                startY: y,
                endX: lastPoint.x,
                endY: lastPoint.y,
                brush: this.brush,
                lifetime: this.brushLifetime,
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
        this.#footprints = this.#footprints.filter(item => (!item.destroyed && item.render(), !item.destroyed));
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
    };

    clear() {
        this.#footprints.length = 0;
    }

    static #preloadImage = imgUrl => {
        return new Promise(resolve => {
            if (typeof imgUrl === 'string') {
                const img = document.createElement('img');
                img.src = imgUrl;
                img.addEventListener('load', () => {
                    resolve(img);
                });
                img.addEventListener('error', () => {
                    resolve(null);
                });
            } else {
                resolve(imgUrl);
            }
        });
    };

    static #getOffset = el => {
        const { offsetLeft: left, offsetTop: top, offsetParent: parent } = el;
        if (parent) {
            const offset = Scratchcard.#getOffset(parent);
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

export default Scratchcard;
