import { Role } from './role.entity';
import { BaseRepository } from '../base/base.repository';

export class RoleRepository extends BaseRepository<Role> {
  private readonly DEFAULT_ROLE = 'user';

  public async getDefaultRole() {
    const role = this.findOne({ name: this.DEFAULT_ROLE });
    return role || this.create({ name: this.DEFAULT_ROLE });
  }
}
