import React, { useEffect, useState } from "react";
import { Image } from "react-bootstrap";
import axios from "axios";
import { useUserContext } from "../utils/userContext";
import QuantityPicker from "./QuantityPicker";
import { useRouter } from "next/router";

export default function CartPopoverProduct({ productId, qty }) {
  const [product, setProduct] = useState(null);
  const { user, cart, setCart } = useUserContext();
  const [maxDisabled, setMaxDisabled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3001/api/products/getById/${productId}`
        );
        setProduct(res.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    getProduct();
  }, [productId]);
  const HandleDelete = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:3001/api/users/removeFromCart/${productId}`,
        { data: { userId: user._id } }
      );
      if (!response) console.log("something went wrong while deleting product");
      else if (response.data === "Product not found")
        console.log("Product not found");
      else if (response.data === "User not found")
        console.log("User not found");
      else if (response.status === 200) {
        const newCart = cart.filter((item) => item.productId !== productId);
        setCart(newCart);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };
  const handleQuantityChange = async (newQty) => {
    try {
      const response = await axios.put(
        `http://localhost:3001/api/users/updateCart/${productId}`,
        { userId: user._id, qty: newQty }
      );
      if (!response) console.log("something went wrong while updating product");
      else if (response.data === "Product not found")
        console.log("Product not found");
      else if (response.data === "User not found")
        console.log("User not found");
      else if (response.status === 200) {
        const newCart = cart.map((item) => {
          if (item.productId === productId) {
            if (newQty == product.inStock) setMaxDisabled(true);
            else setMaxDisabled(false);
            return { ...item, qty: newQty };
          }
          return item;
        });
        setCart(newCart);
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <>
      {product ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <Image
            onClick={() => router.push(`/product/${product._id}`)}
            src={product.img}
            alt={product.name}
            rounded
            style={{
              width: "70px",
              height: "auto",
              marginRight: "10px",
              cursor: "pointer",
            }}
          />
          <div style={{ flex: 1 }}>
            <h6 style={{ marginBottom: "5px" }}>{product.name}</h6>
            <p style={{ fontSize: "14px", marginBottom: "5px" }}>
              <strong>Price:</strong> ${product.price} <br />
              <strong>Quantity:</strong> {qty} <br />
              <strong>Total:</strong> ${product.price * qty}
            </p>
          </div>
          <button onClick={HandleDelete} className="btn btn-transparent">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-trash"
              viewBox="0 0 16 16"
            >
              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
              <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
            </svg>
          </button>
        </div>
      ) : (
        <div>loading...</div>
      )}
    </>
  );
}
