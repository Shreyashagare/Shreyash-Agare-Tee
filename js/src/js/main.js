import {
    textBlockAppear,
    titleAppear
} from './parts/helpers/animations'

import "./parts/helpers/sayHello"
import {
    initGsap
} from "./parts/helpers/gsapConfig"
import {
    setEasings
} from "./parts/helpers/easing"
import {
    setMobileHeight
} from "./parts/helpers/mobileVh"
import {
    initMagicHover
} from './parts/helpers/magicHover'
import {
    initScrollTo
} from './parts/helpers/scrollTo'
import {
    initButtonHovers
} from './parts/helpers/button-hovers'

import {
    initHeader
} from './parts/header'
import {
    initHero
} from './parts/hero'
import {
    initSnake
} from './parts/snake'
import {
    initPortfolio
} from './parts/portfolio'
import {
    initModals
} from './parts/modal'
import {
    initPrinciples
} from './parts/principles'
import {
    initAwards
} from './parts/awards'
import {
    initTeacher
} from './parts/teacher'
import {
    initArticles
} from './parts/articles'
import {
    initMentorship
} from './parts/mentorship'
import {
    initWorking
} from './parts/working'
import {
    initHelp
} from './parts/help'
import {
    initFormModal
} from './parts/form-modal'
import {
    initBarba
} from './parts/helpers/barba-pages'
import {
    initForm
} from './parts/form'

initGsap()
setEasings()
setMobileHeight()

const initApplication = (preloader = true) => {
    initGsap()
    initHeader()
    initHero(preloader)
    initSnake()
    initPortfolio()
    initModals()
    initPrinciples()
    initAwards()
    initTeacher()
    initArticles()
    initMentorship()
    initWorking()
    initHelp()
    initForm()

    initMagicHover()
    initScrollTo()
    initButtonHovers()
    textBlockAppear()
    titleAppear()
    initFormModal()
}

initApplication();
initBarba(initApplication)