import React from "react";
import { useUserContext } from "../utils/userContext";
import { useState, useEffect } from "react";
import ProductCard from "../components/productCard";
import axios from "axios";

export default function homePage() {
  const { user, cart } = useUserContext();
  const [top3products, setTop3products] = useState(null);
  console.log(top3products);
  useEffect(() => {
    const getTop3Products = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/products/top3BestSelling`
        );
        if (!response.data)
          return console.log(
            "something went wrong while getting top 3 products"
          );
        setTop3products(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    getTop3Products();
  }, []);
  return (
    <div
      style={{
        margin: "15px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        alignItems: "center",
      }}
    >
      <h1 className="text-secondary">Welcome to our store</h1>
      <h2 className="text-primary">Best Selling Products</h2>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          margin: "15px",
          width: "80%",
          alignItems: "center",
          justifyContent: "space-evenly",
        }}
      >
        {top3products &&
          top3products.map((product) => (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <ProductCard
                style={{ margin: "15px" }}
                key={product._id}
                product={product.product}
                setProducts={setTop3products}
              />
              <h5 style={{ margin: "10px" }}>Quantity Sold: {product.total}</h5>
            </div>
          ))}
      </div>
    </div>
  );
}
