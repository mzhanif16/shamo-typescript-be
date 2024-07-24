import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    OneToMany
  } from 'typeorm';
import { ProductCategory } from './ProductCategory';
import { ProductGallery } from './ProductGallery';
  
  @Entity()
  export class Product {
    @PrimaryGeneratedColumn()
      id!: number;
  
    @Column()
      name!: string;
  
    @Column()
      description!: string;
  
    @Column()
      price!: number;
  
    @ManyToOne(() => ProductCategory, (category) => category.products)
    category!: ProductCategory;
  
    @OneToMany(() => ProductGallery, (gallery) => gallery.product)
      galleries!: ProductGallery[];
  
    @Column()
      tags!: string;
  }
  