import gsap from 'gsap'
import {
    BallAnimation
} from "./canvas/articles";

export const initArticles = () => {
    const articles = document.querySelector('.articles')
    if (!articles) return
    const ballCanvas = new BallAnimation()
    const title = articles.querySelector('.articles__title')

    gsap.timeline({
        scrollTrigger: {
            trigger: articles,
            start: "top top+=25%",
            end: "bottom top",
            onEnter: () => {
                ballCanvas.init()
            },
            onLeave: () => {
                gsap.to(title, {
                    y: 100
                })
            },
            once: true
        }
    })
}