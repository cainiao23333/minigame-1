import Pool from './base/pool'

let instance

/**
 * 全局状态管理器
 */
export default class DataBus {
  constructor() {
    if (instance) return instance

    instance = this

    this.pool = new Pool()

    this.reset()
  }

  reset() {
    this.frame = 0
    this.score = 0
    this.bullets = []
    this.enemys = []
    this.animations = []
    this.gameOver = false
  }

  /**
   * 回收敌人，进入对象池
   * 此后不进入帧循环
   */


  /**
   * 回收子弹，进入对象池
   * 此后不进入帧循环
   */

}
