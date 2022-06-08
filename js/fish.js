/*
 * @Description: 
 * @Autor: fylih
 * @Date: 2022-02-09 14:44:46
 * @LastEditors: fylih
 * @LastEditTime: 2022-02-23 15:48:44
 */
import { random, floor, _debounce } from './common.js'
import { fishList } from './fishSource.js'
import { myFishContainer } from './myFish.js'
import { gameOptions } from './sceneOptions.js'


// 画布信息
let _ctx

export class Fish {
    level = 0
    speed = random(gameOptions.initEnemyFishSpeed[0], gameOptions.initEnemyFishSpeed[1])
    offsetX = random(0, gameOptions.sceneX)
    offsetY = random(0, gameOptions.sceneY)
    vx = 0
    vy = 0
    distanceX = 0
    distanceY = 0
    interval
    intervalTime = 8000
    rad = 0
    size = 0
    abs = 0
    debounce = _debounce(2000)
    getSize() {
        return 36 * (1 + Math.pow(1.1, this.level))
    }
    init() {
        this.setRandomPosition()
        this.interval = setInterval(this.setRandomPosition.bind(this), this.intervalTime)
    }
    // 计算运动轨迹
    setRandomPosition(position) {
        this.intervalTime = random(4, 8) * 1000
        let positionX = 0, positionY = 0
        const getPoint = (position) => {
            if (position) {
                positionX = position[0]
                positionY = position[1]
            } else {
                positionX = random(this.offsetX - 50, this.offsetX + 50)
                positionY = random(this.offsetY - 50, this.offsetY + 50)
            }
            if (positionX > gameOptions.sceneX || positionX < 0 || positionY > gameOptions.sceneY || positionY < 0) {
                getPoint()
            }
        }
        getPoint(position)
        this.distanceX = positionX - this.offsetX
        this.distanceY = positionY - this.offsetY
        this.rad = Math.atan2(this.distanceY, this.distanceX)
        this.abs = Math.abs(this.distanceX) + Math.abs(this.distanceY)
    }
    // 获取与主角鱼的距离
    getSelfPosition() {
        return [Math.abs(this.offsetX - gameOptions.fishPosition[0]), Math.abs(this.offsetY - gameOptions.fishPosition[1])]
    }
    move() {
        this.vx = this.speed * this.distanceX / this.abs
        this.vy = this.speed * this.distanceY / this.abs
        this.offsetX += this.vx
        this.offsetY += this.vy
        // 边缘重新计算
        if (this.offsetX > gameOptions.sceneX || this.offsetX < 0 || this.offsetY > gameOptions.sceneY || this.offsetY < 0) {
            this.setRandomPosition()
        }
        // 脱离屏幕重新计算等级
        if (this.level < myFishContainer[0].level - 3 || this.level > myFishContainer[0].level + 2) {
            if (this.getSelfPosition()[0] > gameOptions.sceneX / 3 || this.getSelfPosition()[1] > gameOptions.sceneY / 3) {
                this.newLevel()
            }
        }
        // 接近后逃离或追击
        if (this.getSelfPosition()[0] < this.size * 2 && this.getSelfPosition()[1] < this.size * 2) {
            if (this.debounce() && random(0, 1) > 0.4) {
                if (this.level <= myFishContainer[0].level) {
                    this.escape()
                } else {
                    this.catch()
                }
            }
        }
        this.draw()
    }
    newLevel() {
        const lowLevelFish = fishContainer.filter((f) => f.level <= myFishContainer[0].level)
        if (lowLevelFish.legnth < 3) {
            // 如果没有比主角鱼等级低的，那就生成等级低的
            this.level = myFishContainer[0].level
        } else {
            // 随机生成范围内等级的小鱼
            let randomLevel = floor(random(myFishContainer[0].level, myFishContainer[0].level + 3))
            if (randomLevel < 0) {
                randomLevel = 0
            } else if (randomLevel > 18) {
                randomLevel = 18
            }
            this.level = randomLevel
        }
        this.size = this.getSize()
    }
    escape() {
        const negativeX = this.offsetX - gameOptions.fishPosition[0] + this.offsetX
        const negativeY = this.offsetY - gameOptions.fishPosition[1] + this.offsetY
        this.setRandomPosition([negativeX, negativeY])
        const copySpeed = this.speed
        this.speed = this.speed * 1.2
        setTimeout(() => {
            this.speed = copySpeed
        }, 1500)
    }
    catch() {
        this.setRandomPosition([gameOptions.fishPosition[0], gameOptions.fishPosition[1]])
        const copySpeed = this.speed
        this.speed = this.speed * 1.2
        setTimeout(() => {
            this.speed = copySpeed
        }, 1500)
    }
    draw() {
        _ctx.save()
        let negative
        if (this.rad < Math.PI / 2 && this.rad > -Math.PI / 2) {
            negative = -1
        } else {
            negative = 1
        }
        _ctx.translate(this.offsetX, this.offsetY)
        _ctx.rotate(this.rad - Math.PI)
        _ctx.scale(1, negative)
        _ctx.drawImage(fishList[this.level], -this.size / 2, -this.size / 3, this.size, this.size / 1.5);
        _ctx.restore()
    }
}

function newFish() {
    const fish = new Fish()
    fish.newLevel()
    fish.init()
    fishContainer.push(fish)
}

export function delFish(index) {
    fishContainer[index].interval = null
    fishContainer.splice(index, 1)
    newFish()
}

export const fishContainer = []

// 初始化
export function initFish(ctx) {
    _ctx = ctx
    fishContainer.length = 0
    for (let i = 0; i < 35; i++) {
        newFish()
    }
}

export function drawFish() {
    for (let i = 0; i < fishContainer.length; i++) {
        fishContainer[i].move()
    }
}


