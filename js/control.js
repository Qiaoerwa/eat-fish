/*
 * @Description: 
 * @Autor: fylih
 * @Date: 2022-02-11 16:40:13
 * @LastEditors: fylih
 * @LastEditTime: 2022-02-23 15:48:36
 */

import { gameOptions } from './sceneOptions.js'
import { floor } from './common.js'

let _ctx, _canvas
class Control {
    start = false
    speed = gameOptions.initMyFishSpeed
    vx = 0
    vy = 0
    rad = 0
    move() {
        if (this.start) {
            // 控制器动及其逻辑
            this.vx = Math.cos(this.rad) * this.speed
            this.vy = Math.sin(this.rad) * this.speed
        }
    }
}
export const control = new Control()
export function initControl(ctx, canvas) {
    _ctx = ctx
    _canvas = canvas
    let preX, preY
    function mouseStart(event) {
        control.start = true
        let _x, _y
        if (event.type === 'touchstart') {
            _x = floor(event.changedTouches[0].pageX)
            _y = floor(event.changedTouches[0].pageY)
        } else {
            _x = floor(event.x)
            _y = floor(event.y)
        }
        preX = _x
        preY = _y

    }

    function mouseMove(event) {
        event.preventDefault()
        if (control.start) {
            let _x, _y
            if (event.type === 'touchmove') {
                _x = floor(event.changedTouches[0].pageX)
                _y = floor(event.changedTouches[0].pageY)
            } else {
                _x = floor(event.x)
                _y = floor(event.y)
            }
            control.rad = Math.atan2(_y - preY, _x - preX)
        }
    }

    _canvas.addEventListener('mousedown', (e) => mouseStart(e))
    _canvas.addEventListener('touchstart', (e) => mouseStart(e))

    _canvas.addEventListener('mousemove', (e) => mouseMove(e))
    _canvas.addEventListener('touchmove', (e) => mouseMove(e))
}

export function drawControl() {
    control.move()
}
