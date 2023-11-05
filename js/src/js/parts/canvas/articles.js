import gsap from "gsap";
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
    Composite
} = Matter

export class BallAnimation {
    constructor() {
        this.matterElem = document.querySelector('.articles__canvas')
        this.isRunning = false
        this.resizeHandler = this.onResize.bind(this)

        this.ballRadius = 80

        this.width = 0
        this.height = 0
        this.windowWidth = window.innerWidth

        this.ballTexture = {
            width: 320,
            path: '../../assets/images/ball-texture-sm.png'
        }
    }

    createRects() {
        const elemRect = this.matterElem.getBoundingClientRect()
        const books = [...document.querySelectorAll('.book')]
        const book1 = books[0]
        const book2 = books[1]

        const bookRect1 = book1.getBoundingClientRect()
        const bookRect2 = book2.getBoundingClientRect()

        const x1 = bookRect1.x + bookRect1.width / 2
        const y1 = bookRect1.y - elemRect.y + bookRect1.height / 2
        const w1 = book1.offsetWidth
        const h1 = book1.offsetHeight
        const a1 = -2.5 / 100 * (Math.PI / 2)

        const x2 = bookRect2.x + bookRect2.width / 2
        const y2 = bookRect2.y - elemRect.y + bookRect2.height / 2
        const w2 = book2.offsetWidth
        const h2 = book2.offsetHeight
        const a2 = -0.33 / 100 * (Math.PI / 2)

        const rect1 = Bodies.rectangle(x1, y1, w1, h1, {
            isStatic: true,
            angle: a1,
            render: {
                opacity: 0
            }
        })

        const rect2 = Bodies.rectangle(x2, y2, w2, h2, {
            isStatic: true,
            angle: a2,
            render: {
                opacity: 0
            }
        })

        this.rects = [rect1, rect2]

        Composite.add(this.engine.world, this.rects)

    }

    createBall() {
        this.ballRadius = bp.mobile.matches ? 50 : 80

        const textureScale = this.ballRadius * 2 / this.ballTexture.width
        const firstBookRect = document.querySelector('.book').getBoundingClientRect()
        const x = firstBookRect.x + firstBookRect.width - 100 - this.ballRadius

        this.ball = Bodies.circle(x, -200, this.ballRadius, {
            isStatic: true,
            mass: .1,
            restitution: 0.1,
            frictionStatic: 1,
            render: {
                sprite: {
                    texture: this.ballTexture.path,
                    xScale: textureScale,
                    yScale: textureScale
                }
            }
        })
        this.ball.friction = 10;
        this.ball.frictionAir = 0.005;
        Composite.add(this.engine.world, this.ball)
    }

    runBall() {
        this.onResize()
    }

    onResize(orientationChange) {
        if (!this.isRunning || !this.matterElem) return
        if (this.windowWidth === window.innerWidth && !orientationChange) return

        this.width = this.matterElem.clientWidth
        this.height = this.matterElem.clientHeight
        this.render.canvas.width = this.width
        this.render.canvas.height = this.height
        this.render.bounds.max.x = this.width
        this.render.bounds.max.y = this.height
        this.render.options.width = this.width
        this.render.options.height = this.height

        Composite.remove(this.engine.world, this.ball);
        Composite.remove(this.engine.world, this.rects)

        this.createRects()
        this.createBall()
        Body.setStatic(this.ball, false)
    }

    onMouseEnter() {
        if (this.rects[0].angle === 2 / 180 * (Math.PI / 2)) return
        this.engine.gravity.x = 0.7

        const rect = this.rects[0]
        const state = { ...this.rects[0]
        }
        gsap.to(state, {
            angle: 5 / 180 * (Math.PI / 2),
            onUpdate: function() {
                const val = gsap.getProperty(this.targets()[0], "angle")
                Body.setAngle(rect, val)
            },
            delay: 0.1,
            duration: 0.3
        })
    }
    onMouseOut() {
        if (this.rects[0].angle === -2 / 180 * (Math.PI / 2)) return
        this.engine.gravity.x = -0.7

        const rect = this.rects[0]
        const state = { ...rect
        }
        gsap.to(state, {
            angle: -5 / 180 * (Math.PI / 2),
            onUpdate: function() {
                const val = gsap.getProperty(this.targets()[0], "angle")
                Body.setAngle(rect, val)
            },
            delay: 0.1,
            duration: 0.3
        })
    }

    eventListeners() {
        const firstBook = document.querySelector('.book')

        onResizeAndOrientation(
            () => {
                this.resizeHandler(true)
            },
            () => {
                this.resizeHandler()
            }
        )

        firstBook.addEventListener('mouseenter', this.onMouseEnter.bind(this))
        firstBook.addEventListener('mouseleave', this.onMouseOut.bind(this))

    }

    pause() {
        Render.stop(this.render)
    }
    resume() {
        Render.run(this.render, this.engine)
    }
    clear() {
        if (!this.isRunning) return
        if (this.startTimeout) clearTimeout(this.startTimeout)
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
        if (this.isRunning) return
        this.width = this.matterElem.clientWidth
        this.height = this.matterElem.clientHeight

        this.engine = Engine.create()
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
        this.engine.gravity.y = 15
        this.engine.gravity.x = -0.5

        this.createRects()
        this.createBall()

        setTimeout(() => {
            Render.run(this.render)
            this.runner = Runner.create()
            Runner.run(this.runner, this.engine)
            this.isRunning = true
            this.eventListeners()
            Body.setStatic(this.ball, false)
        }, 100)


        setTimeout(() => {
            this.clear()
        }, 60000)


    }


}