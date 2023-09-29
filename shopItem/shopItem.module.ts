import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ShopItemController } from './shopItem.controller';
import { ShopItemService } from './shopItem.service';
import { shopItemSchema } from 'models/shopItem.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'ShopItem', schema: shopItemSchema }]),
  ],
  controllers: [ShopItemController],
  providers: [ShopItemService],
})
export class ShopItemModule {}
