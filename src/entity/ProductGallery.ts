import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne
  } from 'typeorm';
import { Product } from './Product';
  
  @Entity()
  export class ProductGallery {
    @PrimaryGeneratedColumn()
      id!: number;
  
    @ManyToOne(() => Product, (product) => product.galleries)
    product!: Product;
  
    @Column()
      url!: string;
  
    getUrlAttribute(): string {
      return `${process.env.APP_URL}/${this.url}`;
    }
  }
  