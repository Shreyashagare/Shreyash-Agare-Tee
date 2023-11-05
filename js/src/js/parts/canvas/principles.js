import Matter from "matter-js";
import {
    bp
} from '../helpers/breakpoints'
import {
    onResizeAndOrientation
} from "../helpers/resize";

const {
    Engine,
    Render,
    Runner,
    Bodies,
    Body,
    Composite,
    Events,
    Mouse
} = Matter

export class BallAnimation {
    constructor() {
        this.matterElem = document.querySelector('.principles__ball')
        this.isRunning = false
        this.resizeHandler = this.onResize.bind(this)

        this.ratio = bp.mobile.matches ? window.devicePixelRatio : Math.min(1.5, window.devicePixelRatio)

        this.particlesCount = 50 * this.ratio
        this.rectWidth = 60
        this.rectHeight = 10

        this.ballRadius = 80 * this.ratio
        this.ballRadiusSm = 50 * this.ratio

        this.width = 0
        this.height = 0
        this.windowWidth = window.innerWidth

        this.pauseTimeoutFn = this.setPauseRenderTimeoutFn.bind(this)

        this.ballTexture = {
            width: 320,
            path: '../../assets/images/ball-texture-sm.png'
        }
    }

    createWheel() {
        const circleRadius = (this.render.canvas.width + this.rectHeight) / 2

        let parts = [];

        for (let i = 0; i <= this.particlesCount * 2; i++) {
            const angle = (i - this.particlesCount) / this.particlesCount * (Math.PI / 2)
            const x = Math.sin(angle) * circleRadius + circleRadius - this.rectHeight / 2
            const y = Math.cos(angle) * circleRadius + this.height - circleRadius + this.rectHeight / 2

            const rect = Bodies.rectangle(x, y, this.rectWidth, this.rectHeight, {
                isStatic: true,
                angle: -angle,
                render: {
                    opacity: 0
                }
            })
            parts.push(rect);
        }

        this.wheel = Body.create({
            parts,
            isStatic: true
        });

        Composite.add(this.engine.world, this.wheel);
    }

    createBall() {
        const r = bp.mobile.matches ? this.ballRadiusSm : this.ballRadius
        const x = this.width - r
        const y = -r

        const textureScale = r * 2 / this.ballTexture.width

        this.ball = Bodies.circle(x, y, r, {
            isStatic: true,
            restitution: .05,
            frictionStatic: 1,
            friction: 1,
            frictionAir: bp.mobile.matches ? 0.02 : 0.002,
            render: {
                sprite: {
                    texture: this.ballTexture.path,
                    xScale: textureScale,
                    yScale: textureScale
                }
            }
        })

        Composite.add(this.engine.world, this.ball)
    }

    addCursorBody() {
        this.cursorBody = Bodies.circle(
            this.render.options.width / 2,
            this.render.options.height / 2,
            1, {
                isStatic: true,
                render: {
                    opacity: 0
                }
            })
        Composite.add(this.engine.world, this.cursorBody)
    }

    runBall() {
        Body.setStatic(this.ball, false)
    }
    setPauseRenderTimeoutFn() {
        Render.stop(this.render)
        this.isPaused = true
    }

    pause() {
        this.pauseTimeout = setTimeout(this.pauseTimeoutFn, 5000)
    }
    resume() {
        if (this.pauseTimeout) {
            clearTimeout(this.pauseTimeout)
            this.pauseTimeout = null
        }
        if (this.isPaused) {
            Render.run(this.render)
            this.isPaused = false
            return
        }
    }
    clear() {
        Render.stop(this.render)
        Engine.clear(this.engine)
        this.render.canvas.remove()
        this.render.canvas = null
        this.render.context = null
        this.render.textures = {}
        this.isRunning = false

        window.removeEventListener('resize', this.resizeHandler)
    }

    onResize(orientationChange) {
        if (this.windowWidth === window.innerWidth && !orientationChange) return
        this.ratio = bp.mobile.matches ? window.devicePixelRatio : Math.min(1.5, window.devicePixelRatio)
        this.width = this.matterElem.clientWidth * this.ratio
        this.height = this.matterElem.clientHeight * this.ratio
        this.render.canvas.width = this.width
        this.render.canvas.height = this.height
        this.render.bounds.max.x = this.width
        this.render.bounds.max.y = this.height
        this.render.options.width = this.width
        this.render.options.height = this.height


        Composite.remove(this.engine.world, this.wheel);
        Composite.remove(this.engine.world, this.ball);

        this.createWheel()
        this.createBall()
        this.runBall()
    }

    eventListeners() {
        Events.on(this.engine, 'afterUpdate', () => {
            if (!this.mouse.position ? .x) {
                return;
            }
            Body.translate(this.cursorBody, {
                x: (this.mouse.position.x - this.cursorBody.position.x) * 0.25,
                y: (this.mouse.position.y - this.cursorBody.position.y) * 0.25
            });
        });
        onResizeAndOrientation(
            () => {
                this.resizeHandler(true)
            },
            () => {
                this.resizeHandler()
            }
        )

        this.mouse.element.removeEventListener('touchmove', this.mouse.mousemove);
        this.mouse.element.removeEventListener('touchstart', this.mouse.mousedown);
        this.mouse.element.removeEventListener('touchend', this.mouse.mouseup);
        this.mouse.element.removeEventListener("mousewheel", this.mouse.mousewheel);
        this.mouse.element.removeEventListener("DOMMouseScroll", this.mouse.mousewheel);
    }

    init() {
        if (this.isRunning) return this.onResize()
        this.width = this.matterElem.clientWidth * this.ratio
        this.height = this.matterElem.clientHeight * this.ratio

        this.engine = Engine.create()
        this.render = Render.create({
            element: this.matterElem,
            engine: this.engine,
            options: {
                wireframes: false,
                background: 'none'
            }
        })

        this.render.canvas.width = this.width
        this.render.canvas.height = this.height
        this.engine.gravity.y = 10
        this.mouse = Mouse.create(this.render.canvas)
        this.render.mouse = this.mouse

        this.createWheel()
        this.createBall()
        this.addCursorBody()

        Render.run(this.render)
        this.runner = Runner.create()
        Runner.run(this.runner, this.engine)
        this.isRunning = true

        this.eventListeners()
        this.runBall()
    }


}