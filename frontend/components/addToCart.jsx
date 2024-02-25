import React from "react";
import { useUserContext } from "../utils/userContext";
import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function AddToCart({ product }) {
  const { user, cart, setCart } = useUserContext();
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();

  const handleAddToCart = () => {
    const newCart = [...cart];
    const productInCart = newCart.find((p) => p.id === product.id);
    if (productInCart) {
      productInCart.quantity += quantity;
    } else {
      newCart.push({ ...product, quantity });
    }
    setCart(newCart);
  };

  return (
    <div>
      <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />
      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
}