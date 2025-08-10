import { AppBaseEntity } from 'src/common/entities';
import { Column, Entity, ManyToMany } from 'typeorm';
import { MenuItem } from './menu-item.entity';

@Entity('ingredients')
export class Ingredient extends AppBaseEntity {
  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 500, nullable: false })
  description: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  image: string;

  @ManyToMany(() => MenuItem, (menuItem) => menuItem.ingredients)
  menuItems: MenuItem[];
}
