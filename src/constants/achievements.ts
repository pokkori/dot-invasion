export type AchievementDef = {
  id: string;
  name: string;
  description: string;
  category: 'battle' | 'creation' | 'collection';
  rewardType: 'coins' | 'gems';
  rewardAmount: number;
};

export const ACHIEVEMENTS: AchievementDef[] = [
  // 戦闘系
  { id: 'first_blood', name: 'ファーストブラッド', description: '初めてバトルに勝利', category: 'battle', rewardType: 'coins', rewardAmount: 100 },
  { id: 'win_10', name: '十戦錬磨', description: '累計10勝', category: 'battle', rewardType: 'coins', rewardAmount: 300 },
  { id: 'win_50', name: '半百の勇者', description: '累計50勝', category: 'battle', rewardType: 'gems', rewardAmount: 20 },
  { id: 'win_100', name: '百戦百勝...？', description: '累計100勝', category: 'battle', rewardType: 'gems', rewardAmount: 50 },
  { id: 'streak_3', name: 'トリプルキル', description: '3連勝', category: 'battle', rewardType: 'coins', rewardAmount: 200 },
  { id: 'streak_10', name: 'アンストッパブル', description: '10連勝', category: 'battle', rewardType: 'gems', rewardAmount: 30 },
  { id: 'no_damage_win', name: 'パーフェクトゲーム', description: '城ノーダメージで勝利', category: 'battle', rewardType: 'gems', rewardAmount: 10 },
  { id: 'clutch_win', name: '逆転勝利', description: '城HP10%以下から勝利', category: 'battle', rewardType: 'gems', rewardAmount: 15 },
  { id: 'speed_win', name: '電光石火', description: '30秒以内に勝利', category: 'battle', rewardType: 'gems', rewardAmount: 10 },
  { id: 'all_stages', name: '全制覇', description: '全15ステージクリア', category: 'battle', rewardType: 'gems', rewardAmount: 100 },

  // 制作系
  { id: 'first_unit', name: 'はじめてのユニット', description: 'ユニットを1体作成', category: 'creation', rewardType: 'coins', rewardAmount: 50 },
  { id: 'create_5', name: 'ドットアーティスト', description: 'ユニットを5体作成', category: 'creation', rewardType: 'coins', rewardAmount: 200 },
  { id: 'create_20', name: 'ピクセルマスター', description: 'ユニットを20体作成', category: 'creation', rewardType: 'gems', rewardAmount: 15 },
  { id: 'all_red', name: '赤の信念', description: '全セル赤のユニットを作成', category: 'creation', rewardType: 'coins', rewardAmount: 100 },
  { id: 'all_blue', name: '青の誓い', description: '全セル青のユニットを作成', category: 'creation', rewardType: 'coins', rewardAmount: 100 },
  { id: 'rainbow_unit', name: 'レインボー', description: '1体に6色以上使用', category: 'creation', rewardType: 'coins', rewardAmount: 150 },
  { id: 'monochrome', name: 'モノクローム', description: '白と黒だけのユニットを作成', category: 'creation', rewardType: 'coins', rewardAmount: 100 },
  { id: 'full_grid', name: 'ノー・スペース', description: '9セル全て塗ったユニットを作成', category: 'creation', rewardType: 'coins', rewardAmount: 100 },
  { id: 'minimalist', name: 'ミニマリスト', description: '1セルだけ塗ったユニットで勝利', category: 'creation', rewardType: 'gems', rewardAmount: 20 },
  { id: 'all_classes', name: '全兵種コンプ', description: '全5兵種のユニットを各1体以上所持', category: 'creation', rewardType: 'gems', rewardAmount: 25 },

  // コレクション系
  { id: 'unlock_5_colors', name: 'カラーコレクター', description: '色を5色アンロック', category: 'collection', rewardType: 'coins', rewardAmount: 200 },
  { id: 'unlock_10_colors', name: 'パレットマスター', description: '色を10色アンロック', category: 'collection', rewardType: 'gems', rewardAmount: 15 },
  { id: 'unlock_all_colors', name: 'フルスペクトラム', description: '全21色アンロック', category: 'collection', rewardType: 'gems', rewardAmount: 50 },
  { id: 'earn_1000_coins', name: '千金の将', description: 'コイン累計1,000枚獲得', category: 'collection', rewardType: 'coins', rewardAmount: 100 },
  { id: 'earn_10000_coins', name: '万金の覇者', description: 'コイン累計10,000枚獲得', category: 'collection', rewardType: 'gems', rewardAmount: 20 },
  { id: '50_battles', name: 'ベテラン', description: '累計50戦', category: 'collection', rewardType: 'coins', rewardAmount: 300 },
  { id: '100_particles', name: 'パーティクルマニア', description: '累計パーティクル1,000個生成', category: 'collection', rewardType: 'coins', rewardAmount: 100 },
  { id: 'share_first', name: 'ソーシャルウォリアー', description: '初めてシェア', category: 'collection', rewardType: 'gems', rewardAmount: 5 },
  { id: 'daily_5', name: '毎日が戦場', description: 'デイリーチャレンジ5回達成', category: 'collection', rewardType: 'gems', rewardAmount: 10 },
  { id: 'daily_30', name: '皆勤賞', description: 'デイリーチャレンジ30回達成', category: 'collection', rewardType: 'gems', rewardAmount: 50 },
];
