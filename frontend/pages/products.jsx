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
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
export default function ProductsPage() {
  const router = useRouter();
  const { user } = useUserContext();

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [sort, setSort] = useState("default");

  const handleChange = (event) => {
    setSort(event.target.value);
  };
  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/products/getProductsByPageAndSort/${page}/${sort}`
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
  }, [page, sort]);

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
          flexDirection: "row",
          justifyContent: "space-between",
          width: "80%",
        }}
      >
        <div
          style={{
            display: "flex",

            flexDirection: "row",
          }}
        >
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="demo-simple-select-helper-label">
              Sort By
            </InputLabel>
            <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              value={sort}
              label="Select"
              onChange={handleChange}
            >
              <MenuItem value="best-selling">Best Selling</MenuItem>
              <MenuItem value="newest">Newest</MenuItem>
              <MenuItem value="oldest">Oldest</MenuItem>
              <MenuItem value="price-asc">Price Ascending</MenuItem>
              <MenuItem value="price-desc">Price Descending</MenuItem>
            </Select>
          </FormControl>
        </div>
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
