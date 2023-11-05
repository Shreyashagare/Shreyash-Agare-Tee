import Matter from "matter-js";
import {
    bp
} from '../helpers/breakpoints'
import {
    gsap
} from 'gsap'
import {
    webpSupport
} from '../helpers/webpSupport'
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

const ballTextures = [{
    width: 630,
    path: '../../assets/images/awards/webby',
}, {
    width: 630,
    path: '../../assets/images/awards/san-francisco',
}, {
    width: 630,
    path: '../../assets/images/awards/awwwards',
}, {
    width: 630,
    path: '../../assets/images/awards/css',
}, {
    width: 630,
    path: '../../assets/images/awards/very-best',
}, {
    width: 630,
    path: '../../assets/images/awards/adc',
}, {
    width: 630,
    path: '../../assets/images/awards/reddot',
}];

const ballTextureWidthSm = 184

export class BallAnimation {
    constructor() {
        this.matterElem = document.querySelector('.awards__canvas')
        this.isRunning = false
        this.resizeHandler = this.onResize.bind(this)

        this.ratio = bp.mobile.matches ? window.devicePixelRatio : Math.min(1.5, window.devicePixelRatio)

        this.particlesCount = 20 * this.ratio
        this.rectWidth = 50 * this.ratio
        this.rectHeight = 10 * this.ratio

        this.ballRadius = 210 / 2 * this.ratio
        this.ballRadiusMd = 140 / 2 * this.ratio
        this.ballRadiusSm = 95 / 2 * this.ratio
        this.webp = webpSupport

        this.windowWidth = window.innerWidth

        this.width = 0
        this.height = 0

        this.balls = [];

        this.pauseTimeoutFn = this.setPauseRenderTimeoutFn.bind(this)
        this.reloadGap = 0
    }

    createWheel() {
        const circleRadius = (this.render.canvas.width + this.rectHeight) / 2

        let parts = [];
        const rectParams = {
            isStatic: true,
            render: {
                opacity: 0
            }
        }

        for (let i = 0; i <= this.particlesCount * 2; i++) {
            const angle = (i - this.particlesCount) / this.particlesCount * (Math.PI / 2 * 1.01)
            const x = Math.sin(angle) * circleRadius + circleRadius - this.rectHeight / 2
            const y = Math.cos(angle) * circleRadius + this.height - circleRadius + this.rectHeight / 2

            const rect = Bodies.rectangle(x, y, this.rectWidth, this.rectHeight, {
                isStatic: true,
                angle: -angle,
                slop: 0,
                render: {
                    opacity: 0
                }
            })
            parts.push(rect);
        }

        const wallRight = Bodies.rectangle(this.width + this.rectWidth / 2, 0, this.rectWidth, this.height, rectParams)
        const wallLeft = Bodies.rectangle(-this.rectWidth / 2, 0, this.rectWidth, this.height, rectParams)
        parts.push(wallLeft);
        parts.push(wallRight);

        this.wheel = Body.create({
            parts,
            isStatic: true
        });

        Composite.add(this.engine.world, this.wheel);
    }

    createBall() {
        let ballRadius = 0
        if (bp.mobile.matches) {
            ballRadius = this.ballRadiusSm
        } else if (bp.tablet.matches || window.innerWidth < 1280) {
            ballRadius = this.ballRadiusMd
        } else {
            ballRadius = this.ballRadius
        }


        ballTextures.forEach((item, i) => {

            const texturePath = bp.mobile.matches ? item.path + '-sm' : item.path
            const texture = this.webp ? texturePath + '.webp' : texturePath + '.png'
            const textureWidth = bp.mobile.matches ? ballTextureWidthSm : item.width
            const textureScale = ballRadius * 2 / textureWidth / 100 * 99
            if (i < 4) {
                const ball = Bodies.circle(this.width - ballRadius - 50, this.height / 2 - ballRadius - ballRadius * 2 * (i + 1), ballRadius, {
                    isStatic: true,
                    restitution: 0,
                    slop: 0,
                    frictionStatic: .5,
                    density: 10,
                    render: {
                        opacity: 0,
                        sprite: {
                            texture: texture,
                            xScale: textureScale,
                            yScale: textureScale
                        },
                    },
                    friction: 0.08,
                    frictionAir: bp.mobile.matches ? 0.04 + Math.random() * 0.01 : 0.01
                })
                this.balls.push(ball)
            } else {
                const ball = Bodies.circle(this.width - ballRadius * 2 - 50, this.height / 2 - ballRadius - ballRadius * 2 * (i + 1 - 3), ballRadius, {
                    isStatic: true,
                    restitution: 0,
                    slop: 0,
                    frictionStatic: .5,
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
            }
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
                isStatic: true,
                mass: 0,
                render: {
                    opacity: 0
                }
            })
        Composite.add(this.engine.world, this.cursorBody)
    }

    onResize(orientationChange) {
        if (this.windowWidth === window.innerWidth && !orientationChange) return
        this.windowWidth = window.innerWidth
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
        this.reloadGap = 1

        Composite.remove(this.engine.world, this.wheel);
        Composite.remove(this.engine.world, this.balls);
        this.balls = []

        this.createWheel()
        this.createBall()
        this.runBall()
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
                if (!ball.fromOpacity && ball.position.y > this.height / 2) {
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
        this.engine.gravity.y = 5

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