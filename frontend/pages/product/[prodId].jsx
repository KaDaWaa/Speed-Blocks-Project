import { useRouter } from "next/router";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import QuantityPicker from "../../components/QuantityPicker";
import { Button } from "react-bootstrap";
import { useUserContext } from "../../utils/userContext";

export default function product() {
  const { user, cart, setCart } = useUserContext();
  const router = useRouter();
  const { prodId } = router.query;
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [prodQuantityInCart, setProdQuantityInCart] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const handleQuantityChange = (newQuantity) => {
    setQuantity(newQuantity);
  };
  const handleAddToCart = async () => {
    try {
      if (!user) {
        router.push("/signuplogin");
        return;
      }
      const response = await axios.post(
        `http://localhost:3001/api/users/addToCart/${product._id}`,
        { userId: user._id, qty: quantity }
      );
      if (!response)
        return console.log("something went wrong while adding to cart");
      if (response.data == "Not enough in stock")
        return alert("Not enough in stock");
      if (response.status === 200) {
        const pInCartIndex = cart.findIndex((p) => p.productId === product._id);
        if (pInCartIndex !== -1) {
          const updatedCart = [...cart];
          updatedCart[pInCartIndex].qty += quantity;
          setCart(updatedCart);
        } else {
          setCart((prevCart) => [
            ...prevCart,
            { productId: product._id, qty: quantity },
          ]);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    const getProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/products/getById/${prodId}`
        );
        if (!response)
          return console.log("something went wrong while getting product");
        setProduct(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    getProduct();
  }, [prodId]);
  useEffect(() => {
    if (product) {
      const pInCart = cart.find((p) => p.productId === product._id);
      if (pInCart) {
        setProdQuantityInCart(pInCart.qty);
        if (pInCart.qty === product.inStock) setDisabled(true);
        else setDisabled(false);
      } else {
        setProdQuantityInCart(0);
        setDisabled(false);
      }
    }
  }, [product, cart]);
  return (
    <div style={{ padding: "50px" }}>
      {product ? (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            height: "500px",
          }}
        >
          <div>
            <img
              style={{ width: "500px" }}
              src={product.img}
              alt={product.name}
            />
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              padding: "20px",
              paddingLeft: "100px",
              fontSize: "20px",
            }}
          >
            <h1 className="text-primary">{product.name}</h1>
            <p style={{ wordWrap: "break-word", overflowWrap: "break-word" }}>
              {product.description}
            </p>
            {product.inStock > 0 ? (
              <p>
                <span style={{ color: "green" }}>In Stock: </span>
                {product.inStock}
              </p>
            ) : (
              <p style={{ color: "red" }}>Out of Stock</p>
            )}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "60%",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <QuantityPicker
                  product={product}
                  onChange={handleQuantityChange}
                  disabled={
                    product.inStock == 0 ||
                    prodQuantityInCart === product.inStock
                  }
                  max={product.inStock - prodQuantityInCart}
                />
                <h3 className="text-danger">${product.price}</h3>
              </div>
              <Button
                style={{ width: "auto", margin: "10px" }}
                variant="primary"
                disabled={disabled || product.inStock == 0}
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
              {prodQuantityInCart === product.inStock &&
                product.inStock != 0 && (
                  <div
                    style={{
                      display: "flex",
                      width: "100%",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{ width: "80%" }}
                      class="alert alert-warning"
                      role="alert"
                    >
                      Max quantity achieved
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      ) : (
        <h1>Loading...</h1>
      )}
    </div>
  );
}
