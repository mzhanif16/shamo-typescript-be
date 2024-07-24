import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    OneToMany
} from 'typeorm';
import { User } from './User';
import { TransactionItem } from './TransactionItem';

@Entity()
export class Transaction {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, (user) => user.transactions)
    user!: User;

    @Column()
    address!: string;

    @Column({default: 'MANUAL'})
    payment?: string;

    @Column({default: 0})
    totalPrice?: number;

    @Column({default: 0})
    shippingPrice?: number;

    @Column({default: 'PENDING'})
    status!: string;

    @OneToMany(() => TransactionItem, (item) => item.transaction)
    items!: TransactionItem[];
}
