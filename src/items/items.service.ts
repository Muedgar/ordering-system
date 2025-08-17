import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, FindManyOptions } from 'typeorm';
import { Ingredient } from './entities/ingredient.entity';
import { MenuItem } from './entities/menu-item.entity';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateItemDto } from './dto/update-menu-item.dto';
import { BufferedFile, FilterResponse } from 'src/common/interfaces';
import { FileManagerService } from 'src/common/services/file.service';
import { v2 as cloudinary } from 'cloudinary';
import { ListFilterDTO } from 'src/common/dtos';
import { IngredientSerializer } from './serializers/ingredient.serializer';
import { ListFilterService } from 'src/common/services';
import { MenuItemSerializer } from './serializers/menu-item.serializer';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Ingredient)
    private ingredientRepository: Repository<Ingredient>,
    @InjectRepository(MenuItem)
    private menuItemRepository: Repository<MenuItem>,
    private fileManagerService: FileManagerService,
  ) {}

  // ===== INGREDIENTS =====

  async createIngredient(
    dto: CreateIngredientDto,
    image?: BufferedFile,
  ): Promise<Ingredient> {
    let publicId: string | undefined;

    if (image) {
      const { public_id } = await this.fileManagerService.uploadFile(image);
      publicId = public_id;
    }

    const ingredient = this.ingredientRepository.create({
      ...dto,
      image: publicId,
    });

    return this.ingredientRepository.save(ingredient);
  }

  async findAllIngredients(
    filters: ListFilterDTO,
  ): Promise<FilterResponse<IngredientSerializer>> {
    const listFilterService = new ListFilterService(
      this.ingredientRepository,
      IngredientSerializer,
    );

    // Use filter service with search + pagination
    const result = await listFilterService.filter({
      filters,
      searchFields: ['name', 'description'], // whatever fields you want searchable
    });

    // Map over items to add imageUrl
    const itemsWithImage = result.items.map((ingredient: Ingredient) => ({
      ...ingredient,
      imageUrl: ingredient.image
        ? cloudinary.url(ingredient.image, { secure: true })
        : undefined,
    }));

    // Return the same structure as FilterResponse but with updated items
    return {
      ...result,
      items: itemsWithImage,
    };
  }

  async findIngredientById(id: string): Promise<Ingredient> {
    const ingredient = await this.ingredientRepository.findOne({
      where: { id },
    });
    if (!ingredient) {
      throw new NotFoundException(`Ingredient with ID ${id} not found`);
    }
    return ingredient;
  }

  async updateIngredient(
    id: string,
    dto: CreateIngredientDto,
  ): Promise<Ingredient> {
    const ingredient = await this.findIngredientById(id);
    Object.assign(ingredient, dto);
    return this.ingredientRepository.save(ingredient);
  }

  async deleteIngredient(id: string): Promise<void> {
    const result = await this.ingredientRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Ingredient with ID ${id} not found`);
    }
  }

  // ===== MENU ITEMS =====

  async createMenuItem(
    dto: CreateMenuItemDto,
    image: BufferedFile,
  ): Promise<MenuItem> {
    const ingredients = await this.ingredientRepository.find({
      where: { id: In(dto.ingredients) },
    });

    if (ingredients.length !== dto.ingredients.length) {
      throw new NotFoundException('One or more ingredients not found');
    }

    let publicId: string | undefined;

    if (image) {
      const { public_id } = await this.fileManagerService.uploadFile(image);
      publicId = public_id;
    }

    const menuItem = this.menuItemRepository.create({
      name: dto.name,
      price: dto.price,
      ingredients,
      image: publicId,
    });

    return this.menuItemRepository.save(menuItem);
  }

  async findAllMenuItems(filters: ListFilterDTO): Promise<any> {
    const listFilterService = new ListFilterService(
      this.menuItemRepository,
      MenuItemSerializer,
    );

    const options: FindManyOptions<MenuItem> = { relations: ['ingredients'] };

    // Use filter service with search + pagination
    const result = await listFilterService.filter({
      filters,
      searchFields: ['name', 'price'], // whatever fields you want searchable
      options,
    });

    // Map over items to add imageUrl
    const itemsWithImage = result.items.map((menuItem: MenuItem) => ({
      ...menuItem,
      imageUrl: menuItem.image
        ? cloudinary.url(menuItem.image, { secure: true })
        : undefined,
    }));

    // Return the same structure as FilterResponse but with updated items
    return {
      ...result,
      items: itemsWithImage,
    };
  }

  async findMenuItemById(id: string): Promise<any> {
    const menuItem = await this.menuItemRepository.findOne({
      where: { id },
      relations: ['ingredients'],
    });

    if (!menuItem) {
      throw new NotFoundException(`MenuItem with ID ${id} not found`);
    }

    // Add imageUrl to menu item
    const menuItemWithImage = {
      ...menuItem,
      imageUrl: menuItem.image
        ? cloudinary.url(menuItem.image, { secure: true })
        : undefined,
      ingredients: menuItem.ingredients.map((ingredient) => ({
        ...ingredient,
        imageUrl: ingredient.image
          ? cloudinary.url(ingredient.image, { secure: true })
          : undefined,
      })),
    };

    return menuItemWithImage;
  }

  async updateMenuItem(
    id: string,
    dto: UpdateItemDto,
  ): Promise<MenuItem | null> {
    // 1️⃣ Load the menu item WITH its ingredients
    const menuItem = await this.menuItemRepository.findOne({
      where: { id },
      relations: ['ingredients'],
    });

    if (!menuItem) {
      throw new NotFoundException(`MenuItem with id ${id} not found`);
    }

    // 2️⃣ Deduplicate incoming ingredient IDs
    const uniqueIngredientIds = [...new Set(dto.ingredients)];

    // 3️⃣ Fetch ingredients from DB
    const ingredients = await this.ingredientRepository.find({
      where: { id: In(uniqueIngredientIds) },
    });

    if (ingredients.length !== uniqueIngredientIds.length) {
      throw new NotFoundException('One or more ingredients not found');
    }

    // 4️⃣ Get current IDs already linked
    const currentIngredientIds = menuItem.ingredients.map((i) => i.id);

    // 5️⃣ Filter only new IDs
    const newIngredientIds = uniqueIngredientIds.filter(
      (id) => !currentIngredientIds.includes(id),
    );

    // 6️⃣ Add only new ones to the relation
    if (newIngredientIds.length > 0) {
      await this.menuItemRepository
        .createQueryBuilder()
        .relation(MenuItem, 'ingredients')
        .of(menuItem.id)
        .add(newIngredientIds);
    }

    // 7️⃣ Update only provided fields
    if (dto.name) menuItem.name = dto.name;
    if (dto.price) menuItem.price = dto.price;

    const menuResult = await this.menuItemRepository.findOne({
      where: { id },
      relations: ['ingredients'],
    });

    return menuResult;
  }

  async deleteMenuItem(id: string): Promise<void> {
    const result = await this.menuItemRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`MenuItem with ID ${id} not found`);
    }
  }
}
