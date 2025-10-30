import type { Cart } from "@/types";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import Editable from "@/components/carts/Editable";
import { useCartStore } from "@/store/cartStore";

interface CartProps {
  cart: Cart;
}

const imageUrl = import.meta.env.VITE_IMAGE_URL;

function CartItem({ cart }: CartProps) {
  const { updateItems, removeItems } = useCartStore();

  const updateHandle = (quantity: number) => {
    updateItems(cart.id, quantity);
  };
  const removeHandle = () => {
    removeItems(cart.id);
  };

  return (
    <div className="space-y-3">
      <div className="mt-4 mb-2 flex gap-4">
        <img
          src={imageUrl + cart.image}
          alt="cart pic"
          loading="lazy"
          decoding="async"
          className="w-16 object-cover"
        />
        <div className="flex flex-col space-y-1">
          <span className="line-clamp-1 text-sm font-medium">{cart.name}</span>
          <span className="text-muted-foreground text-xs">
            {formatPrice(cart.price)} x {formatPrice(cart.quantity)} ={" "}
            {formatPrice((cart.price * cart.quantity).toFixed(2))}
          </span>
        </div>
      </div>
      <Editable
        onDelete={removeHandle}
        quantity={cart.quantity}
        onUpdate={updateHandle}
      />
      <Separator />
    </div>
  );
}

export default CartItem;
