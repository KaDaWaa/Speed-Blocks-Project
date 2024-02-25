import React, { useState } from "react";
import { Button } from "react-bootstrap";
import styles from "./styles.module.css";
const QuantityPicker = ({ onChange, defaultValue = 1, disabled, max = 5 }) => {
  const [quantity, setQuantity] = useState(defaultValue);

  const handleIncrement = () => {
    setQuantity(quantity + 1);
    onChange(quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      onChange(quantity - 1);
    }
  };

  return (
    <div
      className="d-flex align-items-center"
      style={{
        border: "1px solid lightgrey",
        borderRadius: "10px",
      }}
    >
      <Button
        variant="secondary"
        disabled={quantity === 1 || disabled}
        onClick={handleDecrement}
      >
        -
      </Button>
      <span className="mx-2">{quantity}</span>
      <Button
        variant="secondary"
        disabled={quantity === 5 || disabled || quantity === max}
        onClick={handleIncrement}
      >
        +
      </Button>
    </div>
  );
};

export default QuantityPicker;
