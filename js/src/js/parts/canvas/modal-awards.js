import Matter from "matter-js";
import {
    bp
} from '../helpers/breakpoints'
import {
    gsap
} from 'gsap'
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
    constructor(selector, textures) {
        this.textures = textures
        this.matterElem = document.querySelector(selector)
        this.isRunning = false
        this.resizeHandler = this.onResize.bind(this)
        this.reloadGap = 2

        this.ratio = bp.mobile.matches ? window.devicePixelRatio : Math.min(1.5, window.devicePixelRatio)

        this.particlesCount = 20 * this.ratio
        this.rectWidth = 50 * this.ratio
        this.rectHeight = 20 * this.ratio

        this.ballRadius = 210 / 2 * this.ratio
        this.ballRadiusMd = 140 / 2 * this.ratio
        this.ballRadiusSm = 95 / 2 * this.ratio

        this.windowWidth = window.innerWidth

        this.width = 0
        this.height = 0

        this.balls = [];

        this.pauseTimeoutFn = this.setPauseRenderTimeoutFn.bind(this)

    }

    createWheel() {
        const desktopBallRadius = bp.mobile.matches || bp.tablet.matches ? 180 / 2 * this.ratio : 200 / 2 * this.ratio

        const staticProps = {
            isStatic: true,
            slop: 0,
            render: {
                opacity: 0
            }
        }

        const rectBottom = Bodies.rectangle(this.width / 2, this.height + this.rectHeight / 2 - 20 * this.ratio, this.width, this.rectHeight, staticProps)
        const rectRight = Bodies.rectangle(this.width + this.rectHeight / 2, this.height / 2, this.rectHeight, this.height, staticProps)
        const rectLeft = Bodies.rectangle(-this.rectWidth / 2, this.height / 2, this.rectWidth, this.height, staticProps)
        const buttonBall = Bodies.circle(this.width - desktopBallRadius - 5 * this.ratio, this.height - desktopBallRadius - 18 * this.ratio, desktopBallRadius + 4, staticProps)

        this.wheel = Body.create({
            parts: [rectBottom, rectRight, rectLeft, buttonBall],
            isStatic: true,
            restitution: 1
        });

        Composite.add(this.engine.world, this.wheel);
    }

    createBall() {

        this.textures.forEach((item, i) => {
            const mobileScale = 1.4
            const texture = item.path
            const ballRadius = bp.mobile.matches ? item.desktopWidth / 2 / mobileScale * this.ratio : item.desktopWidth / 2 * this.ratio
            const textureWidth = item.width
            const textureScale = bp.mobile.matches ? ballRadius / textureWidth / 100 * 99 * 2 : ballRadius / textureWidth / 100 * 99 * 2

            const ball = Bodies.circle(this.width - ballRadius * 2 - 50, this.height / 2 - ballRadius - ballRadius * 2 * (i + 1 - 3), ballRadius, {
                isStatic: true,
                restitution: .1,
                frictionStatic: .5,
                slop: 0,
                density: 10,
                render: {
                    opacity: 0,
                    sprite: {
                        texture: texture,
                        xScale: textureScale,
                        yScale: textureScale
                    },
                },
                frictionAir: bp.mobile.matches ? 0.04 + Math.random() * 0.01 : 0.01
            })
            this.balls.push(ball)
        })

        Composite.add(this.engine.world, this.balls)

    }


    runBall() {
        this.balls.forEach((ball, i) => {
            Body.setStatic(ball, false)
        })

    }

    addCursorBody() {
        this.cursorBody = Bodies.circle(
            this.render.options.width / 2,
            this.render.options.height / 2,
            1, {
                slop: 0,
                isStatic: true,
                render: {
                    opacity: 0
                }
            })
        Composite.add(this.engine.world, this.cursorBody)
    }

    onResize(orientationChange) {
        if (this.windowWidth === window.innerWidth && !orientationChange) return
        Composite.remove(this.engine.world, this.wheel);
        Composite.remove(this.engine.world, this.balls);
        clearTimeout(this.resizeTimeout)

        this.resizeTimeout = setTimeout(() => {


            this.ratio = bp.mobile.matches ? window.devicePixelRatio : Math.min(1.5, window.devicePixelRatio)
            this.ballRadius = 210 / 2 * this.ratio
            this.ballRadiusMd = 140 / 2 * this.ratio
            this.ballRadiusSm = 95 / 2 * this.ratio

            this.width = this.matterElem.clientWidth * this.ratio
            this.height = this.matterElem.clientHeight * this.ratio
            this.render.canvas.width = this.width
            this.render.canvas.height = this.height
            this.render.bounds.max.x = this.width
            this.render.bounds.max.y = this.height
            this.render.options.width = this.width
            this.render.options.height = this.height
            Composite.remove(this.engine.world, this.wheel);
            Composite.remove(this.engine.world, this.balls);

            this.balls = []

            this.createWheel()
            this.createBall()
            this.runBall()
        }, this.reloadGap * 1000)

    }

    eventListeners() {
        onResizeAndOrientation(
            () => {
                this.resizeHandler(true)
            },
            () => {
                this.resizeHandler()
            }
        )

        Events.on(this.engine, 'afterUpdate', () => {
            this.balls.forEach(ball => {
                if (!ball.fromOpacity && ball.position.y > this.height / 3) {
                    gsap.to(ball.render, {
                        opacity: 1,
                        duration: .3,
                        overwrite: false,
                        ease: 'power1.out'
                    })
                    ball.fromOpacity = true
                }
            })

            if (!this.mouse.position ? .x) {
                return;
            }
            Body.translate(this.cursorBody, {
                x: (this.mouse.position.x - this.cursorBody.position.x) * 0.25,
                y: (this.mouse.position.y - this.cursorBody.position.y) * 0.25
            });
        });

        this.mouse.element.removeEventListener('touchmove', this.mouse.mousemove);
        this.mouse.element.removeEventListener('touchstart', this.mouse.mousedown);
        this.mouse.element.removeEventListener('touchend', this.mouse.mouseup);
        this.mouse.element.removeEventListener("mousewheel", this.mouse.mousewheel);
        this.mouse.element.removeEventListener("DOMMouseScroll", this.mouse.mousewheel);
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


    init() {
        if (this.isRunning) return this.onResize()
        this.width = this.matterElem.clientWidth * this.ratio
        this.height = this.matterElem.clientHeight * this.ratio

        this.engine = Engine.create()
        this.engine.gravity.y = 2

        this.render = Render.create({
            element: this.matterElem,
            engine: this.engine,
            options: {
                wireframes: false,
                background: 'none',
            }
        })

        this.render.canvas.width = this.width
        this.render.canvas.height = this.height
        this.mouse = Mouse.create(this.render.canvas)
        this.render.mouse = this.mouse
        this.isPaused = false

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