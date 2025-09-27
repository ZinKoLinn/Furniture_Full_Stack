import type { Cart } from "@/types";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import Editable from "@/components/carts/Editable";

interface CartProps {
  cart: Cart;
}

function CartItem({ cart }: CartProps) {
  return (
    <div className="space-y-3">
      <div className="mt-4 mb-2 flex gap-4">
        <img
          src={cart.image.url}
          alt="cart pic"
          loading="lazy"
          className="w-16 object-cover"
        />
        <div className="flex flex-col space-y-1">
          <span className="line-clamp-1 text-sm font-medium">{cart.name}</span>
          <span className="text-muted-foreground text-xs">
            {formatPrice(cart.price)} x {formatPrice(cart.quantity)} ={" "}
            {formatPrice((cart.price * cart.quantity).toFixed(2))}
          </span>
          <span className="text-muted-foreground line-clamp-1 text-xs capitalize">{`${cart.category} / ${cart.subcategory}`}</span>
        </div>
      </div>
      <Editable />
      <Separator />
    </div>
  );
}

export default CartItem;
