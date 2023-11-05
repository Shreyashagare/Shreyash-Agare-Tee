import {
    gsap
} from "gsap";
import {
    ScrollTrigger
} from "gsap/ScrollTrigger"
import {
    CustomEase
} from "gsap/CustomEase";
import {
    MorphSVGPlugin
} from "gsap/MorphSVGPlugin";
import {
    SplitText
} from "gsap/SplitText";
import {
    ScrollSmoother
} from "gsap/ScrollSmoother";
import {
    Observer
} from "gsap/Observer";


export const initGsap = () => {
    gsap.registerPlugin(ScrollTrigger, MorphSVGPlugin, SplitText, CustomEase, ScrollSmoother, Observer);

    gsap.config({
        autoSleep: 60000,
        // force3D: true,
        nullTargetWarn: false,
        autoRefreshEvents: "DOMContentLoaded,load,resize",
        trialWarn: false,
        ignoreMobileResize: true,
        // units: {left: "%", top: "%", rotation: "rad"}
    });

    window.onbeforeunload = function() {
        window.scrollTo(0, 0);
    }

    const smooth = ScrollSmoother.create({
        content: '#scroller',
        wrapper: '#scroller-wrapper',
        smooth: 1,
        effects: false,
        ignoreMobileResize: true,
    })

    window.smooth = smooth

}