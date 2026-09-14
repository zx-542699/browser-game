/**
 * 存档系统 —— 存到浏览器 localStorage
 *
 * 存档带版本号：以后数据格式变了，可以在 load 里做迁移，老档不丢。
 * 数据里所有玩家字段都会保存（realm/exp/hp/stone/pills...）。
 */
import { bus, EV } from '../core/event-bus.js';
import { store } from '../core/store.js';

const SAVE_KEY = 'xiuxian_game_save';
const SAVE_VERSION = 1;

export const saveSystem = {
  /** 保存当前玩家数据 */
  save() {
    const p = store.get();
    if (!p) return false;
    const data = {
      version: SAVE_VERSION,
      savedAt: Date.now(),
      player: { ...p },
    };
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(data));
      bus.emit(EV.SAVE, { savedAt: data.savedAt });
      return true;
    } catch (e) {
      console.error('存档失败:', e);
      return false;
    }
  },

  /** 读取存档，成功返回 true */
  load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return false;
      const data = JSON.parse(raw);
      // 版本迁移预留：if (data.version < 2) { ... }
      if (!data.player) return false;
      store.setPlayer(data.player);
      bus.emit(EV.LOAD, { version: data.version });
      return true;
    } catch (e) {
      console.error('读档失败:', e);
      return false;
    }
  },

  /** 是否有存档 */
  hasSave() {
    return !!localStorage.getItem(SAVE_KEY);
  },

  /** 删除存档 */
  clear() {
    localStorage.removeItem(SAVE_KEY);
  },
};
