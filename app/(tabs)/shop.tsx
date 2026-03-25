import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { usePlayerStore } from '../../src/stores/playerStore';
import { BALANCE } from '../../src/constants/balance';

export default function ShopScreen() {
  const data = usePlayerStore(s => s.data);
  const addCoins = usePlayerStore(s => s.addCoins);
  const addGems = usePlayerStore(s => s.addGems);
  const save = usePlayerStore(s => s.save);

  const handleBuyWithCoins = async (itemName: string, cost: number) => {
    if (data.inventory.coins < cost) {
      Alert.alert('コイン不足', `${cost}コイン必要です`);
      return;
    }
    addCoins(-cost);
    await save();
    Alert.alert('購入完了', `${itemName}を購入しました！`);
  };

  const handleWatchAd = async () => {
    const today = new Date().toISOString().split('T')[0];
    const watched = data.inventory.lastAdDate === today ? data.inventory.adsWatchedToday : 0;
    if (watched >= BALANCE.MAX_ADS_PER_DAY) {
      Alert.alert('上限達成', '今日の広告視聴上限に達しました');
      return;
    }
    addGems(5);
    await save();
    Alert.alert('獲得！', '💎5ジェムを獲得しました');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>🛒 ショップ</Text>
        <Text style={styles.currency}>🪙{data.inventory.coins.toLocaleString()}  💎{data.inventory.gems}</Text>
      </View>

      {/* Gem Packs */}
      <Text style={styles.sectionTitle}>ジェムパック（課金）</Text>
      <View style={styles.gemRow}>
        {[
          { gems: 80, price: '¥160', popular: false },
          { gems: 200, price: '¥370', popular: true },
          { gems: 500, price: '¥860', popular: false },
        ].map(pack => (
          <View key={pack.gems} style={[styles.gemCard, pack.popular && styles.popularCard]}>
            <Text style={styles.gemAmount}>{pack.gems}ジェム</Text>
            <Text style={styles.gemPrice}>{pack.price}</Text>
            {pack.popular && <Text style={styles.popularBadge}>人気</Text>}
            <TouchableOpacity
              style={styles.buyButton}
              accessibilityRole="button"
              accessibilityLabel={`${pack.gems}ジェムを${pack.price}で購入${pack.popular ? ' 人気商品' : ''}`}
              accessibilityHint="App Storeの課金画面が開きます"
            >
              <Text style={styles.buyButtonText}>購入</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Color Packs */}
      <Text style={styles.sectionTitle}>カラーパック（ジェム購入）</Text>
      <View style={styles.packCard}>
        <Text style={styles.packName}>レインボーパック</Text>
        <Text style={styles.packDesc}>虹色系5色セット  ジェム50</Text>
        <TouchableOpacity
          style={styles.buyButton}
          accessibilityRole="button"
          accessibilityLabel="レインボーパックをジェム50で購入"
          accessibilityHint="虹色系5色セットを購入します"
        >
          <Text style={styles.buyButtonText}>購入</Text>
        </TouchableOpacity>
      </View>

      {/* Coin Items */}
      <Text style={styles.sectionTitle}>コインで買えるもの</Text>
      <TouchableOpacity
        style={styles.coinItem}
        onPress={() => handleBuyWithCoins('ユニット枠+5', BALANCE.UNIT_SLOT_COST)}
        accessibilityRole="button"
        accessibilityLabel={`ユニット枠を5つ追加 コイン${BALANCE.UNIT_SLOT_COST}`}
        accessibilityHint="所持できるユニット数が5枠増えます"
      >
        <Text style={styles.coinItemText}>ユニット枠 +5</Text>
        <Text style={styles.coinItemPrice}>コイン {BALANCE.UNIT_SLOT_COST}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.coinItem}
        onPress={() => handleBuyWithCoins('デッキ枠+1', BALANCE.DECK_SLOT_COST)}
        accessibilityRole="button"
        accessibilityLabel={`デッキ枠を1つ追加 コイン${BALANCE.DECK_SLOT_COST}`}
        accessibilityHint="保存できるデッキ数が1枠増えます"
      >
        <Text style={styles.coinItemText}>デッキ枠 +1</Text>
        <Text style={styles.coinItemPrice}>コイン {BALANCE.DECK_SLOT_COST}</Text>
      </TouchableOpacity>

      {/* Ad Rewards */}
      <Text style={styles.sectionTitle}>広告</Text>
      <TouchableOpacity
        style={styles.adItem}
        onPress={handleWatchAd}
        accessibilityRole="button"
        accessibilityLabel="広告を見てジェム5個を獲得する"
        accessibilityHint="動画広告を視聴するとジェムが5個もらえます"
      >
        <Text style={styles.adItemText}>広告を見てジェム5 GET</Text>
        <Text style={styles.adItemSub}>
          （本日 {data.inventory.lastAdDate === new Date().toISOString().split('T')[0] ? data.inventory.adsWatchedToday : 0}/{BALANCE.MAX_ADS_PER_DAY}回）
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A1E' },
  content: { paddingTop: 56, paddingHorizontal: 16, paddingBottom: 40 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  header: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF' },
  currency: { color: '#FFD700', fontSize: 14, fontWeight: 'bold' },
  sectionTitle: { color: '#FFD700', fontSize: 14, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
  gemRow: { flexDirection: 'row', gap: 10 },
  gemCard: {
    flex: 1, backgroundColor: '#1E1E3A', borderRadius: 10, padding: 14, alignItems: 'center',
    borderWidth: 1, borderColor: '#333366',
  },
  popularCard: { borderColor: '#FFD700' },
  gemAmount: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  gemPrice: { color: '#AAAACC', fontSize: 14, marginTop: 4 },
  popularBadge: { color: '#FFD700', fontSize: 11, marginTop: 2 },
  buyButton: {
    backgroundColor: '#2266AA', borderRadius: 6, paddingVertical: 6, paddingHorizontal: 16, marginTop: 8,
  },
  buyButtonText: { color: '#FFFFFF', fontSize: 13, fontWeight: 'bold' },
  packCard: {
    backgroundColor: '#1E1E3A', borderRadius: 10, padding: 16,
    borderWidth: 1, borderColor: '#333366',
  },
  packName: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  packDesc: { color: '#AAAACC', fontSize: 13, marginTop: 4 },
  coinItem: {
    backgroundColor: '#1E1E3A', borderRadius: 8, padding: 14, marginBottom: 8,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderWidth: 1, borderColor: '#333366',
  },
  coinItemText: { color: '#FFFFFF', fontSize: 14 },
  coinItemPrice: { color: '#FFD700', fontSize: 14 },
  adItem: {
    backgroundColor: '#1E1E3A', borderRadius: 8, padding: 14,
    alignItems: 'center', borderWidth: 1, borderColor: '#333366',
  },
  adItemText: { color: '#FFFFFF', fontSize: 15, fontWeight: 'bold' },
  adItemSub: { color: '#888899', fontSize: 12, marginTop: 4 },
});
