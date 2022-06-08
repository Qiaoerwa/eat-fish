/*
 * @Description: 
 * @Autor: fylih
 * @Date: 2022-02-15 09:56:19
 * @LastEditors: fylih
 * @LastEditTime: 2022-02-23 15:44:15
 */

const innerWidth = window.innerWidth
const innerHeight = window.innerHeight
const sceneX = 3000
const sceneY = 3000
export const gameOptions = {
    innerWidth,
    innerHeight,
    sceneX,
    sceneY,
    initMyFishSpeed: 2.8,
    initEnemyFishSpeed: [1.5, 2],
    fishPosition: [sceneX / 2, sceneY / 2],
}

