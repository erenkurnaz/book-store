import { IsString } from 'class-validator';
import { Store } from '../../../../database/store';

export class StoreCreateDto implements Pick<Store, 'name'> {
  @IsString()
  name: string;
}
