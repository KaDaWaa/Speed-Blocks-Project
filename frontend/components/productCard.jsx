import React from "react";
import { Button, Modal } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Dropdown from "react-bootstrap/Dropdown";
import { useUserContext } from "../utils/userContext";
import axios from "axios";
import { useState } from "react";
import Form from "react-bootstrap/Form";
import { useRouter } from "next/router";
import FormGroup from "./FormGroup";
import QuantityPicker from "./QuantityPicker";
import styles from "./styles.module.css";
import { Alert, AlertTitle, Collapse } from "@mui/material";
export default function ProductCard({ product, setProducts }) {
  const router = useRouter();
  const { user, cart, setCart } = useUserContext();
  const [editShow, setEditShow] = useState(false);
  const [deleteShow, setDeleteShow] = useState(false);
  const [Validated, setValidated] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [hovered, setHovered] = useState(false);
  const [show, setShow] = useState(false);
  const [severity, setSeverity] = useState("error");
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    name: product.name,
    img: product.img,
    description: product.description,
    price: product.price,
    inStock: product.inStock,
  });

  const handleQuantityChange = (newQuantity) => {
    setQuantity(newQuantity);
  };

  const handleEditShow = () => {
    setEditShow(true);
  };
  const handleEditClose = () => {
    setEditShow(false);
    setValidated(false);
  };
  const handleDeleteShow = () => {
    setDeleteShow(true);
  };
  const handleDeleteClose = () => {
    setDeleteShow(false);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    const parsedValue =
      name === "price" || name === "inStock" ? parseFloat(value) : value;
    setFormData((prevData) => ({
      ...prevData,
      [name]: parsedValue,
    }));
  };
  const handleSubmit = async (e) => {
    const form = e.currentTarget;
    e.preventDefault();
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    try {
      const response = await axios.put(
        `http://localhost:3001/api/products/editProduct/${product._id}`,
        formData
      );
      if (!response) return console.log("something went wrong while editing");
      console.log(response);
      alert("Product edited");
      setProducts((prevProducts) =>
        prevProducts.map((p) => (p._id === product._id ? response.data : p))
      );
      setEditShow(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:3001/api/products/deleteProduct/${product._id}`
      );
      if (!response) return console.log("something went wrong while deleting");
      console.log(response);
      alert("Product deleted");
      setProducts((prevProducts) =>
        prevProducts.filter((p) => p._id !== product._id)
      );
      handleDeleteClose();
    } catch (err) {
      console.log(err);
    }
  };

  const HandleProductClick = () => {
    router.push(`/product/${product._id}`);
  };
  const handleAddToCart = async () => {
    try {
      if (!user) router.push("/signuplogin");
      const response = await axios.post(
        `http://localhost:3001/api/users/addToCart/${product._id}`,
        { userId: user._id, qty: quantity }
      );
      if (!response)
        return console.log("something went wrong while adding to cart");
      if (response.data == "Not enough in stock") {
        setSeverity("error");
        setMessage("Not enough in stock");
        setShow(true);
        setTimeout(() => {
          setShow(false);
        }, 3000);
        return;
      }
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

  return (
    <Card
      border="secondary"
      style={{ width: "18rem", height: "32rem", overflow: "hidden" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={hovered ? styles.hovered : ""}
    >
      <div
        style={{
          cursor: "pointer",
          width: "100%", // Ensures the entire card is clickable
          height: "100%", // Ensures the entire card is clickable
        }}
        onClick={HandleProductClick}
      >
        <div
          style={{
            marginTop: "20px",
            width: "100%",
            height: "12rem", // Set the height for the image container
            overflow: "hidden", // Hide overflow to crop images
          }}
        >
          <Card.Img variant="top" src={product.img} style={{ width: "100%" }} />
        </div>
        <Card.Body>
          <Card.Title className="text-primary">{product.name}</Card.Title>
          <Card.Text>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              {product.description.length > 30
                ? `${product.description.substring(0, 30)}...`
                : product.description}
              <br />
              <br />
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <span
                    style={{ color: product.inStock > 0 ? "green" : "red" }}
                  >
                    {product.inStock > 0 ? "In Stock" : "Out of Stock"}
                    <h5 className="text-danger">{product.price}$ </h5>
                  </span>
                </div>
                <Collapse in={show}>
                  <Alert severity={severity}>
                    <AlertTitle>Warning</AlertTitle>
                    {message}
                  </Alert>
                </Collapse>
              </div>
            </div>
          </Card.Text>
        </Card.Body>
      </div>
      <Card.Body>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <>
            <Button
              variant="primary"
              disabled={product.inStock > 0 ? false : true}
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
            <QuantityPicker
              onChange={handleQuantityChange}
              defaultValue={1}
              disabled={product.inStock > 0 ? false : true}
            />
          </>
          {user && user.admin && (
            <Dropdown>
              <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                ...
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item
                  style={{ color: "red" }}
                  onClick={handleDeleteShow}
                >
                  Delete
                </Dropdown.Item>
                <Modal centered show={deleteShow} onHide={handleDeleteClose}>
                  <Modal.Header closeButton>
                    <Modal.Title style={{ color: "red" }}>
                      Delete Product
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    Are you sure you want to delete this product?
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      variant="outline-secondary"
                      onClick={handleDeleteClose}
                    >
                      Close
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                      Delete
                    </Button>
                  </Modal.Footer>
                </Modal>
                <Dropdown.Item onClick={handleEditShow}>Edit</Dropdown.Item>
                <Modal centered show={editShow} onHide={handleEditClose}>
                  <Modal.Header closeButton>
                    <Modal.Title>Edit Product</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form
                      noValidate
                      validated={Validated}
                      onSubmit={handleSubmit}
                    >
                      <FormGroup
                        label={"Name"}
                        type={"text"}
                        name={"name"}
                        required={true}
                        value={formData.name}
                        onChange={handleChange}
                        autoFocus={true}
                        feedback={"Please enter name"}
                        placeholder={"Enter product name"}
                      />
                      <FormGroup
                        label={"Image Link"}
                        type={"text"}
                        name={"img"}
                        required={true}
                        value={formData.img}
                        onChange={handleChange}
                        feedback={"Please enter image link"}
                        placeholder={"Enter image link"}
                      />
                      <FormGroup
                        label={"Description"}
                        type={"textarea"}
                        name={"description"}
                        required={true}
                        value={formData.description}
                        onChange={handleChange}
                        feedback={"Please enter description"}
                        placeholder={"Enter product description"}
                      />
                      <FormGroup
                        label={"Price"}
                        type={"number"}
                        name={"price"}
                        required={true}
                        value={formData.price}
                        onChange={handleChange}
                        feedback={"Please enter price"}
                        placeholder={"Enter product price"}
                      />
                      <FormGroup
                        label={"In Stock"}
                        type={"number"}
                        name={"inStock"}
                        required={true}
                        value={formData.inStock}
                        onChange={handleChange}
                        feedback={"Please enter in stock"}
                        placeholder={"Enter product in stock"}
                      />

                      <Button
                        style={{ margin: "5px" }}
                        variant="outline-secondary"
                        onClick={handleEditClose}
                      >
                        Close
                      </Button>
                      <Button
                        style={{ margin: "5px" }}
                        variant="info"
                        type="submit"
                      >
                        Save
                      </Button>
                    </Form>
                  </Modal.Body>
                </Modal>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </div>
      </Card.Body>
      {quantity === 5 && (
        <div
          style={{ display: "flex", width: "100%", justifyContent: "center" }}
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
    </Card>
  );
}
