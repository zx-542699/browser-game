/**
 * 境界配置 —— 想改境界名/所需修为，只改这里
 *
 * 每个境界：
 *   name    境界名
 *   need    突破到下一境界需要的修为
 *   bonus   突破后生命上限加成
 */
export const realms = [
  { name: '炼气',  need: 0,     bonus: 0 },
  { name: '筑基',  need: 100,   bonus: 50 },
  { name: '金丹',  need: 500,   bonus: 150 },
  { name: '元婴',  need: 2000,  bonus: 400 },
  { name: '化神',  need: 8000,  bonus: 1000 },
  { name: '炼虚',  need: 30000, bonus: 2500 },
  { name: '合体',  need: 100000, bonus: 6000 },
  { name: '大乘',  need: 400000, bonus: 15000 },
  { name: '渡劫',  need: 1000000, bonus: 40000 },
  { name: '飞升',  need: 99999999, bonus: 99999 },
];
