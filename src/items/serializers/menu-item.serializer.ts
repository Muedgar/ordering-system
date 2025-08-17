import { Expose, Type } from 'class-transformer';
import { BaseSerializer } from 'src/common/serializers';

export class MenuItemSerializer extends BaseSerializer {
  @Expose()
  name: string;

  @Expose()
  price: number;

  @Expose()
  image: string;

  @Expose()
  @Type(() => MenuItemSerializer)
  ingredients: MenuItemSerializer[];
}
