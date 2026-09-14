/**
 * 突破系统 —— 修为够了就升境界
 *
 * 修为达到当前境界的 need 值即可突破。
 * 突破后：境界+1、生命上限+加成、满血、日志播报。
 */
import { bus, EV } from '../core/event-bus.js';
import { store } from '../core/store.js';
import { realms } from '../data/realms.js';

export const realmSystem = {
  /** 当前境界信息 */
  currentRealm() {
    const p = store.get();
    if (!p) return realms[0];
    return realms[Math.min(p.realm, realms.length - 1)];
  },

  /** 下一个境界信息（没有则返回 null） */
  nextRealm() {
    const p = store.get();
    if (!p) return null;
    const next = realms[p.realm + 1];
    return next || null;
  },

  /** 能否突破 */
  canBreakthrough() {
    const p = store.get();
    if (!p) return false;
    const next = this.nextRealm();
    if (!next) return false;
    return p.exp >= next.need;
  },

  /** 尝试突破，成功返回 true */
  breakthrough() {
    const p = store.get();
    if (!p) return false;
    if (!this.canBreakthrough()) return false;

    const next = this.nextRealm();
    store.patch({
      realm: p.realm + 1,
      maxHp: p.maxHp + next.bonus,
      hp: p.maxHp + next.bonus,   // 突破满血
    });
    bus.emit(EV.REALM_UP, { realm: next.name, index: p.realm + 1 });
    return true;
  },
};
