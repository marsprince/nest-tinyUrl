import { CreateDateColumn, UpdateDateColumn, ColumnOptions } from 'typeorm';

export const autoCreateAndUpdate = (options?: ColumnOptions) => {
  return (constructor: any) => {
    CreateDateColumn(options)(constructor.prototype, 'create_at');
    UpdateDateColumn(options)(constructor.prototype, 'update_at');
  };
};