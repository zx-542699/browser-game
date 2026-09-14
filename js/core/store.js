/**
 * 全局状态存储 —— 所有玩家数据集中在这里
 *
 * 状态变化时 emit STATE_CHANGED，UI 层订阅后自动刷新。
 * 玩家数据（修为/灵石/境界等）都挂在 state.player 下。
 */
import { bus, EV } from './event-bus.js';

export const store = {
  player: null,   // 玩家数据（没有就表示未创建角色）

  /** 创建新角色 */
  createPlayer(name) {
    this.player = {
      name: name || '无名散修',
      realm: 0,        // 境界索引（对应 data/realms.js）
      exp: 0,          // 当前修为值
      hp: 100,         // 生命
      maxHp: 100,
      stone: 0,        // 灵石（货币）
      pills: 0,        // 丹药（加速修炼）
      level: 1,        // 小等级（历练加成用）
      createdAt: Date.now(),
    };
    bus.emit(EV.STATE_CHANGED, { reason: 'create' });
    return this.player;
  },

  /** 整体替换玩家数据（读档用） */
  setPlayer(data) {
    this.player = data;
    bus.emit(EV.STATE_CHANGED, { reason: 'load' });
  },

  /** 获取玩家，没有则返回 null */
  get() {
    return this.player;
  },

  /** 修改玩家数据并通知 UI 刷新 */
  patch(fields) {
    if (!this.player) return;
    Object.assign(this.player, fields);
    bus.emit(EV.STATE_CHANGED, { reason: 'patch', fields: Object.keys(fields) });
  },
};
