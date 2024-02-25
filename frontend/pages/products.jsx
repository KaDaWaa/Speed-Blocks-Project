import React from "react";
import { useUserContext } from "../utils/userContext";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { Form, Button, Modal } from "react-bootstrap";
import ProductCard from "../components/productCard";
import FormGroup from "../components/FormGroup";
import AddProduct from "../components/addProduct";
import MyPagination from "../components/myPagination";
export default function ProductsPage() {
  const router = useRouter();
  const { user } = useUserContext();

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/products/getProductsByPage/${page}`
        );
        console.log(response);
        if (!response)
          return console.log("something went wrong while getting products");
        setProducts(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    setIsLoading(true);
    getProducts();
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  }, [page]);

  useEffect(() => {
    setTotalPages(Math.ceil(totalProducts / 6));
  }, [totalProducts]);

  useEffect(() => {
    const getTotalProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/products/getTotalProducts"
        );
        console.log(response);
        if (!response)
          return console.log(
            "something went wrong while getting total products"
          );
        setTotalProducts(response.data);
        setTotalPages(Math.ceil(response.data / 6));
      } catch (err) {
        console.log(err);
      }
    };
    getTotalProducts();
  }, []);

  return (
    <div
      style={{
        marginTop: "5vh",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <h1 class="text-primary"> Products</h1>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          width: "80%",
          //border: "5px solid black",
        }}
      >
        <AddProduct
          products={products}
          setProducts={setProducts}
          setTotalProducts={setTotalProducts}
        />
      </div>
      {isLoading ? (
        <div
          class="spinner-border text-primary"
          style={{ height: "75px", width: "75px", margin: "12%" }}
          role="status"
        >
          <span class="visually-hidden">Loading...</span>
        </div>
      ) : (
        <div
          style={{
            marginTop: "5vh",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-around", // Aligns items with space around them
            alignItems: "center",
            flexDirection: "row",
            width: "90%", // Adjust the width of the container
          }}
        >
          {products &&
            products.map((product) => {
              return (
                <div
                  key={product.id}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    width: "30%",
                    padding: "10px",
                  }}
                >
                  <ProductCard product={product} setProducts={setProducts} />
                </div>
              );
            })}
        </div>
      )}
      <div style={{ padding: "25px" }}>
        <MyPagination page={page} setPage={setPage} totalPages={totalPages} />
      </div>
    </div>
  );
}
