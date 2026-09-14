/**
 * 事件总线 —— 系统间解耦的核心
 *
 * 设计目的：让"修炼/突破/历练"等系统互不直接调用，
 * 只通过 emit 发事件，谁需要谁 on 订阅。
 * 好处：哪个系统出 bug，删掉/换掉那个文件就行，其他系统不受影响。
 *
 * 用法：
 *   bus.emit('cultivate', { amount: 5 })        // 发布事件
 *   bus.on('cultivate', (payload) => { ... })   // 订阅事件
 */
export const bus = {
  listeners: new Map(),

  /** 订阅事件，返回取消订阅函数 */
  on(event, handler) {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event).add(handler);
    return () => this.listeners.get(event)?.delete(handler);
  },

  /** 只订阅一次 */
  once(event, handler) {
    const off = this.on(event, (payload) => {
      off();
      handler(payload);
    });
    return off;
  },

  /** 发布事件 */
  emit(event, payload) {
    const set = this.listeners.get(event);
    if (!set) return;
    set.forEach((handler) => {
      try {
        handler(payload);
      } catch (e) {
        console.error(`[事件总线] 处理 ${event} 出错:`, e);
      }
    });
  },

  /** 清空某事件的所有订阅（用于重置/测试） */
  clear(event) {
    if (event) this.listeners.delete(event);
    else this.listeners.clear();
  },
};

/** 事件名常量 —— 统一管理，避免拼写错误 */
export const EV = {
  CULTIVATE: 'cultivate',          // 修炼获得修为
  REALM_UP: 'realm:up',            // 突破境界
  EXPLORE: 'explore',              // 历练结果
  ITEM_GAIN: 'item:gain',          // 获得物品
  ITEM_USE: 'item:use',            // 使用物品
  HP_CHANGE: 'hp:change',          // 生命变化
  SAVE: 'save',                    // 存档
  LOAD: 'load',                    // 读档
  LOG: 'log',                      // 输出一条游戏日志
  STATE_CHANGED: 'state:changed',  // 任意状态变化（UI 刷新用）
};
