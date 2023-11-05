import {
    BallAnimation
} from "./modal-awards";

export const initAwards = () => {
    const crisisAwards = document.querySelector('#crisis-awards')
    const itgAwards = document.querySelector('#itg-awards')
    const netrixAwards = document.querySelector('#netrix-awards')
    const lifehouseAwards = document.querySelector('#lifehouse-awards')

    if (crisisAwards) {
        const awardsBalls = new BallAnimation('#crisis-awards', [{
                width: 630,
                path: '../../assets/images/awards/san-francisco.png',
                desktopWidth: 220
            },
            {
                width: 320,
                path: '../../assets/images/awards/best2.png',
                desktopWidth: 160
            },
        ])

        setTimeout(() => {
            awardsBalls.init()
        }, 2500)
    }

    if (itgAwards) {
        const awardsBalls = new BallAnimation('#itg-awards', [{
                width: 280,
                path: '../../assets/images/awards/reddot2.png',
                desktopWidth: 140
            },
            {
                width: 200,
                path: '../../assets/images/awards/adce.png',
                desktopWidth: 100
            },
            {
                width: 630,
                path: '../../assets/images/awards/webby.png',
                desktopWidth: 140

            },
            {
                width: 630,
                path: '../../assets/images/awards/css.png',
                desktopWidth: 120
            },
            {
                width: 630,
                path: '../../assets/images/awards/very-best.png',
                desktopWidth: 120
            },
            {
                width: 200,
                path: '../../assets/images/awards/awwwards2.png',
                desktopWidth: 100
            },
        ])

        setTimeout(() => {
            awardsBalls.init()
        }, 2500)
    }

    if (netrixAwards) {
        const awardsBalls = new BallAnimation('#netrix-awards', [{
                width: 630,
                path: '../../assets/images/awards/very-best.png',
                desktopWidth: 220
            },
            {
                width: 200,
                path: '../../assets/images/awards/awwwards2.png',
                desktopWidth: 160
            }
        ])

        setTimeout(() => {
            awardsBalls.init()
        }, 2500)
    }

    if (lifehouseAwards) {
        const awardsBalls = new BallAnimation('#lifehouse-awards', [{
            width: 630,
            path: '../../assets/images/awards/very-best.png',
            desktopWidth: 160
        }])

        setTimeout(() => {
            awardsBalls.init()
        }, 2500)
    }
}