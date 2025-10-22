import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { StringEntity } from './entities/string.entity';
import { FilterQuery, Model } from 'mongoose';
import { createHash } from 'crypto';
import {
  CreateStringDto,
  StringQueryDto,
  StringResponseDto,
  StringListResponseDto,
  StringNaturalQueryListResponseDto,
} from './dto';

@Injectable()
export class StringsService {
  constructor(
    @InjectModel(StringEntity.name)
    private model: Model<StringEntity>,
  ) {}

  private logger = new Logger(StringsService.name);

  private analyzeString(value: string) {
    const cleaned = value.toLowerCase().replace(/\s+/g, '');
    const is_palindrome = cleaned === cleaned.split('').reverse().join('');
    const unique_characters = new Set(value).size;
    const word_count = value.trim().split(/\s+/).length;
    const sha256_hash = createHash('sha256').update(value).digest('hex');
    const character_frequency_map = [...value].reduce<Record<string, number>>(
      (acc, c) => {
        acc[c] = (acc[c] || 0) + 1;
        return acc;
      },
      {},
    );

    return {
      length: value.length,
      is_palindrome,
      unique_characters,
      word_count,
      sha256_hash,
      character_frequency_map,
    };
  }

  private validateQuery(query: StringQueryDto) {
    if (
      query.min_length &&
      query.max_length &&
      query.min_length > query.max_length
    ) {
      throw new UnprocessableEntityException(
        'Conflicting filters: min_length cannot be greater than max_length',
      );
    }

    if (query.word_count && query.word_count < 0) {
      throw new UnprocessableEntityException('Invalid word_count filter');
    }
  }

  async create(dto: CreateStringDto): Promise<StringResponseDto> {
    if (typeof dto.value !== 'string')
      throw new BadRequestException('Invalid value type');
    const exists = await this.model.findOne({ value: dto.value });
    if (exists) throw new ConflictException('String already exists');

    const props = this.analyzeString(dto.value);

    const created = await this.model.create({
      value: dto.value,
      ...props,
    });

    this.logger.log('New String created');

    return new StringResponseDto(created);
  }

  private async filter(query: StringQueryDto) {
    const filters: FilterQuery<StringEntity> = {};
    if (query?.is_palindrome) filters.is_palindrome = query.is_palindrome;
    if (query?.min_length || query?.max_length) {
      filters.length = {
        ...(query.min_length && { $gte: Number(query.min_length) }),
        ...(query.max_length && { $lte: Number(query.max_length) }),
      };
    }
    if (query?.word_count) filters.word_count = query.word_count;
    if (query?.contains_character)
      filters.value = new RegExp(query.contains_character, 'i');

    const data = await this.model.find(filters);
    return data;
  }

  async findAll(query: StringQueryDto): Promise<StringListResponseDto> {
    this.validateQuery(query);
    const data = await this.filter(query);
    return new StringListResponseDto(data, query);
  }

  async findOne(value: string): Promise<StringResponseDto> {
    const exists = await this.model.findOne({ value });
    if (!exists) throw new NotFoundException('String not found');
    return new StringResponseDto(exists);
  }

  async remove(value: string) {
    const deleted = await this.model.findOneAndDelete({ value });
    if (!deleted)
      throw new NotFoundException('String does not exit in the system');

    this.logger.log('String deleted');
    return;
  }

  async filterByNaturalLanguage(query: string) {
    const nQuery = this.parseNaturalLanguageQuery(query);
    this.validateQuery(nQuery);

    const data = await this.filter(nQuery);

    return new StringNaturalQueryListResponseDto(data, query, nQuery);
  }

  private parseNaturalLanguageQuery(query: string): StringQueryDto {
    if (!query) throw new BadRequestException('Missing query parameter');
    const q = query.toLowerCase().trim();
    const nQuery: StringQueryDto = {};

    if (q.includes('palindromic') || q.includes('palindrome')) {
      nQuery.is_palindrome = true;
    }

    if (q.includes('single word')) {
      nQuery.word_count = 1;
    }

    const longerThanMatch = q.match(/longer than (\d+) characters?/);
    if (longerThanMatch) {
      nQuery.min_length = parseInt(longerThanMatch[1]);
    }

    const shorterThanMatch =
      q.match(/shorter than (\d+) characters?/) ||
      q.match(/less than (\d+) characters?/) ||
      q.match(/less than (\d+) letters?/) ||
      q.match(/shorter than (\d+) letters?/);
    if (shorterThanMatch) {
      nQuery.max_length = parseInt(shorterThanMatch[1]);
    }

    const containsLetterMatch =
      q.match(/containing the letter ([a-z])/) ||
      q.match(/contains the letter ([a-z])/) ||
      q.match(/contain the letter ([a-z])/) ||
      q.match(/contains ([a-z])/);
    if (containsLetterMatch) {
      nQuery.contains_character = containsLetterMatch[1];
    }

    const vowelMatch = q.match(/first vowel/);
    if (vowelMatch) {
      nQuery.contains_character = 'a';
    }

    if (Object.keys(nQuery).length === 0)
      throw new BadRequestException('Invalid query');

    return nQuery;
  }
}
