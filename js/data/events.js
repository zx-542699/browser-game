/**
 * 历练事件配置 —— 想加新事件，只改这里
 *
 * 每个事件：
 *   weight   权重（越大越容易遇到）
 *   text     事件描述
 *   effects  效果，可选：
 *     exp    获得修为
 *     stone  获得灵石
 *     hp     生命变化（正数回复，负数受伤）
 *     item   获得物品（现在只有 pill 丹药）
 */
export const events = [
  {
    weight: 30,
    text: '你在山洞中发现一株百年灵草，吞服后灵气涌入体内。',
    effects: { exp: 15 },
  },
  {
    weight: 20,
    text: '你遇到一头低阶妖兽，一番苦战将它击退。',
    effects: { exp: 25, hp: -10 },
  },
  {
    weight: 15,
    text: '你在一处遗迹里找到几块灵石。',
    effects: { stone: 10 },
  },
  {
    weight: 10,
    text: '你帮一位老修士找到了丢失的葫芦，他赠你一颗聚灵丹。',
    effects: { item: 'pill' },
  },
  {
    weight: 10,
    text: '你打坐调息片刻，伤势稍有恢复。',
    effects: { hp: 15 },
  },
  {
    weight: 8,
    text: '你误入险地，被毒瘴所伤，仓皇逃离。',
    effects: { hp: -20, exp: 5 },
  },
  {
    weight: 7,
    text: '你撞见两派修士斗法，捡到一袋散落的灵石。',
    effects: { stone: 25, hp: -5 },
  },
];
