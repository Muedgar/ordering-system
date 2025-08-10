import { AppBaseEntity } from 'src/common/entities';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { Ingredient } from './ingredient.entity';

@Entity('menuitems')
export class MenuItem extends AppBaseEntity {
  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  price: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  image: string;

  @ManyToMany(() => Ingredient, (ingredient) => ingredient.menuItems)
  @JoinTable({
    name: 'menuitem_ingredients',
    joinColumn: {
      name: 'menuitem_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'ingredient_id',
      referencedColumnName: 'id',
    },
  })
  ingredients: Ingredient[];
}
