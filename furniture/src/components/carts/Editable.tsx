// import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
// import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  //FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/icons";

const quantitySchema = z.object({
  quantity: z
    .string()
    .min(1, "Must not be empty.")
    .max(4, "Too Many! Is this real?")
    .regex(/^\d+$/, "Must be a Number!"),
});

interface EditableProps {
  onDelete: () => void;
  quantity: number;
  onUpdate: (quantity: number) => void;
}

export default function Editable({
  onDelete,
  quantity,
  onUpdate,
}: EditableProps) {
  const form = useForm<z.infer<typeof quantitySchema>>({
    resolver: zodResolver(quantitySchema),
    defaultValues: {
      quantity: quantity.toString(),
    },
  });

  // function onSubmit(values: z.infer<typeof quantitySchema>) {
  //   console.log(values);
  //   //call api
  //   toast.success("Product is successfully added.");
  // }

  const { setValue, watch } = form;
  const currentQuantity = Number(watch("quantity"));

  const handleDecrese = () => {
    const newQuantity = Math.max(currentQuantity - 1, 0);
    setValue("quantity", newQuantity.toString(), { shouldValidate: true });
    onUpdate(newQuantity);
  };

  const handleIncrease = () => {
    const newQuantity = Math.min(currentQuantity + 1, 9999);
    setValue("quantity", newQuantity.toString(), { shouldValidate: true });
    onUpdate(newQuantity);
  };

  return (
    <Form {...form}>
      <form
        // onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full justify-between"
      >
        <div className="flex items-center">
          <Button
            type="button"
            size="icon"
            onClick={handleDecrese}
            disabled={currentQuantity === 0}
            variant="outline"
            className="size-8 shrink-0 rounded-r-none"
          >
            <Icons.minus className="size-3" aria-hidden="true" />
            <span className="sr-only">Remove one item</span>
          </Button>
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel className="sr-only">Quantity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    inputMode="numeric"
                    min={1}
                    {...field}
                    className="h-8 w-16 [appearance:textfield] rounded-none border-x-0 text-center [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="button"
            size="icon"
            onClick={handleIncrease}
            disabled={currentQuantity > 9999}
            variant="outline"
            className="size-8 shrink-0 rounded-l-none"
          >
            <Icons.plus className="size-3" aria-hidden="true" />
            <span className="sr-only">Add one item</span>
          </Button>
        </div>
        <Button
          type="button"
          onClick={onDelete}
          aria-label="Delete cart item"
          variant="outline"
          size="icon"
          className={"size-8"}
        >
          <Icons.trash className="size-3" aria-hidden="true" />
          <span className="sr-only">Delete item</span>
        </Button>
      </form>
    </Form>
  );
}
