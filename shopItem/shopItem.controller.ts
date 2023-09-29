import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ShopItemService } from './shopItem.service';
import { ShopItemDocument } from 'models/shopItem.schema';

@Controller('shop-items')
export class ShopItemController {
  constructor(private readonly shopItemService: ShopItemService) {}

  @Post()
  async createShopItem(
    @Body() shopItemData: Partial<ShopItemDocument>,
  ): Promise<ShopItemDocument> {
    return this.shopItemService.createShopItem(shopItemData);
  }

  @Get(':id')
  async getShopItem(
    @Param('id') itemId: string,
  ): Promise<ShopItemDocument | null> {
    return this.shopItemService.getShopItemById(itemId);
  }
}
