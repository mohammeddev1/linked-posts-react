import {
  Alert,
  Button,
  Form,
  Input,
  Radio,
  RadioGroup,
  addToast,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { RotatingLines } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import * as z from "zod";

const signUpSchema = z
  .object({
    name: z
      .string("Please add your name")
      .min(3, "Name must be at lest 3 letters"),
    username: z
      .string("Please add your name")
      .min(3, "Username must be at lest 4 letters"),
    email: z.email("Invalid email"),
    password: z
      .string("Add your password")
      .regex(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        "Password must contain at least one uppercase, one lowercase, one number, one special character and be at least 8 characters",
      ),
    rePassword: z
      .string("Rewrite your password")
      .regex(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        "Password must contain at least one uppercase, one lowercase, one number, one special character and be at least 8 characters",
      ),
    dateOfBirth: z.string(),
    gender: z.enum(["male", "female"], "please choose your gender"),
  })
  .refine((values) => values.password == values.rePassword, {
    error: "rePassword not matched password",
    path: ["rePassword"],
  });

export default function SignUp() {
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const { register, handleSubmit, control, formState, reset } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      username: "",
      rePassword: "",
      dateOfBirth: null,
      gender: "",
    },
    resolver: zodResolver(signUpSchema),
  });
  async function handleSignUp(values) {
    try {
      setLoading(true);
      const { data } = await axios.post(
        "https://route-posts.routemisr.com/users/signup",
        values,
      );
      addToast({
        title: "Success",
        description: data.message,
        color: "success",
      });

      nav("/sign-in");
      reset();
    } catch (error) {
      addToast({
        title: "Error",
        description: error.response.data.errors,
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="flex justify-center  border border-gray-300 items-center max-w-xl w-full mx-auto bg-white rounded-2xl shadow  p-6">
        {loading ? (
          <RotatingLines
            visible={loading}
            height="56"
            width="56"
            color="blue"
            strokeWidth="5"
            animationDuration="0.75"
            ariaLabel="rotating-lines-loading"
          />
        ) : (
          <Form
            onSubmit={handleSubmit(handleSignUp)}
            className="w-full max-w-lg space-y-3"
          >
            <h1 className="text-center mx-auto text-3xl font-serif">Sign Up</h1>
            {/* Name Input */}
            <Input
              errorMessage={formState.errors.name?.message}
              isInvalid={formState.errors.name}
              {...register("name")}
              isRequired
              label="Name"
              size="sm"
              type="string"
            />
            {/* UserName Input */}
            <Input
              errorMessage={formState.errors.username?.message}
              isInvalid={formState.errors.username}
              {...register("username")}
              isRequired
              label="UserName"
              size="sm"
              type="string"
            />
            {/* Email Input */}
            <Input
              errorMessage={formState.errors.email?.message}
              isInvalid={formState.errors.email}
              {...register("email")}
              isRequired
              label="Email"
              size="sm"
              type="email"
            />
            {/* password */}
            <Input
              errorMessage={formState.errors.password?.message}
              isInvalid={formState.errors.password}
              {...register("password")}
              isRequired
              type="password"
              size="sm"
              label="Password"
            />
            {/* Repassword */}
            <Input
              errorMessage={formState.errors.rePassword?.message}
              isInvalid={formState.errors.rePassword}
              {...register("rePassword")}
              isRequired
              type="password"
              size="sm"
              label="RePassword"
            />
            {/* Date Input */}
            <Input
              {...register("dateOfBirth")}
              type="date"
              size="sm"
              label="birth date"
            />

            {/* Gender Radio */}
            <RadioGroup
              errorMessage={formState.errors.gender?.message}
              isInvalid={formState.errors.gender}
              orientation="horizontal"
              label="Select Gender"
            >
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <Radio {...field} value={"male"}>
                    Male
                  </Radio>
                )}
              />
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <Radio {...field} value={"female"}>
                    Female
                  </Radio>
                )}
              />
            </RadioGroup>
            {/* Button Submit */}
            <Button
              type="submit"
              isDisabled={loading}
              color="primary"
              fullWidth={true}
            >
              {loading ? "Loading....." : "Sign Up"}
            </Button>
          </Form>
        )}
      </div>
    </>
  );
}
