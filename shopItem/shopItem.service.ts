import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ShopItemDocument } from 'models/shopItem.schema';
import { Model } from 'mongoose';

@Injectable()
export class ShopItemService {
  constructor(
    @InjectModel('ShopItem')
    private readonly shopItemModel: Model<ShopItemDocument>,
  ) {}

  async createShopItem(
    shopItemData: Partial<ShopItemDocument>,
  ): Promise<ShopItemDocument> {
    const createdItem = new this.shopItemModel(shopItemData);
    return createdItem.save();
  }

  async getShopItemById(itemId: string): Promise<ShopItemDocument | null> {
    return this.shopItemModel.findById(itemId).exec();
  }
}
