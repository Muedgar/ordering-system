/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ItemsService } from './items.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { BufferedFile } from 'src/common/interfaces';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Items')
@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  // ===== INGREDIENTS =====

  @Post('ingredients')
  @ApiOperation({ summary: 'Create a new ingredient' })
  @UseInterceptors(FileInterceptor('image'))
  async createIngredient(
    @Body() dto: CreateIngredientDto,
    @UploadedFile() image: BufferedFile,
  ) {
    const imageFile = image;
    return this.itemsService.createIngredient(dto, imageFile);
  }

  @Get('ingredients')
  @ApiOperation({ summary: 'Get all ingredients' })
  async findAllIngredients() {
    return this.itemsService.findAllIngredients();
  }

  @Get('ingredients/:id')
  @ApiOperation({ summary: 'Get ingredient by ID' })
  async findIngredientById(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    return this.itemsService.findIngredientById(id);
  }

  @Patch('ingredients/:id')
  @ApiOperation({ summary: 'Update ingredient' })
  async updateIngredient(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: CreateIngredientDto,
  ) {
    return this.itemsService.updateIngredient(id, dto);
  }

  @Delete('ingredients/:id')
  @ApiOperation({ summary: 'Delete ingredient' })
  async deleteIngredient(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    return this.itemsService.deleteIngredient(id);
  }

  // ===== MENU ITEMS =====

  @Post('menu')
  @ApiOperation({ summary: 'Create a new menu item' })
  @UseInterceptors(FileInterceptor('image'))
  async createMenuItem(
    @Body() dto: CreateMenuItemDto,
    @UploadedFile() image: BufferedFile,
  ) {
    return this.itemsService.createMenuItem(dto, image);
  }

  @Get('menu')
  @ApiOperation({ summary: 'Get all menu items' })
  async findAllMenuItems() {
    return this.itemsService.findAllMenuItems();
  }

  @Get('menu/:id')
  @ApiOperation({ summary: 'Get menu item by ID' })
  async findMenuItemById(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    return this.itemsService.findMenuItemById(id);
  }

  @Patch('menu/:id')
  @ApiOperation({ summary: 'Update menu item' })
  async updateMenuItem(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: CreateMenuItemDto,
  ) {
    return this.itemsService.updateMenuItem(id, dto);
  }

  @Delete('menu/:id')
  @ApiOperation({ summary: 'Delete menu item' })
  async deleteMenuItem(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    return this.itemsService.deleteMenuItem(id);
  }
}
