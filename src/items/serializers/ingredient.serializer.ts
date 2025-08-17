import { Expose } from 'class-transformer';
import { BaseSerializer } from 'src/common/serializers';

export class IngredientSerializer extends BaseSerializer {
  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  image: string;
}
