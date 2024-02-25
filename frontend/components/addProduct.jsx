import react from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import { useState } from "react";
import FormGroup from "./FormGroup";
import Modal from "react-bootstrap/Modal";
import { useUserContext } from "../utils/userContext";
import styles from "./styles.module.css";
export default function AddProduct({
  products,
  setProducts,
  setTotalProducts,
}) {
  const { user } = useUserContext();
  const [show, setShow] = useState(false);
  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    img: "",
    description: "",
    price: 0,
    inStock: 0,
  });

  const handleShow = () => {
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setValidated(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]:
        name === "price" || name === "inStock" ? parseFloat(value) : value,
    }));
    console.log(formData);
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
      const response = await axios.post(
        "http://localhost:3001/api/products/create",
        formData
      );
      if (!response) console.log("something went wrong while creating product");
      console.log(response);
      if (response.status === 200) {
        setTotalProducts((prevTotal) => prevTotal + 1);
        if (products.length < 6) setProducts([...products, response.data]);
      }
      handleClose();
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className={styles.addProduct}>
      {user && user.admin == true && (
        <button
          className={styles.button}
          onClick={() => {
            handleShow();
            setFormData({
              name: "",
              img: "",
              description: "",
              price: 0,
              inStock: 0,
            });
          }}
        >
          Add Product
        </button>
      )}
      <Modal centered show={show} onHide={handleClose}>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Add Product</Modal.Title>
          </Modal.Header>
          <Modal.Body>
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
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Save
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}
