import React, { useEffect, useState } from "react";
import { Form, Button, Nav } from "react-bootstrap";
import axios from "axios";
import Navbar from "../components/navbar";
import { useUserContext } from "../utils/userContext";
import { useRouter } from "next/router";

export default function SignUpPage() {
  const { user, setUser, setCart } = useUserContext();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user]);
  const [action, setAction] = useState("login");
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add your signup logic here using formData
    try {
      if (action === "login") {
        const response = await axios.post(
          "http://localhost:3001/api/users/login",
          formData
        );
        if (response.data == "username is incorrect") {
          setError("username is incorrect");
        } else if (response.data == "password is incorrect") {
          setError("password is incorrect");
        } else {
          setUser(response.data);
          setCart(response.data.cart);
        }
      } else {
        const response = await axios.post(
          "http://localhost:3001/api/users/signup",
          formData
        );
        setAction("login");
      }
    } catch (err) {
      console.log(err);
    }
    // You can send the data to your server or perform any other actions.
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          height: "50vh",
          marginTop: "20px",
          flexDirection: "column",
        }}
      >
        <h1>{action === "login" ? "Login" : "Sign Up"}</h1>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            height: "50vh",
          }}
        >
          <Form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              borderRadius: "10px",
              padding: "20px",
              margin: "20px",
            }}
          >
            {action === "signup" && (
              <Form.Group controlId="formName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required={true}
                />
              </Form.Group>
            )}
            <Form.Group controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                required={true}
              />
            </Form.Group>
            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required={true}
              />
            </Form.Group>
            <Button
              style={{ marginTop: "15px" }}
              variant="primary"
              type="submit"
            >
              {action === "login" ? "Login" : "Sign Up"}
            </Button>
          </Form>
          <span style={{ color: "red" }}>{error}</span>
          <div className="toggle-action">
            {action === "login" ? (
              <p>
                Don't have an account?{" "}
                <span
                  style={{
                    cursor: "pointer",
                    textDecoration: "underline",
                    color: "blue",
                  }}
                  onClick={() => setAction("signup")}
                >
                  Sign Up
                </span>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <span
                  style={{
                    cursor: "pointer",
                    textDecoration: "underline",
                    color: "blue",
                  }}
                  onClick={() => setAction("login")}
                >
                  Login
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
