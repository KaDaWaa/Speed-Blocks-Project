import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useUserContext } from "../../utils/userContext";
import OrderItem from "../../components/orderItem";
import {
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Paper,
} from "@mui/material";
import { Button } from "react-bootstrap";

export default function Order() {
  const { user } = useUserContext();
  const router = useRouter();
  const { orderId } = router.query;
  const [order, setOrder] = useState({});

  useEffect(() => {
    if (!user) router.push("/signuplogin");

    if (user && !user.orders.includes(orderId)) router.push("/");
    const getOrder = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/orders/getOrderById/${orderId}`
        );
        console.log(response);
        if (!response.data)
          return console.log("something went wrong while getting order");
        setOrder(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    if (orderId) {
      getOrder();
    }
  }, [orderId]);

  const formatDate = (isoDate) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(2);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year}, ${hours}:${minutes}`;
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <h1 className="text-primary" style={{ alignSelf: "center" }}>
        Order Summary
      </h1>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignSelf: "center",
          justifyContent: "space-between",
          margin: "20px",
          width: "70%",
        }}
      >
        <h5>Order ID: {order._id}</h5>
        <h5>Order Date: {order.createdAt && formatDate(order.createdAt)}</h5>
      </div>
      <div
        style={{
          width: "70%",
          alignSelf: "center",
        }}
      >
        <h3>Items:</h3>
        <Paper>
          <TableContainer sx={{ maxHeight: 300 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell>Image</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {order.items &&
                  order.items.map((item) => (
                    <OrderItem
                      key={item._id}
                      productId={item.productId}
                      qty={item.qty}
                      router={router} // Pass router as a prop to OrderItem
                    />
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
        }}
      >
        <h4 style={{ margin: "20px" }}>Total Price: {order.totalPrice}$</h4>
        <div>
          <Button
            style={{ width: "auto", alignSelf: "center", margin: "20px" }}
            onClick={() => router.push("/")}
          >
            Go Home
          </Button>
          <Button
            style={{ width: "auto", alignSelf: "center", margin: "20px" }}
            onClick={() => router.push("/profile")}
          >
            Back to Profile{" "}
          </Button>
        </div>
      </div>
    </div>
  );
}
