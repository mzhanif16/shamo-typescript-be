import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne
  } from 'typeorm';
import { Product } from './Product';
import { Transaction } from './Transaction';
  @Entity()
  export class TransactionItem {
    @PrimaryGeneratedColumn()
      id!: number;
  
    @Column()
      usersId!: number;
  
    @ManyToOne(() => Product, (product) => product.id)
    product!: Product;
  
    @ManyToOne(() => Transaction, (transaction) => transaction.id)
      transaction!: Transaction;
  
    @Column()
      quantity!: number;
  }
  