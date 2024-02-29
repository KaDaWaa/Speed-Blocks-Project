import UserProvider from "../utils/userContext";
import Navbar from "../components/navbar";
import "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export default function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Navbar />
        <Component {...pageProps} />
      </LocalizationProvider>
    </UserProvider>
  );
}
