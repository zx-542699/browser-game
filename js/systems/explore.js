/**
 * 历练系统 —— 下山探索，随机事件
 *
 * 按权重随机抽一个事件（data/events.js），结算效果。
 * 事件可能：涨修为 / 得灵石 / 受伤 / 得丹药。
 */
import { bus, EV } from '../core/event-bus.js';
import { store } from '../core/store.js';
import { rng } from '../core/rng.js';
import { events } from '../data/events.js';

export const explore = {
  /** 按权重随机选一个事件 */
  rollEvent() {
    const total = events.reduce((s, e) => s + e.weight, 0);
    let roll = rng.float() * total;
    for (const e of events) {
      roll -= e.weight;
      if (roll <= 0) return e;
    }
    return events[0];
  },

  /** 执行一次历练，返回 { text, effects } 供 UI 展示 */
  explore() {
    const p = store.get();
    if (!p) return null;

    const ev = this.rollEvent();
    const eff = ev.effects || {};

    // 结算效果
    const changes = {};
    if (eff.exp) changes.exp = p.exp + eff.exp;
    if (eff.stone) changes.stone = p.stone + eff.stone;
    if (eff.hp) changes.hp = Math.max(0, Math.min(p.maxHp, p.hp + eff.hp));
    if (eff.item === 'pill') changes.pills = (p.pills || 0) + 1;

    store.patch(changes);
    bus.emit(EV.EXPLORE, { text: ev.text, effects: eff });

    return { text: ev.text, effects: eff };
  },
};
