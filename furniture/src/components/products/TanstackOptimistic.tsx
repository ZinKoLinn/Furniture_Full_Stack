import { useIsFetching, useMutation } from "@tanstack/react-query";

import { Button, type ButtonProps } from "@/components/ui/button";
import { Icons } from "../icons";
import { cn } from "@/lib/utils";
import api from "@/api";
import { queryClient } from "@/api/query";

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
  const fetching = useIsFetching();
  let favourite = isFavourite;

  const { isPending, mutate } = useMutation({
    mutationFn: async () => {
      const data = {
        productId: +productId,
        favourite: !isFavourite,
      };

      const response = await api.patch("users/products/toggle-favourite", data);
      if (response.status !== 200) {
        console.log(response.data);
      }
      return response.data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["products", "details", productId],
      });
    },
  });

  if (isPending || fetching) {
    favourite = !isFavourite;
  }

  return (
    <Button
      variant="secondary"
      size="icon"
      title={favourite ? "Remove from favourite?" : "Add to favourite?"}
      onClick={() => mutate()}
      className={cn("size-8 shrink-0", className)}
      {...props}
    >
      {favourite ? (
        <Icons.heartfill className="size-4 text-pink-400" />
      ) : (
        <Icons.heart className="size-4 text-pink-400" />
      )}
    </Button>
  );
}

export default AddToFavourite;
