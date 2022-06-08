/*
 * @Description: 
 * @Autor: fylih
 * @Date: 2022-01-27 16:24:51
 * @LastEditors: fylih
 * @LastEditTime: 2022-02-23 15:48:24
 */

import { random } from './common.js'
import { gameOptions } from './sceneOptions.js'

// 画布信息
let _ctx

// 气泡类
class Bubble {
    speed = random(1.5, 3)
    radius = random(2, 25)
    offsetX = random(0, gameOptions.sceneX)
    offsetY = gameOptions.sceneY + this.radius
    cacheCanvas = document.createElement("canvas");
    cacheCtx = this.cacheCanvas.getContext("2d");
    constructor() {
        this.cacheCanvas.width = 2 * this.radius + 10;
        this.cacheCanvas.height = 2 * this.radius + 10;
        this.cache()
    }
    move() {
        this.offsetY -= this.speed
        if (this.offsetY < -this.radius) {
            return false
        } else {
            this.draw()
            return true
        }
    }
    cache() {
        this.cacheCtx.save();
        this.cacheCtx.shadowColor = 'white'
        this.cacheCtx.shadowBlur = 5
        this.cacheCtx.fillStyle = 'transparent'
        this.cacheCtx.strokeStyle = `rgba(255,255,255,0.4)`
        this.cacheCtx.beginPath()
        this.cacheCtx.arc(this.radius + 5, this.radius + 5, this.radius, 0, Math.PI * 2, true)
        this.cacheCtx.closePath()
        this.cacheCtx.stroke()
        this.cacheCtx.fill()
        this.cacheCtx.beginPath()
        this.cacheCtx.ellipse(
            (3 * this.radius / 2) + 5,
            (this.radius / 2) + 5,
            this.radius / 3,
            this.radius / 5,
            Math.PI / 4.5,
            0,
            Math.PI * 2
        )
        this.cacheCtx.closePath()
        this.cacheCtx.fillStyle = 'rgba(255,255,255,0.7)'
        this.cacheCtx.fill()
        this.cacheCtx.restore();
    }
    draw() {
        _ctx.drawImage(this.cacheCanvas, this.offsetX, this.offsetY)
    }
}


// 存放气泡实例的数组
export const bubbles = []

// 初始化
export function initBubble(ctx) {
    _ctx = ctx
    setInterval(() => {
        const bubble = new Bubble()
        if (bubbles.length < 1000) {
            bubbles.push(bubble)
        }
    }, 200, true)
}

// 开始作画
export function drawBubble() {
    for (let i = 0; i < bubbles.length; i++) {
        if (!bubbles[i].move()) {
            bubbles[i].cacheCanvas = null
            bubbles.splice(i, 1)
            i--
        }
    }
}
