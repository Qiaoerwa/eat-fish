/*
 * @Description: 
 * @Autor: fylih
 * @Date: 2022-02-15 11:02:59
 * @LastEditors: fylih
 * @LastEditTime: 2022-02-23 15:51:26
 */

import { gameOptions } from "./sceneOptions.js"
import { control } from "./control.js"
const backgroundImg = new Image()
backgroundImg.src = './assets/img/background.jpeg'
let _ctx, _canvas

class BackGround {
    offsetX = 0
    offsetY = 0
    changeZoom(ox, oy) {
        this.offsetX -= ox
        this.offsetY -= oy
    }
    draw() {
        _ctx.save()
        _ctx.drawImage(backgroundImg, 0, 0, gameOptions.sceneX, gameOptions.sceneY);
        _ctx.restore()
    }
    move() {
        let _vx = control.vx
        let _vy = control.vy
        if (this.offsetX < 5 || gameOptions.fishPosition[0] > gameOptions.sceneX - gameOptions.innerWidth / 2) {
            if (_vx < 0) {
                _vx = 0
            }
        }
        if (this.offsetX > (gameOptions.sceneX - gameOptions.innerWidth) - 5 || gameOptions.fishPosition[0] < gameOptions.innerWidth / 2) {
            if (_vx > 0) {
                _vx = 0
            }
        }
        if (this.offsetY < 5 || gameOptions.fishPosition[1] > gameOptions.sceneY - gameOptions.innerHeight / 2) {
            if (_vy < 0) {
                _vy = 0
            }
        }
        if (this.offsetY > (gameOptions.sceneY - gameOptions.innerHeight) - 5 || gameOptions.fishPosition[1] < gameOptions.innerHeight / 2) {
            if (_vy > 0) {
                _vy = 0
            }
        }
        this.offsetX += _vx
        this.offsetY += _vy

        _ctx.translate(-_vx, -_vy)
        this.draw()
    }
}

export const background = new BackGround()
export function initBackground(canvas, ctx) {
    _ctx = ctx
    _canvas = canvas
    _canvas.width = gameOptions.sceneX
    _canvas.height = gameOptions.sceneY
    background.offsetX = gameOptions.sceneX / 2 - gameOptions.innerWidth / 2
    background.offsetY = gameOptions.sceneY / 2 - gameOptions.innerHeight / 2
    _ctx.translate(-background.offsetX, -background.offsetY)
}

export function drawBackground() {
    background.move()
}