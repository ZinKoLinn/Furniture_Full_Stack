import { Link, useActionData, useNavigation, useSubmit } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FieldDescription } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Icons } from "../icons";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

const FormSchema = z.object({
  phone: z
    .string()
    .min(7, "Phone Number is too short.")
    .max(12, "Phone Number is too long.")
    .regex(/^\d+$/, "Phone Number must be numbers."),
});

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const submit = useSubmit();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const actionData = useActionData() as {
    error?: string;
    message?: string;
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      phone: "",
    },
  });

  function onSubmit(values: z.infer<typeof FormSchema>) {
    // console.log(values);
    //call api
    submit(values, { method: "POST", action: "." });
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <Link to="#" className="flex flex-col items-center gap-2 font-medium">
          <div className="flex size-8 items-center justify-center rounded-md">
            <Icons.logo className="mr-2 size-6" />
          </div>
          <span className="sr-only">Furniture Shop</span>
        </Link>
        <h1 className="text-xl font-bold">Reset Password.</h1>
        <div className="text-center text-sm">
          Remember Your Password?
          <Link to="/login" className="ml-1 underline underline-offset-4">
            Sign in
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-6">
        <div className="grip gap-2">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
              autoComplete="off"
            >
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="0997********"
                        required
                        inputMode="numeric"
                        //minLength={7}
                        //maxLength={12}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {actionData && (
                <p className="text-sm text-red-500">{actionData?.message}</p>
              )}
              <div className="mt-6 grid gap-4">
                <div className="flex flex-col gap-3">
                  <Button type="submit" className="w-full">
                    {isSubmitting ? "Submitting..." : "Reset"}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our
        <Link to="#" className="mr-1 ml-1">
          Terms of Service
        </Link>
        and <Link to="#">Privacy Policy</Link>.
      </FieldDescription>
    </div>
  );
}
