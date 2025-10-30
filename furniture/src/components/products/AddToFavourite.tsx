import { Button, type ButtonProps } from "@/components/ui/button";
import { Icons } from "../icons";
import { cn } from "@/lib/utils";
import { useFetcher } from "react-router";

interface FavouriteProps extends ButtonProps {
  productId: string;
  rating: number;
  isFavourite: boolean;
}

function AddToFavourite({
  productId,
  rating,
  className,
  isFavourite,
  ...props
}: FavouriteProps) {
  const fetcher = useFetcher({ key: `product:${productId}` });

  let favourite = isFavourite;
  if (fetcher.formData) {
    favourite = fetcher.formData.get("favourite") === "true";
  }

  return (
    <fetcher.Form method="post">
      <Button
        variant="secondary"
        size="icon"
        name="favourite"
        value={favourite ? "false" : "true"}
        title={favourite ? "Remove from favourite?" : "Add to favourite?"}
        className={cn("size-8 shrink-0", className)}
        {...props}
      >
        {favourite ? (
          <Icons.heartfill className="size-4 text-pink-400" />
        ) : (
          <Icons.heart className="size-4 text-pink-400" />
        )}
      </Button>
    </fetcher.Form>
  );
}

export default AddToFavourite;
