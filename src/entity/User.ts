import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany
} from 'typeorm';
import { Transaction } from './Transaction';
import jwt from 'jsonwebtoken';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({ unique: true })
    email!: string;

    @Column({ unique: true })
    username!: string;

    @Column()
    phone!: string;

    @Column({default: 'USER'})
    roles!: string;

    @Column()
    password!: string;

    @OneToMany(() => Transaction, (transaction) => transaction.user)
    transactions?: Transaction[];

    @Column({ type: 'timestamp', nullable: true })
    emailVerifiedAt?: Date;

    @Column({nullable: true})
    profilePhotoUrl?: string;

    createToken(): string {
        const payload = {
          id: this.id,
          email: this.email
        };
    
        const secretKey = '155155'; // Use a more secure key in production
        const options = {
          expiresIn: '1h', // Token expiration time
        };
    
        return jwt.sign(payload, secretKey, options);
      }
}
