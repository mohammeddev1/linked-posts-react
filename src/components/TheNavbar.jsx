import {
  Navbar,
  NavbarBrand,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  NavbarContent,
  NavbarItem,
  Button,
  addToast,
} from "@heroui/react";
import { useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { authContext } from "../context/AuthContext";
export default function TheNavbar() {
  const { token, setToken } = useContext(authContext);
  const nav = useNavigate();
  return (
    <Navbar disableAnimation isBordered className="shadow-sm bg-white">
      <NavbarContent justify="start">
        {/* icon Bars */}
        <NavbarMenuToggle className="cursor-pointer sm:hidden" />
        {/* logo */}
        <NavbarBrand className="hidden sm:flex">
          <Link
            to="/"
            className="text-xl font-bold text-primary cursor-pointer"
          >
            LinkedPosts
          </Link>
        </NavbarBrand>
      </NavbarContent>

      {/* Links in PC */}
      {token && (
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <NavbarItem>
            <NavLink
              className={({ isActive }) =>
                `text-gray-950 transition-all font-medium p-2 px-4 rounded-lg ${
                  isActive ? "bg-blue-600 text-white" : ""
                }`
              }
              to="/"
            >
              Home
            </NavLink>
          </NavbarItem>

          <NavbarItem>
            <NavLink
              className={({ isActive }) =>
                `text-gray-950 font-medium transition-all p-2 px-4 rounded-lg ${
                  isActive ? "bg-blue-600 text-white" : ""
                }`
              }
              to={"/profile"}
            >
              Profile
            </NavLink>
          </NavbarItem>
        </NavbarContent>
      )}

      {/* Navbar buttons */}
      <NavbarContent justify="end" className="gap-2">
        {!token ? (
          <>
            <NavbarItem>
              <NavLink
                to={"/sign-in"}
                className={({ isActive }) =>
                  `text-gray-950 font-medium p-2 px-4 rounded-lg ${
                    isActive ? "bg-blue-600 text-white" : "bg-gray-200"
                  }`
                }
              >
                Sign In
              </NavLink>
            </NavbarItem>

            <NavbarItem>
              <NavLink
                to={"/sign-up"}
                className={({ isActive }) =>
                  `text-gray-950 font-medium p-2 px-4 rounded-lg ${
                    isActive ? "bg-blue-600 text-white" : "bg-gray-200"
                  }`
                }
              >
                Sign Up
              </NavLink>
            </NavbarItem>
          </>
        ) : (
          <NavbarItem>
            <Button
              onPress={() => {
                localStorage.removeItem("token");
                setToken(null);
                nav("/sign-in");
                addToast({
                  title: "Logout success",
                  description: "You can log in again",
                  color: "success",
                  timeout: 1500,
                });
              }}
              variant="solid"
              color="danger"
              className="font-medium"
            >
              Sign out
            </Button>
          </NavbarItem>
        )}
      </NavbarContent>

      {/* Links in Mobile */}
      <NavbarMenu className="pt-6">
        <NavbarItem className="text-center">
          <NavbarBrand className="sm:hidden block">
            <Link
              to="/"
              className="text-xl font-bold text-primary cursor-pointer"
            >
              LinkedPosts
            </Link>
          </NavbarBrand>
        </NavbarItem>

        {token && (
          <>
            <NavbarMenuItem>
              <NavLink
                className={({ isActive }) =>
                  `text-gray-950 font-medium transition-all w-full block p-2 px-4 rounded-lg ${
                    isActive ? "bg-blue-600 text-white" : ""
                  }`
                }
                to="/"
              >
                Home
              </NavLink>
            </NavbarMenuItem>

            <NavbarMenuItem>
              <NavLink
                className={({ isActive }) =>
                  `text-gray-950 w-full block font-medium transition-all p-2 px-4 rounded-lg ${
                    isActive ? "bg-blue-600 text-white" : ""
                  }`
                }
                to="/profile"
              >
                profile
              </NavLink>
            </NavbarMenuItem>
          </>
        )}
      </NavbarMenu>
    </Navbar>
  );
}
