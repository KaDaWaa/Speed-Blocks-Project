import React from "react";

export default function my404() {
  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <button onClick={() => window.history.back()}>Go Back</button>
    </div>
  );
}
