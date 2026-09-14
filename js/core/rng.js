/**
 * 随机数工具 —— 所有"运气"都走这里
 *
 * 单独抽出来：以后要加"固定种子/复现"功能，只改这一个文件。
 */
export class RNG {
  /** [min, max] 之间的随机整数 */
  int(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /** 0~1 随机小数 */
  float() {
    return Math.random();
  }

  /** 按概率返回 true（rate=0.3 表示 30% 概率） */
  chance(rate) {
    return Math.random() < rate;
  }

  /** 从数组里随机挑一个 */
  pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
}

export const rng = new RNG();
