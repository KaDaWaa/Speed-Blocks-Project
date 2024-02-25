import UserProvider from "../utils/userContext";
import Navbar from "../components/navbar";
import "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
export default function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <Navbar />
      <Component {...pageProps} />
    </UserProvider>
  );
}
