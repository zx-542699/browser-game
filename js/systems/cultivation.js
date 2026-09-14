/**
 * 修炼系统 —— 打坐涨修为
 *
 * 只负责"修为怎么涨"，不碰界面。
 * 涨完 emit CULTIVATE 事件，谁要听谁听。
 */
import { bus, EV } from '../core/event-bus.js';
import { store } from '../core/store.js';
import { rng } from '../core/rng.js';

export const cultivation = {
  /**
   * 修炼一次，返回本次获得的修为
   * 修为 = 基础 1 + 境界加成（每境界 +1）+ 随机 0~2
   */
  cultivate() {
    const p = store.get();
    if (!p) return 0;

    // 境界加成：炼气 1，筑基 2，金丹 3 ...（按境界索引）
    const realmBonus = p.realm + 1;
    const amount = realmBonus + rng.int(0, 2);

    store.patch({ exp: p.exp + amount });
    bus.emit(EV.CULTIVATE, { amount, realm: p.realm });
    return amount;
  },

  /** 服用丹药，获得固定修为（数值在 data/items.js） */
  usePill(pillExp) {
    const p = store.get();
    if (!p || p.pills <= 0) return false;
    store.patch({ pills: p.pills - 1, exp: p.exp + pillExp });
    bus.emit(EV.CULTIVATE, { amount: pillExp, source: 'pill' });
    return true;
  },
};
