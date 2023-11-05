import {
    gsap
} from "gsap";
import {
    bp
} from "./breakpoints";

// must have relative parent
export class CardEffect {
    constructor(selector) {
        this.selector = selector
        if (typeof selector !== 'string') {
            this.element = selector
        } else {
            this.element = document.querySelector(selector)
        }

        const parent = this.element.parentElement
        const zIndex = getComputedStyle(this.element).zIndex;

        parent.style.perspective = '2000px'
        parent.style.position = 'relative'
        parent.style.zIndex = zIndex

        this.element.style.transformOrigin = 'center'

        this.mouseX = 0,
            this.mouseY = 0,
            this.mouseLeaveDelay = null

        this.onMouseMove = this.handleMouseMove.bind(this)
        this.onMouseEnter = this.handleMouseEnter.bind(this)
        this.onMouseLeave = this.handleMouseLeave.bind(this)

        this.init()
    }

    cardStyle() {
        const rX = this.mouseX / this.element.offsetWidth * 15;
        const rY = this.mouseY / this.element.offsetHeight * -15;
        gsap.to(this.element, {
            duration: .3,
            rotateX: rY,
            rotateY: rX,
            z: 0,
            ease: 'cubic-bezier(0.23, 1, 0.32, 1)'
        })
    }

    clear() {
        this.mouseX = 0;
        this.mouseY = 0;
        gsap.set(this.element, {
            rotateX: 0,
            rotateY: 0,
            z: 0
        })
    }


    handleMouseMove(e) {
        if (bp.mobile.matches) return
        const {
            top,
            left,
            width,
            height
        } = this.element.getBoundingClientRect();
        this.mouseX = e.screenX - left - width / 2;
        this.mouseY = e.screenY - top - height / 2;
        this.cardStyle()
    }

    handleMouseEnter() {
        clearTimeout(this.mouseLeaveDelay);
    }

    handleMouseLeave() {
        this.mouseLeaveDelay = setTimeout(() => {
            this.mouseX = 0;
            this.mouseY = 0;
            this.cardStyle()
        }, 1000);
    }

    init() {
        this.element.addEventListener('mousemove', this.onMouseMove)
        this.element.addEventListener('mouseenter', this.onMouseEnter)
        this.element.addEventListener('mouseleave', this.onMouseLeave)
    }
}