/** ショップアイテム */
export type ShopItem = {
  id: string;
  type: 'color_pack' | 'unit_slot' | 'deck_slot' | 'gem_pack' | 'ad_removal';
  name: string;
  description: string;
  priceType: 'coins' | 'gems' | 'real_money';
  price: number;
  contents: ShopItemContent[];
  available: boolean;
  purchaseLimit: number;
  purchasedCount: number;
};

export type ShopItemContent = {
  type: 'color' | 'coins' | 'gems' | 'unit_slot' | 'deck_slot';
  id?: string;
  amount: number;
};

/** IAP商品定義 */
export type IAPProduct = {
  productId: string;
  name: string;
  price: string;
  gems: number;
  bonusGems: number;
  popular: boolean;
};
