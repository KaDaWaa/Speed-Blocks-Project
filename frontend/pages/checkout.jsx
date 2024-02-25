import React from "react";
import { useEffect } from "react";
import { useUserContext } from "../utils/userContext";
import { useRouter } from "next/router";
import {
  Button,
  ListGroup,
  Modal,
  ModalBody,
  ModalHeader,
  ModalTitle,
} from "react-bootstrap";
import CartPopoverProduct from "../components/CartPopoverProduct";
import { useState } from "react";
import axios from "axios";
export default function checkoutPage() {
  const { user, cart, setCart } = useUserContext();
  const router = useRouter();
  const [totalPrice, setTotalPrice] = useState(0);
  const [updateCartModal, setUpdateCartModal] = useState(false);
  const [checkCart, setCheckCart] = useState(false);
  const [loading, setLoading] = useState(false);
  const HandleDelete = async (productId) => {
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
  useEffect(() => {
    console.log("checking cart");
    if (user === null) {
      router.push("/signuplogin");
    } else {
      cart.map(async (p) => {
        const productDetails = await getProduct(p.productId);
        console.log(productDetails);
        if (
          !productDetails ||
          productDetails.inStock == 0 ||
          productDetails.inStock < p.qty ||
          productDetails == 404
        ) {
          console.log("need to update cart");
          setUpdateCartModal(true);
        }
      });
    }
    [user, cart, checkCart];
  });
  const updateCart = async () => {
    const updatedCart = [];
    for (const product of cart) {
      try {
        const productDetails = await getProduct(product.productId);
        console.log("productDetails:", productDetails);
        if (
          !productDetails ||
          productDetails.inStock === 0 ||
          productDetails === 404
        ) {
          await HandleDelete(product.productId);
        } else if (productDetails.inStock < product.qty) {
          const newQty =
            productDetails.inStock > 0 ? productDetails.inStock : 0;
          updatedCart.push({ productId: product.productId, qty: newQty });
        } else {
          updatedCart.push(product);
        }
        const res = await axios.put(
          "http://localhost:3001/api/users/updateCart",
          { userId: user._id, cart: updatedCart }
        );
        if (res.data == "User not found") console.log("user not found");
      } catch (error) {
        console.error("Error updating cart:", error);
      }
    }
    setCart(updatedCart);

    setUpdateCartModal(false);
    setCheckCart(false);
  };
  const handleProceedToPay = async () => {
    setCheckCart(true);
    if (checkCart === false) {
      try {
        setLoading(true);
        const newOrder = await axios.post(
          "http://localhost:3001/api/orders/create",
          { items: cart, totalPrice: totalPrice }
        );
        if (newOrder.status === 200) {
          console.log("newOrder:", newOrder.data._id);
          setCart([]);
          const updateUser = [
            await axios.put("http://localhost:3001/api/users/updateCart", {
              userId: user._id,
              cart: [],
            }),
            await axios.put(
              `http://localhost:3001/api/users/addOrder/${newOrder.data._id}`,
              {
                userId: user._id,
              }
            ),
          ];
          user.orders.push(newOrder.data._id);
          Promise.all(updateUser)
            .then(() => {
              console.log("user updated");
            })
            .catch((error) => {
              console.error("Error updating user:", error);
            });

          //alert("Order created successfully");
          setTimeout(() => {
            setLoading(false);
            router.push(`/orders/${newOrder.data._id}`);
          }, 2000);
        }
      } catch (error) {
        console.error("Error creating order:", error);
        setLoading(false);
      }
    }
  };

  const getProduct = async (productId) => {
    try {
      const res = await axios.get(
        `http://localhost:3001/api/products/getById/${productId}`
      );
      return res.data;
    } catch (error) {
      console.error("Error fetching product:", error);
      return error.response.status;
    }
  };
  useEffect(() => {
    if (user) {
      let total = 0;
      const productPromises = cart.map(async (p) => {
        const productDetails = await getProduct(p.productId);
        if (productDetails) total += productDetails.price * p.qty;
      });
      Promise.all(productPromises).then(() => {
        setTotalPrice(total);
      });
    }
  }, [user, cart]);
  return (
    <div>
      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(255, 255, 255, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Modal show={updateCartModal} backdrop="static">
          <ModalHeader>
            <ModalTitle> Update Cart</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <h4>Some products are unavailable</h4>
            <p>
              Unfortunately some products in your cart ran out of stock or
              unavailable.
              <br /> Please update your cart and try again.
            </p>
          </ModalBody>
          <Modal.Footer>
            <Button onClick={updateCart}>Update</Button>
          </Modal.Footer>
        </Modal>
        <h1>Checkout Page</h1>
        <div style={{ border: "1px solid black", width: "40%" }}>
          <h3>Cart({cart.length} Products)</h3>
          <ListGroup
            style={{
              height: "450px",
              maxHeight: "450px",
              overflow: "scroll",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {cart.length > 0
              ? cart.map((product) => {
                  console.log("product:", product);
                  return (
                    <ListGroup.Item key={product.productId}>
                      <CartPopoverProduct
                        key={product.productId}
                        productId={product.productId}
                        qty={product.qty}
                      />
                    </ListGroup.Item>
                  );
                })
              : "Your cart is empty"}
          </ListGroup>
        </div>
        <div
          style={{
            width: "40%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            margin: "20px",
          }}
        >
          <h4>Total: {totalPrice}$</h4>
          <Button disabled={cart.length == 0} onClick={handleProceedToPay}>
            Proceed to pay
          </Button>
        </div>
      </div>
    </div>
  );
}
