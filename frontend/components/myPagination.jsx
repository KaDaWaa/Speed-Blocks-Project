import * as React from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useState } from "react";
export default function MyPagination({ page, setPage, totalPages }) {
  const [active, setActive] = useState(page);

  const handlePageClick = (number) => {
    setActive(number);
    setPage(number);
  };

  return (
    <Stack spacing={2}>
      <Pagination
        color="primary"
        variant="outlined"
        count={totalPages}
        page={active}
        onChange={(e, number) => handlePageClick(number)}
        showFirstButton
        showLastButton
      />
    </Stack>
  );
}
