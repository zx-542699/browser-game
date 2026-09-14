/* ===== 示例游戏：贪吃蛇 =====
 * 这是框架的"样板间"，证明一切能跑。
 * 想换游戏？新建 js/xxx.js 实现 init/update/render/onKey/onSwipe/onStart，
 * 然后改 index.html 里的 script 标签即可。
 */
const snakeGame = {
  grid: 24,          // 24x24 格子
  cell: 20,          // 每格像素
  snake: [],
  dir: { x: 1, y: 0 },
  nextDir: { x: 1, y: 0 },
  food: null,
  score: 0,
  tick: 0,

  init(g) {
    this.reset(g);
  },

  reset(g) {
    this.snake = [{ x: 12, y: 12 }];
    this.dir = { x: 1, y: 0 };
    this.nextDir = { x: 1, y: 0 };
    this.score = 0;
    this.tick = 0;
    g.setScore(0);
    this.spawnFood();
  },

  spawnFood() {
    let p;
    do {
      p = { x: Math.floor(Math.random() * this.grid), y: Math.floor(Math.random() * this.grid) };
    } while (this.snake.some(s => s.x === p.x && s.y === p.y));
    this.food = p;
  },

  onKey(key) {
    const map = {
      ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 },
      ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 },
      w: { x: 0, y: -1 }, s: { x: 0, y: 1 },
      a: { x: -1, y: 0 }, d: { x: 1, y: 0 },
    };
    const nd = map[key];
    if (!nd) return;
    if (nd.x === -this.dir.x && nd.y === -this.dir.y) return; // 不能掉头
    this.nextDir = nd;
  },

  onSwipe(dx, dy) {
    if (Math.abs(dx) > Math.abs(dy)) this.onKey(dx > 0 ? 'ArrowRight' : 'ArrowLeft');
    else this.onKey(dy > 0 ? 'ArrowDown' : 'ArrowUp');
  },

  onStart(g) {
    if (this.snake.length === 1 && this.score === 0) this.reset(g);
  },

  update(g) {
    if (!g.running) return;
    this.tick++;
    if (this.tick % 8 !== 0) return;  // 控制速度

    this.dir = this.nextDir;
    const head = { x: this.snake[0].x + this.dir.x, y: this.snake[0].y + this.dir.y };

    // 撞墙或撞自己 → 结束
    if (head.x < 0 || head.y < 0 || head.x >= this.grid || head.y >= this.grid ||
        this.snake.some(s => s.x === head.x && s.y === head.y)) {
      g.over('游戏结束！按空格重开');
      this.reset(g);
      return;
    }

    this.snake.unshift(head);
    if (head.x === this.food.x && head.y === this.food.y) {
      this.score += 10;
      g.setScore(this.score);
      this.spawnFood();
    } else {
      this.snake.pop();
    }
  },

  render(g) {
    const ctx = g.ctx;
    const size = this.cell;
    // 背景
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, 480, 480);
    // 网格线
    ctx.strokeStyle = '#273449';
    ctx.lineWidth = 1;
    for (let i = 0; i <= this.grid; i++) {
      ctx.beginPath(); ctx.moveTo(i * size, 0); ctx.lineTo(i * size, 480); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i * size); ctx.lineTo(480, i * size); ctx.stroke();
    }
    // 食物
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(this.food.x * size + size / 2, this.food.y * size + size / 2, size / 2 - 3, 0, Math.PI * 2);
    ctx.fill();
    // 蛇
    this.snake.forEach((s, i) => {
      ctx.fillStyle = i === 0 ? '#22c55e' : '#4ade80';
      ctx.fillRect(s.x * size + 1, s.y * size + 1, size - 2, size - 2);
    });
  },
};

// 启动游戏
Game.init(snakeGame);
