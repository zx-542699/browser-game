/**
 * 入口文件 —— 只负责"装配"
 *
 * 启动流程：
 *   ui.init() 会读取存档/显示创建页，然后开始游戏
 * 各模块通过事件总线解耦，互不直接依赖。
 */
import { ui } from './ui/ui.js';

// 等 DOM 加载完再启动
document.addEventListener('DOMContentLoaded', () => {
  ui.init();
});
