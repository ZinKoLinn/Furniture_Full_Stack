import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { Category } from "@/types";
import { useFilterStore } from "@/store/filterStore";

interface FilterProps {
  categories: Category[];
  types: Category[];
}

interface ProductFilterProps {
  filterList: FilterProps;
  selectedCategory: string[];
  selectedType: string[];
  onFilterChange: (categories: string[], types: string[]) => void;
}

const FormSchema = z.object({
  categories: z.array(z.string()),
  // .refine((value) => value.some((item) => item), {
  //   message: "You have to select at least one category.",
  // }),
  types: z.array(z.string()),
  // .refine((value) => value.some((item) => item), {
  //   message: "You have to select at least one type.",
  // }),
});

export function ProductFilter({
  filterList,
  selectedCategory,
  selectedType,
  onFilterChange,
}: ProductFilterProps) {
  const stateCategory = useFilterStore((state) => state.category);
  const stateType = useFilterStore((state) => state.type);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      categories: stateCategory ? stateCategory : selectedCategory,
      types: stateType ? stateType : selectedType,
    },
  });

  const { setFilter, clearFilter } = useFilterStore();

  const { setValue } = form;

  const resetFilter = () => {
    setValue(
      "categories",
      filterList.categories.flatMap((cat) => cat.name),
      { shouldValidate: true },
    );
    setValue(
      "types",
      filterList.types.flatMap((typ) => typ.name),
      { shouldValidate: true },
    );
    clearFilter();
  };

  function onSubmit(data: z.infer<typeof FormSchema>) {
    //console.log("Submit data ... ", data);
    setFilter(data.categories, data.types);
    onFilterChange(data.categories, data.types);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="categories"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Furnitures Made By</FormLabel>
              </div>
              {filterList.categories.map((item) => (
                <FormField
                  key={item.id}
                  control={form.control}
                  name="categories"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={item.id}
                        className="flex flex-row items-center gap-2"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item.id.toString())}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([
                                    ...field.value,
                                    item.id.toString(),
                                  ])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== item.id.toString(),
                                    ),
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          {item.name}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="types"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Furnitures Types</FormLabel>
              </div>
              {filterList.types.map((item) => (
                <FormField
                  key={item.id}
                  control={form.control}
                  name="types"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={item.id}
                        className="flex flex-row items-center gap-2"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item.id.toString())}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([
                                    ...field.value,
                                    item.id.toString(),
                                  ])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== item.id.toString(),
                                    ),
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          {item.name}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-4">
          <Button type="submit" variant="outline">
            Filter
          </Button>
          <Button type="button" onClick={resetFilter} variant="outline">
            Reset
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default ProductFilter;
