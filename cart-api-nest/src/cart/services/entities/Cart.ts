import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CartItem } from "./CartItem";

@Entity({ name: 'carts' })
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date', nullable: true })
  created_at: string;

  @Column({ type: 'date', nullable: true })
  updated_at: string;

  @Column({ type: 'uuid', nullable: false })
  user_id: string;

  @OneToMany(() => CartItem, (item) => item.cart_id)
  cart_items: CartItem[]
} 