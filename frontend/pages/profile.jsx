import React from "react";
import { useUserContext } from "../utils/userContext";
import { useRouter } from "next/router";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { Form, Button, Nav, Table, Modal } from "react-bootstrap";
import FormGroup from "../components/FormGroup";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Collapse from "@mui/material/Collapse";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

import {
  Paper,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  AlertTitle,
} from "@mui/material";

export default function Profile() {
  const { user, setUser } = useUserContext();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [open, setOpen] = useState(false);
  const [openEditMessage, setOpenEditMessage] = useState(false);
  const [message, setMessage] = useState("");
  const [editMessage, setEditMessage] = useState("");
  const [severity, setSeverity] = useState("success");
  const [title, setTitle] = useState("success");
  const [topBuyer, setTopBuyer] = useState({});
  const [startD, setStartD] = useState(dayjs("2024-02-01"));
  const [endD, setEndD] = useState(dayjs(Date.now()));
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [isTopBuyer, setIsTopBuyer] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]:
        name === "price" || name === "inStock" ? parseFloat(value) : value,
    }));
  };
  const handleEditOpen = () => {
    setFormData({
      name: user.name,
      password: "",
      newPassword: "",
      confirmNewPassword: "",
    });
    setShowEditModal(true);
  };

  const handleNameChange = async () => {
    try {
      if (formData.name === user.name) return;

      const response = await axios.put(
        `http://localhost:3001/api/users/updateName/`,
        {
          userId: user._id,
          name: formData.name,
        }
      );
      if (!response)
        return console.log("something went wrong while updating name");
      setUser({ ...user, name: formData.name });
      setSeverity("success");
      setTitle("Success");
      setMessage("Name updated successfully");
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
      }, 3000);
    } catch (err) {
      console.log(err);
    }
  };
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
  const handlePasswordChange = async () => {
    if (formData.newPassword !== formData.confirmNewPassword) {
      setEditMessage("Passwords do not match");
      setSeverity("error");
      setTitle("Error");
      setOpenEditMessage(true);
      setTimeout(() => {
        setOpenEditMessage(false);
      }, 2000);
      return;
    }
    try {
      const response = await axios.put(
        `http://localhost:3001/api/users/updatePassword/`,
        {
          userId: user._id,
          oldPw: formData.password,
          newPw: formData.newPassword,
        }
      );
      if (!response) {
        setShowEditModal(false);
        setSeverity("error");
        setTitle("Error");
        setMessage("something went wrong while updating password");
        setOpen(true);
        setTimeout(() => {
          setOpen(false);
        }, 2000);
        return console.log("something went wrong while updating password");
      }
      if (response.data === "old password is not correct") {
        setSeverity("error");
        setTitle("Error");
        setEditMessage("Old password is incorrect");
        setOpenEditMessage(true);
        setTimeout(() => {
          setOpenEditMessage(false);
        }, 2000);
        return;
      }
      setShowEditModal(false);
      setMessage("Password updated successfully");
      setSeverity("success");
      setTitle("Success");
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
      }, 3000);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    let total = 0;
    if (orders) {
      orders.map((o) => {
        total += o.totalPrice;
      });
    }
    setTotalPrice(total);
  }, [orders]);
  useEffect(() => {
    const getOrders = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/users/getOrdersByIdAndDates/${
            user._id
          }/${startD.valueOf()}/${endD.valueOf()}`
        );
        console.log(response);
        if (!response)
          return console.log("something went wrong while getting orders");
        setOrders(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    if (!user) {
      router.push("/signuplogin");
    } else {
      setFormData({
        name: user.name,
        password: "",
        newPassword: "",
      });
      getOrders();
    }
  }, [user, startD, endD]);
  useEffect(() => {
    const getTopBuyer = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/users/getTopBuyer`
        );
        console.log(response);
        if (!response)
          return console.log("something went wrong while getting top buyer");
        setTopBuyer(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    getTopBuyer();
  }, []);
  useEffect(() => {
    if (topBuyer[0] && topBuyer[0]._id === user._id) {
      setIsTopBuyer(true);
    }
  }, [topBuyer]);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <h1 style={{ alignSelf: "center" }} className="text-primary">
        Profile
      </h1>

      <Collapse in={open} style={{ width: "40%", alignSelf: "center" }}>
        <Alert severity={severity}>
          <AlertTitle>{title}</AlertTitle>
          {message}
        </Alert>
      </Collapse>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
        }}
      >
        <div
          style={{ width: "40%", alignSelf: "center", margin: "50px" }}
          role="personalInfo"
        >
          <h3>Personal Info</h3>
          <div
            style={{
              display: "flex",
              width: "60%",
              flexDirection: "column",
            }}
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
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Button onClick={handleNameChange} style={{ margin: "10px" }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-floppy"
                  viewBox="0 0 16 16"
                  style={{ marginRight: "5px" }}
                >
                  <path d="M11 2H9v3h2z" />
                  <path d="M1.5 0h11.586a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 14.5v-13A1.5 1.5 0 0 1 1.5 0M1 1.5v13a.5.5 0 0 0 .5.5H2v-4.5A1.5 1.5 0 0 1 3.5 9h9a1.5 1.5 0 0 1 1.5 1.5V15h.5a.5.5 0 0 0 .5-.5V2.914a.5.5 0 0 0-.146-.353l-1.415-1.415A.5.5 0 0 0 13.086 1H13v4.5A1.5 1.5 0 0 1 11.5 7h-7A1.5 1.5 0 0 1 3 5.5V1H1.5a.5.5 0 0 0-.5.5m3 4a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V1H4zM3 15h10v-4.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5z" />
                </svg>
                Save
              </Button>
              <Button
                onClick={() => handleEditOpen()}
                style={{ margin: "10px" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-pencil-square"
                  viewBox="0 0 16 16"
                  style={{ marginRight: "5px" }}
                >
                  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                  <path
                    fill-rule="evenodd"
                    d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
                  />
                </svg>{" "}
                Edit Password
              </Button>
              <Modal
                show={showEditModal}
                onHide={() => setShowEditModal(false)}
              >
                <Modal.Header closeButton>
                  <Modal.Title>Edit Password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <FormGroup
                      label={"Current Password"}
                      type={"password"}
                      name={"password"}
                      required={true}
                      value={formData.password}
                      onChange={handleChange}
                      feedback={"Please enter password"}
                      placeholder={"Enter current password"}
                    />
                    <FormGroup
                      label={"New Password"}
                      type={"password"}
                      name={"newPassword"}
                      required={true}
                      value={formData.newPassword}
                      onChange={handleChange}
                      feedback={"Please enter new password"}
                      placeholder={"Enter new password"}
                    />
                    <FormGroup
                      label={"Confirm New Password"}
                      type={"password"}
                      name={"confirmNewPassword"}
                      required={true}
                      value={formData.confirmNewPassword}
                      onChange={handleChange}
                      feedback={"Please confirm new password"}
                      placeholder={"Confirm new password"}
                    />
                  </Form>
                  <Collapse
                    in={openEditMessage}
                    style={{ width: "100%", alignSelf: "center" }}
                  >
                    <Alert severity={severity}>
                      <AlertTitle>{title}</AlertTitle>
                      {editMessage}
                    </Alert>
                  </Collapse>
                </Modal.Body>
                <Modal.Footer>
                  <Button onClick={handlePasswordChange}>Save</Button>
                  <Button onClick={() => setShowEditModal(false)}>Close</Button>
                </Modal.Footer>
              </Modal>
            </div>
            {isTopBuyer && (
              <Alert
                severity="info"
                style={{ alignSelf: "center", margin: "10px" }}
              >
                <AlertTitle>Congratulations</AlertTitle>You are our top buyer ,
                With a total purchases of {topBuyer[0].totalPurchases}$
              </Alert>
            )}
          </div>
        </div>

        <div style={{ width: "60%", margin: "50px" }}>
          <h3>My Orders</h3>
          <div
            style={{
              display: "flex",
              margin: "15px",
              marginLeft: "0px",
              width: "80%",
              justifyContent: "space-between",
            }}
          >
            <DatePicker
              label="Start"
              defaultValue={startD}
              onChange={(value) => {
                setStartD(value);
              }}
            />
            <DatePicker
              label="End"
              defaultValue={endD}
              onChange={(value) => {
                setEndD(value);
              }}
            />
          </div>

          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer sx={{ maxHeight: 200 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell>Order ID</TableCell>
                    <TableCell>Total Products</TableCell>
                    <TableCell>Total Price</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders &&
                    orders.map((order) => (
                      <TableRow
                        key={order._id}
                        onClick={() => router.push(`/orders/${order._id}`)}
                        style={{ cursor: "pointer" }}
                      >
                        <TableCell>{order._id}</TableCell>
                        <TableCell>{order.items.length}</TableCell>
                        <TableCell>{order.totalPrice}</TableCell>
                        <TableCell>{formatDate(order.createdAt)}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
          <h5 style={{ margin: "10px", marginLeft: "0px" }}>
            Total Purchases : {totalPrice.toFixed(2)}
          </h5>
        </div>
      </div>
    </div>
  );
}
