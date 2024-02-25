import React from "react";
import { useState } from "react";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useUserContext } from "../utils/userContext";
import ShoppingCart from "./ShoppingCart";
import styles from "./styles.module.css";

export default function Navbar() {
  const buttons = [
    { name: "Home", href: "http://localhost:3000/", userRequired: null },
    {
      name: "Login",
      href: "http://localhost:3000/signuplogin",
      userRequired: false,
    },
    {
      name: "Profile",
      href: "http://localhost:3000/profile",
      userRequired: true,
    },
    {
      name: "Products",
      href: "http://localhost:3000/products",
      userRequired: null,
    },
    {
      name: "Logout",
      userRequired: true,
      onClick: () => {
        setUser(null);
        router.push("/");
      },
    },
  ];
  const [selected, setSelected] = useState("Home");
  const router = useRouter();
  const [cartDisabled, setCartDisabled] = useState(false);
  const { user, setUser, cart } = useUserContext();

  const handleClick = (name) => {
    setSelected(name);
  };

  useEffect(() => {
    // Use the pathname from the router to set the initial selected state
    const pathname = router.pathname;
    const initialSelected =
      buttons.find(
        (button) => button.href === `http://localhost:3000${pathname}`
      )?.name || "Home";
    setSelected(initialSelected);
    if (pathname === "/checkout") setCartDisabled(true);
    else setCartDisabled(false);
  }, [router.pathname]);

  return (
    <div className={styles.navbar}>
      <div className={styles.test}>
        {buttons.map((b) => {
          if (b.userRequired === true && user === null) {
            return;
          } else if (b.userRequired === false && user !== null) {
            return;
          } else {
            return (
              <Link
                style={{
                  color: selected === b.name ? "black" : "grey ",
                }}
                className={styles.link}
                onClick={() => {
                  handleClick(b.name);
                  b.onClick && b.onClick();
                }}
                href={b.href ? b.href : ""}
                key={b.name}
              >
                {b.name}
              </Link>
            );
          }
        })}
        {!cartDisabled && (
          <div className={styles.cartDiv}>
            <ShoppingCart />
          </div>
        )}
      </div>
    </div>
  );
}
