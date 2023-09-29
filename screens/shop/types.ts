export interface ShopInput {
  name: string;
  image: string;
  price: string;
}

export interface ShopItem {
  name: string;
  image: string;
  price: string;
  _id: string;
}

export interface ShopData {
  _id: string;
  title: string;
  owner: string;
  image: string;
  shopItems: Array<ShopItem>;
}
