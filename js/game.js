/* ===== 游戏引擎：负责渲染循环、输入、状态 =====
 * 以后做新游戏，只需要：
 *   1. 新建 js/你的游戏.js，实现 init/update/render 三个函数
 *   2. 在 index.html 里换掉 <script src="js/snake.js">
 * 完全不用改这个文件。
 */
const Game = {
  canvas: null,
  ctx: null,
  running: false,
  game: null,   // 具体的游戏逻辑对象

  init(game) {
    this.canvas = document.getElementById('game');
    this.ctx = this.canvas.getContext('2d');
    this.game = game;
    this.bindInput();
    this.bindControls();
    if (game.init) game.init(this);
    this.loop();
  },

  // 每帧循环
  loop() {
    requestAnimationFrame(() => {
      if (this.game.update) this.game.update(this);
      if (this.game.render) this.game.render(this);
      this.loop();
    });
  },

  setStatus(text) {
    const el = document.getElementById('status');
    if (el) el.textContent = text;
  },

  setScore(n) {
    const el = document.getElementById('score');
    if (el) el.textContent = n;
  },

  // 键盘 + 屏幕滑动（手机）
  bindInput() {
    const self = this;
    window.addEventListener('keydown', (e) => {
      self.game.onKey && self.game.onKey(e.key, e);
    });
    let sx = 0, sy = 0;
    const c = this.canvas;
    c.addEventListener('touchstart', (e) => {
      const t = e.touches[0];
      sx = t.clientX; sy = t.clientY;
    });
    c.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const t = e.touches[0];
      const dx = t.clientX - sx, dy = t.clientY - sy;
      if (Math.abs(dx) > 24 || Math.abs(dy) > 24) {
        self.game.onSwipe && self.game.onSwipe(dx, dy);
        sx = t.clientX; sy = t.clientY;
      }
    }, { passive: false });
    c.addEventListener('click', () => {
      self.game.onTap && self.game.onTap();
    });
  },

  // 开始/暂停按钮（空格 或 点击"开始"）
  bindControls() {
    const self = this;
    window.addEventListener('keydown', (e) => {
      if (e.key === ' ') {
        e.preventDefault();
        self.toggle();
      }
    });
  },

  toggle() {
    if (!this.running) {
      if (this.game.onStart) this.game.onStart(this);
      this.running = true;
      this.setStatus('进行中');
    } else {
      if (this.game.onPause) this.game.onPause(this);
      this.running = false;
      this.setStatus('已暂停');
    }
  },

  start() {
    this.running = true;
    this.setStatus('进行中');
  },

  over(text) {
    this.running = false;
    this.setStatus(text || '游戏结束');
  },
};
