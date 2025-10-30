import { Link, useSubmit, useNavigation, useActionData } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FieldDescription } from "@/components/ui/field";
import { Icons } from "../icons";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { PasswordInput } from "@/components/auth/Password-Input";
import { useState } from "react";

const FormSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be 8 digits.")
    .max(8, "Password must be 8 digits.")
    .regex(/^\d+$/, "Password must be numbers."),
  confirmpassword: z
    .string()
    .min(8, "Password must be 8 digits.")
    .max(8, "Password must be 8 digits.")
    .regex(/^\d+$/, "Password must be numbers."),
});

export function ConfirmPasswordForm({
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

  const [clientError, setClientError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      password: "",
      confirmpassword: "",
    },
  });

  function onSubmit(values: z.infer<typeof FormSchema>) {
    // console.log(values);
    if (values.password !== values.confirmpassword) {
      setClientError("Passwords do not match!");
      return;
    }
    setClientError(null);
    submit(values, { method: "POST", action: "/register/confirm-password" });
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <Link to="#" className="flex flex-col items-center gap-2 font-medium">
          <div className="flex size-8 items-center justify-center rounded-md">
            <Icons.logo className="mr-2 size-6" />
          </div>
          <span className="sr-only">Confirm Password</span>
        </Link>
        <h1 className="text-xl font-bold">Please confirm your password.</h1>
        <FieldDescription>
          Password must be 8 digits long and contain only numbers. They must
          match.
        </FieldDescription>
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center">
                      <FormLabel>Password</FormLabel>
                    </div>

                    <FormControl>
                      <PasswordInput
                        required
                        inputMode="numeric"
                        //minLength={8}
                        //maxLength={8}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmpassword"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center">
                      <FormLabel>Confirm Your Password</FormLabel>
                    </div>

                    <FormControl>
                      <PasswordInput
                        required
                        inputMode="numeric"
                        //minLength={8}
                        //maxLength={8}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {actionData && (
                <div className="flex gap-2">
                  <p className="text-sm text-red-500">{actionData?.message}</p>
                  <Link
                    to="/register"
                    className="mr-2 text-xs underline underline-offset-4"
                  >
                    Go Back to Register
                  </Link>
                </div>
              )}
              <div className="mt-6 grid gap-4">
                <div className="flex flex-col gap-3">
                  <Button type="submit" className="w-full">
                    {isSubmitting ? "Submitting..." : "Confirm"}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
