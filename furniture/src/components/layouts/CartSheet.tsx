import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Icons } from "@/components/icons";
// import { cartItems } from "@/data/carts";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "react-router";
import CartItem from "@/components/carts/CartItem";
import { formatPrice } from "@/lib/utils";

export default function CartSheet() {
  // const itemCount = 4;
  // const amountTotal = 190;

  const itemCount = useCartStore((state) => state.getTotalQuantity());
  const amountTotal = useCartStore((state) => state.getTotalPrice());
  const { carts } = useCartStore();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          {itemCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 size-6 justify-center rounded-full px-2.5"
            >
              {itemCount}
            </Badge>
          )}
          <Icons.cart className="size-4" aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full px-4 md:max-w-lg">
        <SheetHeader className="items-center">
          <SheetTitle>
            {itemCount > 0 ? `Cart-${itemCount}` : "Empty Cart"}
          </SheetTitle>
        </SheetHeader>
        <Separator />
        {carts.length > 0 ? (
          <>
            <ScrollArea className="h-[68vh] pb-8">
              {carts.map((cart) => (
                <CartItem cart={cart} key={cart.id} />
              ))}
            </ScrollArea>
            <div className="space-y-4">
              <Separator />
              <div className="sapce-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="flex justify-between">
                  <span>Total</span>
                  <span>{formatPrice(amountTotal.toFixed(2))}</span>
                </div>
              </div>

              <SheetFooter>
                <SheetClose asChild>
                  <Button type="submit" asChild>
                    <Link to="/checkout" aria-label="checkout">
                      Continue to checkout
                    </Link>
                  </Button>
                </SheetClose>
              </SheetFooter>
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center space-y-1">
            <Icons.cart className="text-muted-foreground mb-4 size-16" />
            <div className="text-muted-foreground text-xl font-medium">
              Your cart is empty.
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
