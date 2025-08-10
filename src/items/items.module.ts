import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ingredient } from './entities/ingredient.entity';
import { MenuItem } from './entities/menu-item.entity';
import { FileManagerService } from 'src/common/services/file.service';

@Module({
  imports: [TypeOrmModule.forFeature([Ingredient, MenuItem])],
  controllers: [ItemsController],
  providers: [ItemsService, FileManagerService],
})
export class ItemsModule {}
