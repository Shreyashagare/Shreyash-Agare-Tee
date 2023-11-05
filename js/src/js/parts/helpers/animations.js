import {
    gsap
} from "gsap";
import {
    SplitText
} from "gsap/SplitText";
import {
    ScrollTrigger
} from "gsap/ScrollTrigger"

const mm = gsap.matchMedia()

export const textBlockAppear = () => {

    mm.add("(min-width: 768px)", () => {
        const showUpElements = gsap.utils.toArray('.show-up-animation')
        gsap.set(showUpElements, {
            y: 80,
            opacity: 0,
            immediateRender: true
        })

        const animation = ScrollTrigger.batch(showUpElements, {
            onEnter: (elements) => {
                gsap.fromTo(elements, {
                    opacity: 0,
                    y: 80
                }, {
                    opacity: 1,
                    y: 0,
                    stagger: 0.25,
                    duration: 1.4,
                    ease: 'power4.inOut'
                });
            },
            interval: 0.1,
            start: "20px bottom",
            batchMax: 1,
            once: true,

        });

        return () => {
            animation.forEach(st => st.kill());
            gsap.set(showUpElements, {
                y: 0,
                opacity: 1,
                immediateRender: true
            })
        }
    });

}

export const titleAppear = () => {

    mm.add("(min-width: 768px)", () => {
        const titles = gsap.utils.toArray('.title-animation')
        titles.forEach(title => {
            title.split = new SplitText(title, {
                type: "chars, words",
                charsClass: "split-char",
                wordsClass: "split-word"
            });
        })
        const chars = gsap.utils.toArray('.split-char')
        const exceptions = document.querySelector('.title-animation .introduction__also.introduction__also--mobile')


        gsap.set(chars, {
            yPercent: 150,
            rotation: 45,
        })

        gsap.set(exceptions, {
            yPercent: 10,
            opacity: 0
        })

        const animation = ScrollTrigger.batch(titles, {
            onEnter: (batch) => {
                const chars = gsap.utils.toArray('.split-char', batch[0])
                gsap.fromTo(chars, {
                    yPercent: 150,
                    rotation: 45,
                }, {
                    duration: 0.3,
                    ease: "circ.out",
                    yPercent: 0,
                    rotation: 0,
                    stagger: 0.03,
                })
                if (batch[0].querySelector('.title-animation .introduction__also.introduction__also--mobile')) {
                    gsap.fromTo(exceptions, {
                        y: 10,
                        opacity: 0
                    }, {
                        y: 0,
                        delay: 2,
                        ease: "circ.out",
                        yPercent: 0,
                        opacity: 1,
                        duration: 1.4
                    })
                }
            },
            interval: 0.1,
            start: "top 80%",
            batchMax: 1,
            once: true
        });

        return () => {
            titles.forEach(title => {
                title.split.revert()
            })

            gsap.set(chars, {
                yPercent: 0,
                rotation: 0,
            })

            gsap.set(exceptions, {
                yPercent: 0,
                opacity: 0
            })

            animation.forEach(st => st.kill());
        }
    })

}

export const openPortfolioPage = (color) => {
    const translateSvg = '#translate'
    const mainPathSelector = "#zero"
    const secontPathSelector = "#second"
    const thirdPathSelector = "#third"

    gsap.timeline().timeScale(2)
        .set(mainPathSelector, {
            fill: color
        })
        .set(mainPathSelector, {
            morphSVG: mainPathSelector
        })
        .set(translateSvg, {
            opacity: 1
        })
        .to(mainPathSelector, {
            morphSVG: secontPathSelector,
            duration: .65,
            ease: "power1.out"
        })
        .to(mainPathSelector, {
            morphSVG: thirdPathSelector,
            duration: 1,
            ease: "power1.out"
        }, '-=0.5')

}

export const resetPortdolioPage = () => {
    const mainPathSelector = "#zero"
    const translateSvg = '#translate'
    gsap.timeline()
        .to(translateSvg, {
            opacity: 0,
            delay: 0.5,
            duration: 0.5
        })
        .set(mainPathSelector, {
            morphSVG: mainPathSelector
        })
        .set(translateSvg, {
            opacity: 1
        })
}


export const closePortfolioPage = () => {
    const translateSvg = '#translate'
    const mainPathSelector = "#zero"
    const secontPathSelector = "#second"
    const thirdPathSelector = "#third"
    const speed = 2

    const tl = gsap.timeline().timeScale(speed)
    tl.set(translateSvg, {
            opacity: 1
        })
        .set(mainPathSelector, {
            morphSVG: thirdPathSelector
        })
        .to(mainPathSelector, {
            morphSVG: secontPathSelector,
            duration: 1,
            delay: 0.5,
            ease: "power1.out"
        })
        .to(mainPathSelector, {
            morphSVG: mainPathSelector,
            duration: 1,
            ease: "power1.out"
        }, '-=0.6')
}

export const portfolioPageBeforeLeave = () => {
    const modal = document.querySelector('.modal')
    const mainPathSelector = "#zero"
    const thirdPathSelector = "#third"
    const color = modal.style.background

    gsap.set(mainPathSelector, {
        morphSVG: thirdPathSelector,
        fill: color,
        opacity: 0
    })
    gsap.to(mainPathSelector, {
        opacity: 1,
        duration: .3
    })
}