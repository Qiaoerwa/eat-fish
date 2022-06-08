/*
 * @Description: 
 * @Autor: fylih
 * @Date: 2022-02-09 10:53:07
 * @LastEditors: fylih
 * @LastEditTime: 2022-02-23 15:48:30
 */
// 随机数
import { _canvas, _ctx } from './game.js'


export function random(min, max) {
    return Math.random() * (max - min) + min
}

export function floor(num) {
    return Math.floor(num)
}

export function _debounce(time) {
    let lastClick = undefined
    return function () {
        const nowClick = new Date();
        if (lastClick === undefined) {
            lastClick = nowClick;
            return true;
        } else {
            if (Math.round((nowClick.getTime() - lastClick.getTime())) > time) {
                lastClick = nowClick;
                return true;
            } else {
                lastClick = nowClick;
                return false
            }
        }
    }
}

export function eat() {
    const eatAudio = document.getElementById('eatAudio')
    eatAudio.play()
}

export function beEat() {
    const beEatAudio = document.getElementById('beEatAudio')
    beEatAudio.play()
}