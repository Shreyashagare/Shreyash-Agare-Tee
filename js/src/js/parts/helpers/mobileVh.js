import {
    onResizeAndOrientation
} from "./resize";

export const setMobileHeight = () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);

    const onResize = () => {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    onResizeAndOrientation(onResize, onResize)
}