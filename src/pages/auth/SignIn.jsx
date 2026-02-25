import { addToast, Button, Form, Input } from "@heroui/react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useState } from "react";
import { RotatingLines } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import { authContext } from "../../context/AuthContext";

const signInSchema = z.object({
  email: z.email("Invalid email"),
  password: z
    .string("password is required")
    .regex(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
      "Password must contain at least one uppercase, one lowercase, one number, one special character and be at least 8 characters",
    ),
});

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const { setToken, setUserId } = useContext(authContext);
  const nav = useNavigate();
  const { register, handleSubmit, formState, reset } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(signInSchema),
  });
  async function handleLogin(values) {
    try {
      setLoading(true);
      const { data } = await axios.post(
        "https://route-posts.routemisr.com/users/signin",
        values,
      );
      setToken(data.data.token);
      setUserId(data.data.user._id);
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("userId", data.data.user._id);
      addToast({
        title: "Sign In success",
        description: data.message,
        color: "success",
        timeout: 2500,
      });
      reset();
      nav("/");
    } catch (error) {
      addToast({
        title: "Error",
        description: error.response.data.errors,
        color: "danger",
        timeout: 2500,
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
            onSubmit={handleSubmit(handleLogin)}
            className="w-full max-w-lg space-y-3"
          >
            <h1 className="text-center mx-auto text-3xl font-serif">Sign In</h1>

            {/* Email Input */}
            <Input
              {...register("email")}
              isInvalid={formState.errors.email}
              errorMessage={formState.errors.email?.message}
              isRequired
              label="Email"
              size="sm"
              type="email"
            />
            {/* password */}
            <Input
              {...register("password")}
              isInvalid={formState.errors.password}
              errorMessage={formState.errors.password?.message}
              isRequired
              type="password"
              size="sm"
              label="Password"
            />

            {/* Button Submit */}
            <Button type="submit" color="primary" fullWidth={true}>
              Sign In
            </Button>
          </Form>
        )}
      </div>
    </>
  );
}
