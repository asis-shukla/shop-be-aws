import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Cart } from "./Cart";

@Entity({ name: 'cart_items' })
export class CartItem {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'uuid' })
  cart_id: string;

  @Column({ type: 'uuid' })
  product_id: string;

  @Column({ type: 'int' })
  count: number

  @Column({ type: 'float' })
  price: number

  @ManyToOne(() => Cart, (cart) => cart.cart_items)
  cart: Cart
}