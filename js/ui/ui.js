/**
 * UI 层 —— 负责所有界面渲染与按钮事件
 *
 * 设计原则：UI 只读状态、调系统、订阅事件刷新，
 * 不包含游戏规则（规则都在 systems 里）。
 *
 * 界面分两个：
 *   login   创建角色页
 *   game    游戏主界面
 */
import { bus, EV } from '../core/event-bus.js';
import { store } from '../core/store.js';
import { realms } from '../data/realms.js';
import { items } from '../data/items.js';
import { cultivation } from '../systems/cultivation.js';
import { realmSystem } from '../systems/realm.js';
import { explore } from '../systems/explore.js';
import { saveSystem } from '../systems/save.js';

export const ui = {
  /** 页面元素引用 */
  el: {},

  init() {
    this.el = {
      app: document.getElementById('app'),
      loginScreen: document.getElementById('login-screen'),
      gameScreen: document.getElementById('game-screen'),
      playerName: document.getElementById('player-name'),
      playerRealm: document.getElementById('player-realm'),
      playerExp: document.getElementById('player-exp'),
      playerHp: document.getElementById('player-hp'),
      playerStone: document.getElementById('player-stone'),
      playerPills: document.getElementById('player-pills'),
      logBox: document.getElementById('log-box'),
      breakthroughBtn: document.getElementById('btn-breakthrough'),
      pillBtn: document.getElementById('btn-pill'),
    };

    this.bindButtons();
    this.bindBreakthrough();
    this.bindPill();
    this.bindEvents();

    // 有存档直接进游戏，没有就显示创建页
    if (saveSystem.hasSave() && saveSystem.load()) {
      this.showGame();
    } else {
      this.showLogin();
    }
    this.refresh();
  },

  /** 绑定所有按钮 */
  bindButtons() {
    document.getElementById('btn-create').addEventListener('click', () => {
      const name = document.getElementById('input-name').value.trim() || '无名散修';
      store.createPlayer(name);
      this.log(`🌱 道友「${name}」踏入仙途，从炼气开始修炼。`);
      this.showGame();
    });

    document.getElementById('btn-cultivate').addEventListener('click', () => {
      const amount = cultivation.cultivate();
      this.log(`🧘 你打坐修炼，获得 ${amount} 点修为。`);
    });

    document.getElementById('btn-explore').addEventListener('click', () => {
      const result = explore.explore();
      if (result) this.log(`🚶 ${result.text}`);
    });

    document.getElementById('btn-save').addEventListener('click', () => {
      if (saveSystem.save()) this.log('💾 存档成功！');
    });

    document.getElementById('btn-delete-save').addEventListener('click', () => {
      if (confirm('确定删除存档重新开始吗？')) {
        saveSystem.clear();
        location.reload();
      }
    });
  },

  /** 订阅事件：任何状态变化都刷新面板 */
  bindEvents() {
    bus.on(EV.STATE_CHANGED, () => this.refresh());
    bus.on(EV.REALM_UP, ({ realm }) => {
      this.log(`✨ 恭喜！你突破到了【${realm}】境界！`);
      this.refresh();
    });
    bus.on(EV.LOG, (msg) => this.log(msg));
  },

  /** 突破按钮 */
  bindBreakthrough() {
    this.el.breakthroughBtn.addEventListener('click', () => {
      if (realmSystem.breakthrough()) {
        // 突破日志由 REALM_UP 事件触发
      } else {
        this.log('❌ 修为不足，无法突破。');
      }
    });
  },

  /** 丹药按钮 */
  bindPill() {
    this.el.pillBtn.addEventListener('click', () => {
      if (cultivation.usePill(items.pill.exp)) {
        this.log(`💊 你服下聚灵丹，获得 ${items.pill.exp} 点修为！`);
      } else {
        this.log('❌ 你没有丹药。去历练碰碰运气吧。');
      }
    });
  },

  /** 显示创建角色页 */
  showLogin() {
    this.el.loginScreen.style.display = 'block';
    this.el.gameScreen.style.display = 'none';
  },

  /** 显示游戏主界面 */
  showGame() {
    this.el.loginScreen.style.display = 'none';
    this.el.gameScreen.style.display = 'block';
  },

  /** 追加一条日志（最多保留 60 条） */
  log(msg) {
    const div = document.createElement('div');
    div.className = 'log-line';
    div.textContent = `[${new Date().toLocaleTimeString('zh-CN', { hour12: false })}] ${msg}`;
    this.el.logBox.appendChild(div);
    while (this.el.logBox.children.length > 60) {
      this.el.logBox.removeChild(this.el.logBox.firstChild);
    }
    this.el.logBox.scrollTop = this.el.logBox.scrollHeight;
  },

  /** 刷新状态面板 */
  refresh() {
    const p = store.get();
    if (!p) return;
    const realm = realms[Math.min(p.realm, realms.length - 1)];
    const next = realms[p.realm + 1];

    this.el.playerName.textContent = p.name;
    this.el.playerRealm.textContent = realm.name;
    this.el.playerExp.textContent = `${p.exp}${next ? ` / ${next.need}` : '（已圆满）'}`;
    this.el.playerHp.textContent = `${p.hp} / ${p.maxHp}`;
    this.el.playerStone.textContent = p.stone;
    this.el.playerPills.textContent = p.pills;

    // 突破按钮状态
    this.el.breakthroughBtn.disabled = !realmSystem.canBreakthrough();
    this.el.breakthroughBtn.textContent = realmSystem.canBreakthrough()
      ? `⬆️ 突破到${next ? next.name : '圆满'}`
      : `突破到${next ? next.name : '圆满'}（需 ${next ? next.need : '-'} 修为）`;
  },
};
