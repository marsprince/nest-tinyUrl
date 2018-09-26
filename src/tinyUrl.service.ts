import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TinyUrl } from './tinyUrl.entity';
import { TinyUrlOptionsInterface } from './tinyUrlOptions.interface';
import { DatabaseEnum } from './database.enum';

@Injectable()
export class TinyUrlService {
  private alphabet: string = '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ';
  private options: TinyUrlOptionsInterface = {};
  private start: number = 656356768;
  private redis_seconds: number = DatabaseEnum.TYPEORM_REDIS_SECONDS;

  constructor(
    @InjectRepository(TinyUrl)
    private readonly tinyUrlRepository: Repository<TinyUrl>) {
  }

  config(options: TinyUrlOptionsInterface) {
    this.options = options;
    this.redis_seconds = this.options.redis_seconds || DatabaseEnum.TYPEORM_REDIS_SECONDS;
  }

  /**
   * generate shortUrl based input
   * 1.first query if database has longUrl
   * 2.if have,then get
   * 3.if not have then generate a tinyUrl based id
   * @param url
   * @returns {string}
   */

  async generateShortUrl(url: string): Promise<string> {
    const existTinyUrl = await this.getTinyUrlByUrl(url);
    if (existTinyUrl.length === 0) {
      const tinyUrl = new TinyUrl({
        url,
      });
      // if database is null,start from a number
      const isExist = await this.getOne();
      if (!isExist) {
        await this.tinyUrlRepository.query(`alter table tiny_url AUTO_INCREMENT = ${this.options.start || this.start}`);
      }
      const firstSaveResult = await this.tinyUrlRepository.save(tinyUrl);
      tinyUrl.short_url = this.generate(firstSaveResult.id);
      await this.tinyUrlRepository.update(firstSaveResult.id, tinyUrl);
      return tinyUrl.short_url;
    } else {
      return existTinyUrl[0].short_url;
    }
  }

  generate(id: number): string {
    const bs58 = require('base-x')(this.options.alphabet || this.alphabet);
    return bs58.encode([id]);
  }

  async getUrlByShortUrl(shortUrl: string): Promise<string> {
    const result = await this.tinyUrlRepository.find({
      where: { short_url: shortUrl },
      cache: {
        id: `tinyUrl.shortUrl:${shortUrl}`,
        milliseconds: this.redis_seconds,
      },
    });
    return result.length === 0 ? '' : result[0].url;
  }

  async getTinyUrlByUrl(url: string): Promise<TinyUrl[]> {
    return await this.tinyUrlRepository.find({
      where: { url },
      cache: {
        id: `tinyUrl.url:${url}`,
        milliseconds: this.redis_seconds,
      },
    });
  }

  async getOne(): Promise<TinyUrl> {
    return await this.tinyUrlRepository.findOne({
      cache: this.redis_seconds,
    });
  }
}