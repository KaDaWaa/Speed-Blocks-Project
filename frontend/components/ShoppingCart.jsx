import React, { useEffect, useState, useRef } from "react";
import { OverlayTrigger, Popover, Button } from "react-bootstrap";
import { useUserContext } from "../utils/userContext";
import styles from "./styles.module.css";
import { useRouter } from "next/router";
import CartPopoverProduct from "./CartPopoverProduct";
import axios from "axios";

const ShoppingCart = () => {
  const router = useRouter();
  const [cartCount, setCartCount] = useState(0);
  const { user, cart, setCart } = useUserContext();
  const [showPopover, setShowPopover] = useState(false);
  const [popoverRendered, setPopoverRendered] = useState(false); // Track popover rendering
  const popoverRef = useRef(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [product, setProduct] = useState({});

  useEffect(() => {
    const getProduct = async (productId) => {
      try {
        const res = await axios.get(
          `http://localhost:3001/api/products/getById/${productId}`
        );
        return res.data;
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    if (user) {
      setCartCount(cart.length);
      let total = 0;
      // Create an array to store promises for fetching product details
      const productPromises = cart.map(async (p) => {
        const productDetails = await getProduct(p.productId);
        if (productDetails) total += productDetails.price * p.qty;
      });
      // Wait for all product details to be fetched before computing total price
      Promise.all(productPromises).then(() => {
        setTotalPrice(total);
      });
    }
  }, [user, cart]);

  useEffect(() => {
    if (!showPopover && user && cart.length > 0) {
      setShowPopover(true);
      setTimeout(() => {
        setShowPopover(false);
      }, 3500);
    }
  }, [cart]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target) &&
        !event.target.closest(".popover")
      ) {
        setShowPopover(false);
      }
    }
    if (popoverRendered) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [popoverRendered]);

  const handlePopoverRender = () => {
    setPopoverRendered(true);
  };

  const handleCartClick = () => {
    if (!user) {
      router.push("/signuplogin");
    } else {
      setShowPopover(!showPopover);
    }
  };

  return (
    <div ref={popoverRef}>
      <OverlayTrigger
        trigger="manual"
        show={showPopover}
        key="bottom"
        placement="bottom"
        onEntered={handlePopoverRender} // Handle popover render
        overlay={
          <Popover id={`popover-positioned-bottom`} style={{ width: "250px" }}>
            <Popover.Header as="h3"> Shopping Cart</Popover.Header>
            <Popover.Body
              style={{
                maxHeight: "300px",
                overflow: "scroll",
                WebkitOverflowScrolling: "touch",
              }}
            >
              {cart.length > 0
                ? cart.map((product) => {
                    return (
                      <CartPopoverProduct
                        key={product.productId}
                        productId={product.productId}
                        qty={product.qty}
                      />
                    );
                  })
                : "Your cart is empty"}
            </Popover.Body>
            <div className={styles.popoverFooter}>
              <Button
                disabled={cart.length === 0}
                onClick={() => {
                  router.push("/checkout");
                  setShowPopover(false);
                }}
              >
                Checkout
              </Button>
              <h5>Total:{totalPrice.toFixed(2)}$</h5>
            </div>
          </Popover>
        }
      >
        <div
          style={{ position: "relative", width: "45px", height: "30px" }}
          onClick={handleCartClick}
        >
          <span
            style={{
              visibility: cartCount > 0 ? "visible" : "hidden",
            }}
            className={styles.cartCount}
          >
            {cartCount}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            fill="currentColor"
            className="bi bi-cart"
            viewBox="0 0 16 16"
          >
            <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
          </svg>
        </div>
      </OverlayTrigger>
    </div>
  );
};

export default ShoppingCart;
