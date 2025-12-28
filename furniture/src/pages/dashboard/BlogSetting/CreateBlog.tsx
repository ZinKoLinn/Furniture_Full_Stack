import { useNavigation, useSubmit } from "react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(5),
  body: z.string().min(5),
  category: z.string().min(1),
  type: z.string().min(1),
  image: z.any,
});

export default function CreateBlog() {
  const submit = useSubmit();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  // react-hook-form setup
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      body: "",
      category: "",
      type: "",
      image: undefined,
    },
  });

  const onSubmit = (values: any) => {
    //console.log("Submitting:", values);
    submit(values, { method: "POST", action: "/dashboard/create-blog" });
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-4">
      <div className="jsutify-center w-full items-center">
        <div className="mb-6 text-center text-2xl font-bold">
          Creating a post...
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-3/5 items-center justify-center space-y-6"
          >
            {/* TITLE */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl font-semibold">
                    Blog Title
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter title" {...field} />
                  </FormControl>
                  <FormDescription className="font-medium">
                    Write a title for your post
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* CONTENT */}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl font-semibold">
                    Post Content
                  </FormLabel>
                  <FormControl>
                    <Textarea rows={4} placeholder="Summary…" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* BODY */}
            <FormField
              control={form.control}
              name="body"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl font-semibold">
                    Post Body
                  </FormLabel>
                  <FormControl>
                    <Textarea rows={4} placeholder="Full text…" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* IMAGE SELECT */}
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl font-semibold">
                    Choose an image
                  </FormLabel>

                  <FormControl>
                    <Input
                      type="file"
                      placeholder="Choose file…"
                      onChange={(e) => field.onChange(e.target.files?.[0])}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* CATEGORY SELECT */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl font-semibold">
                    Choose a category
                  </FormLabel>

                  <FormControl>
                    <Input placeholder="Cateogry…" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* TYPE SELECT */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl font-semibold">
                    Choose a type
                  </FormLabel>

                  <FormControl>
                    <Input placeholder="Type…" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* SUBMIT BUTTON */}
            <Button type="submit" className="w-full">
              {isSubmitting ? "Submitting..." : "Create Blog"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
