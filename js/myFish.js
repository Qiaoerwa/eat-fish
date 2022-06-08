/*
 * @Description: 
 * @Autor: fylih
 * @Date: 2022-02-09 14:44:46
 * @LastEditors: fylih
 * @LastEditTime: 2022-02-24 09:33:18
 */
import { random, floor, eat, beEat } from './common.js'
import { fishList } from './fishSource.js'
import { gameOptions } from './sceneOptions.js'
import { control } from './control.js'
import { delFish, fishContainer } from './fish.js'
import { restart } from './game.js'


// 画布信息
let _ctx

class MyFish {
    level = 0
    speed = random(1, 3)
    offsetX = 0
    offsetY = 0
    interval
    intervalTime = 8000
    getSize() {
        return 36 * (1 + Math.pow(1.1, this.level))
    }
    size = 0
    index = 0
    move() {
        const directive = myFishContainer.map((fish) => {
            return {
                up: fish.offsetY - fish.size / 2,
                down: fish.offsetY + fish.size / 2,
                left: fish.offsetX - fish.size / 2,
                right: fish.offsetX + fish.size / 2
            }
        })
        const maxDirective = {
            up: Math.min(...directive.map((x) => x.up)),
            down: Math.max(...directive.map((x) => x.down)),
            left: Math.min(...directive.map((x) => x.left)),
            right: Math.max(...directive.map((x) => x.right)),
        }

        this.offsetX += control.vx
        this.offsetY += control.vy

        if (this.offsetX > gameOptions.sceneX - (maxDirective.right - this.offsetX)) {
            this.offsetX = gameOptions.sceneX - (maxDirective.right - this.offsetX)
        }
        if (this.offsetX < this.offsetX - maxDirective.left) {
            this.offsetX = this.offsetX - maxDirective.left
        }
        if (this.offsetY > gameOptions.sceneY - (maxDirective.down - this.offsetY)) {
            this.offsetY = gameOptions.sceneY - (maxDirective.down - this.offsetY)
        }
        if (this.offsetY < this.offsetY - maxDirective.up) {
            this.offsetY = this.offsetY - maxDirective.up
        }
        gameOptions.fishPosition[0] = myFishContainer[0].offsetX
        gameOptions.fishPosition[1] = myFishContainer[0].offsetY

        this.draw()
    }
    draw() {
        _ctx.save()
        _ctx.translate(this.offsetX, this.offsetY)
        _ctx.rotate(control.rad - Math.PI)
        _ctx.drawImage(fishList[this.level], -this.size / 2, -this.size / 3, this.size, this.size / 1.5);
        _ctx.restore()
    }
    eatListen() {
        for (let i = 0; i < fishContainer.length; i++) {
            const distanceX = Math.abs(fishContainer[i].offsetX - this.offsetX)
            const distanceY = Math.abs(fishContainer[i].offsetY - this.offsetY)
            if (distanceX < this.size / 3 + fishContainer[i].size / 3 && distanceY < this.size / 3 + fishContainer[i].size / 3) {
                if (this.level >= fishContainer[i].level) {
                    levelUp(i)
                } else {
                    levelDown(this.index)
                }
            }
        }
    }
}

function levelUp(index) {
    eat()
    const newLevel = fishContainer[index].level
    pushFish(newLevel)
    merge(newLevel)
    delFish(index)

    function merge(level) {
        const sameNum = myFishContainer.filter((fish) => fish.level === level)
        if (sameNum.length >= 3) {
            if (sameNum[0].level < 18) {
                sameNum[0].level++
                sameNum[0].size = sameNum[0].getSize()
                myFishContainer.splice(myFishContainer.findIndex((x) => x.level === newLevel), 1)
                myFishContainer.splice(myFishContainer.findIndex((x) => x.level === newLevel), 1)
                merge(level + 1)
            }
        }
    }
}

function levelDown(index) {
    beEat()
    if (myFishContainer.length > 1) {
        myFishContainer.splice(myFishContainer.findIndex((x) => x.index === index), 1)
    } else {
        restart()
    }
}

function pushFish(level = 0) {
    let index = 0
    function getIndex() {
        const idx = floor(random(1, 5000))
        if (myFishContainer.find((fish) => fish.index === idx)) {
            getIndex()
        } else {
            index = idx
        }
    }
    getIndex()
    const myFish = new MyFish()
    myFish.level = level
    myFish.index = index
    myFish.size = myFish.getSize()
    myFish.speed = control.speed

    if (myFishContainer.length < 1) {
        // 初始鱼
        myFish.offsetX = gameOptions.sceneX / 2
        myFish.offsetY = gameOptions.sceneY / 2
    } else {
        // 吃掉的鱼
        const maxDistance = random(myFishContainer[0].size / 3, myFishContainer[0].size / 1.5)
        const minDistance = random(-myFishContainer[0].size / 3, -myFishContainer[0].size / 1.5)
        myFish.offsetX = myFishContainer[0].offsetX + random(minDistance, maxDistance)
        myFish.offsetY = myFishContainer[0].offsetY + random(minDistance, maxDistance)
    }

    myFishContainer.push(myFish)
}

export const myFishContainer = []

export function initMyFish(ctx) {
    myFishContainer.length = 0
    _ctx = ctx
    pushFish()
}

export function drawMyFish() {
    for (let i = 0; i < myFishContainer.length; i++) {
        myFishContainer[i].move()
        myFishContainer[i].eatListen()
    }
}