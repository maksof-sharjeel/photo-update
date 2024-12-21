"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PasswordInput from "../password-input";
import Link from "next/link";
import { api } from "@/trpc-server/react";
import { checkLoginStatus } from "@/lib/utils";

const formSchema = z.object({
  email: z.string({ message: "Email is required" }).email({
    message: "Invalid email format, Please enter a valid email address.",
  }),
  password: z
    .string({ message: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters long" }),
});

type UserFormValue = z.infer<typeof formSchema>;

const LoginForm = () => {
  const { mutateAsync: loginUser, isLoading } =
    api.userAuth.login.useMutation();
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [loading , setLoading] = useState<boolean>(false);

  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  async function onSubmit(data: UserFormValue) {
    try {
      setLoading(true)
      const res = await loginUser({
        email: data.email,
        password: data.password
      });
      form.reset({
        email: "",
        password
          : "",
      });
      setLoading(false)
      const sessionToken = res.user.sessionToken;
      localStorage.setItem('sessionToken', sessionToken);
      checkLoginStatus();
    } catch (error: any) {
      console.error("Unexpected error", error);
      // if (
      //   error?.data?.code === "BAD_REQUEST" &&
      //   error?.message === "Email is already in use"
      // ) {
      //   form.setError("email", {
      //     message:
      //       "This email is already registered with us, please try again with a different email!",
      //   });
      // } else {
      //   console.error("Unexpected error", error);
      // }
    }


  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-5">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput
                  onChange={(e) => field.onChange(e)}
                  value={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit"  className="w-full" >
          Login
        </Button>
        <div>
          <p className="text-l text-center">
            Don't have an account?
            <span>
              <Link
                href="/auth/register"
                className="text-sm text-green-700 font-semibold text-left underline	hover:no-underline"
              >
                Sign Up
              </Link>
            </span>
          </p>
        </div>
      </form>
    </Form>
  );
};

export default LoginForm;
