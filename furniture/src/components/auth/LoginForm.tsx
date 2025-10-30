import { Link, useSubmit, useNavigation, useActionData } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  //FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FieldSeparator } from "../ui/field";
import { PasswordInput } from "./Password-Input";

const FormSchema = z.object({
  phone: z
    .string()
    .min(7, "Phone Number is too short.")
    .max(12, "Phone Number is too long.")
    .regex(/^\d+$/, "Phone Number must be numbers."),
  password: z
    .string()
    .min(8, "Password must be 8 digits.")
    .max(8, "Password must be 8 digits.")
    .regex(/^\d+$/, "Password must be numbers."),
});

export default function LoginForm() {
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
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof FormSchema>) {
    // console.log(values);
    //call api
    submit(values, { method: "POST", action: "/login" });
  }

  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle className="2-xl mb-1">Sign In</CardTitle>
        <CardDescription>
          Enter your phone Number below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
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
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center">
                    <FormLabel>Password</FormLabel>
                    <Link
                      to="#"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </Link>
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
              <p className="text-sm text-red-500">{actionData?.message}</p>
            )}
            <div className="mt-2 grid gap-4">
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
                  {isSubmitting ? "Submitting..." : "Sign In"}
                </Button>
                <FieldSeparator className="my-2">
                  Or continue with
                </FieldSeparator>
                <Button variant="outline" className="w-full">
                  Login with Google
                </Button>
              </div>
            </div>
          </form>
        </Form>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="underline underline-offset-4">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
