/*
 * @Description: 
 * @Autor: fylih
 * @Date: 2022-02-09 09:42:26
 * @LastEditors: fylih
 * @LastEditTime: 2022-02-24 09:36:07
 */
import { gameOptions } from './sceneOptions.js'
import { initBubble, drawBubble } from './bubble.js'
import { drawBackground, initBackground } from './background.js'
import { initFish, drawFish, fishContainer } from './fish.js'
import { drawMyFish, initMyFish } from './myFish.js'
import { initControl, drawControl } from './control.js'


export let _ctx, _canvas

function clear() {
    _ctx.clearRect(0, 0, gameOptions.sceneX, gameOptions.sceneY);
}

function initGame() {
    initBackground(_canvas, _ctx)
    initControl(_ctx, _canvas)
    initBubble(_ctx)
    initMyFish(_ctx)
    initFish(_ctx)
}

let isPause = false
export function pause(flag) {
    isPause = flag
}

function gameLoop() {
    if (!isPause) {
        clear()
        drawBackground()
        drawControl()
        drawBubble()
        drawMyFish()
        drawFish()
    }
    requestAnimationFrame(gameLoop)
}

export function restart() {
    fishContainer.forEach(fish => {
        fish.interval = null
    })
    initBackground(_canvas, _ctx)
    initBubble(_ctx)
    initMyFish(_ctx)
    initFish(_ctx)
}

export function start() {
    // 画布
    const container = document.getElementById('container')
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    container.appendChild(canvas)
    _ctx = ctx
    _canvas = canvas
    // 初始化游戏
    initGame()
    // 开始动画
    gameLoop()
}