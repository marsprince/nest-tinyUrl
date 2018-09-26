import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { autoCreateAndUpdate } from './decorator';

@Entity()
@autoCreateAndUpdate()
export class TinyUrl {
  constructor(tinyUrl?: TinyUrl) {
    for (const k in tinyUrl) {
      if (tinyUrl.hasOwnProperty(k)) {
        this[k] = tinyUrl[k];
      }
    }
  }

  @PrimaryGeneratedColumn()
  id?: number;

  @Column('text')
  url: string;

  @Column('varchar', { length: 8, nullable: true })
  short_url?: string;
}