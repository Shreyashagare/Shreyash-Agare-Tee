import barba from '@barba/core'
import {
    gsap
} from 'gsap'
import {
    ScrollTrigger
} from 'gsap/ScrollTrigger'
import {
    openPortfolioPage,
    closePortfolioPage,
    resetPortdolioPage,
    portfolioPageBeforeLeave
} from './animations'



const portfolioColors = {
    crysis: '#B7CCA3',
    itg: '#B2C797',
    lifehouse: '#C7CFAF',
    netrix: '#D4C6B0',
    space: '#E0E1D1',
    tough: '#DED7CC'
}
const portfolioPages = [
    'crysis',
    'itg',
    'lifehouse',
    'netrix',
    'space',
    'tough'
]

export const initBarba = (initApplication) => {

    const killScrollTriggers = () => {
        let triggers = ScrollTrigger.getAll();

        triggers.forEach(trigger => {
            trigger.kill(true);
        });
    };

    const delay = (n) => {
        n = n || 2000;
        return new Promise((done) => {
            setTimeout(() => {
                done();
            }, n);
        });
    }

    barba.init({
        sync: true,
        transitions: [

            // to modals from enywhere
            {
                name: 'modal-transition',
                from: {
                    namespace: ['home', ...portfolioPages]
                },
                to: {
                    namespace: portfolioPages
                },
                async before(data) {
                    const done = this.async();
                    openPortfolioPage(portfolioColors[data.next.namespace])
                    window.smooth.kill()
                    await delay(1000);
                    done();
                },
                async enter() {
                    resetPortdolioPage()

                },
                async after() {
                    initApplication(false);
                    window.smooth.scrollTop(0)
                }
            },



            // modals to home
            {
                name: 'modal-transition-out',
                from: {
                    namespace: portfolioPages
                },
                to: {
                    namespace: ['home']
                },
                async beforeEnter() {
                    gsap.set('.preloader', {
                        display: 'none'
                    })
                },
                async before() {
                    const done = this.async();
                    portfolioPageBeforeLeave()
                    window.smooth.kill()
                    ScrollTrigger.normalizeScroll(false)
                    await delay(500);
                    done();
                },
                async enter() {
                    closePortfolioPage()
                    window.smooth.scrollTo('.portfolio', false)
                },
                async after() {
                    initApplication(false);
                }
            }
        ]
    });


    barba.hooks.afterLeave(() => {
        killScrollTriggers()
    })

}