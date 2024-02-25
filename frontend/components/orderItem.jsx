import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { TableCell, TableRow, IconButton, Typography } from "@mui/material";
import { Image } from "react-bootstrap";

export default function OrderItem({ productId, qty }) {
  const [product, setProduct] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3001/api/products/getById/${productId}`
        );
        console.log(res);
        setProduct(res.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    getProduct();
  }, [productId]);

  return (
    product && (
      <TableRow key={productId} hover>
        <TableCell>
          <IconButton onClick={() => router.push(`/product/${productId}`)}>
            <Image
              src={product.img}
              alt={product.name}
              rounded
              style={{ width: "100px", height: "auto" }}
            />
          </IconButton>
        </TableCell>
        <TableCell>
          <Typography>{product.name}</Typography>
        </TableCell>
        <TableCell>{qty}</TableCell>
        <TableCell>{product.price}</TableCell>
        <TableCell>{product.price * qty}</TableCell>
      </TableRow>
    )
  );
}
