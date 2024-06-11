import Footer from "./components/Footer";
import NavBar from "./components/NavBar";
import { MDBCol, MDBRow } from "mdb-react-ui-kit";
import CreateProduct from "./components/CreateProduct";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoxesStacked } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import DeleteProductBySeller from "./components/DeleteProductBySeller";
import UpdateInfoProduct from "./components/UpdateInfoProduct";
import axiosInstance from "../axiosInstance";
import { useSelector } from "react-redux";
function ManageProducts() {
  const authState = useSelector((state) => state.auth);
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await axiosInstance.get(
        "/seller/products/own-products",
        { headers: { Authorization: `Bearer ${authState.token}` } }
      );
      const data = response.data;
      setProducts(data);
    };
    fetchProducts();
  }, [authState.token]);
  return (
    <>
      <NavBar />
      <MDBRow>
        <MDBCol md="4">
          <nav aria-label="main mailbox folders">
            <List>
              <ListItem onClick={() => setSelectedIndex(1)}>
                <ListItemButton>
                  <ListItemIcon>
                    <FontAwesomeIcon icon={faBoxesStacked} />
                  </ListItemIcon>
                  <ListItemText primary="Create Product" />
                </ListItemButton>
              </ListItem>
              <ListItem onClick={() => setSelectedIndex(2)}>
                <ListItemButton>
                  <ListItemIcon>
                    <FontAwesomeIcon icon={faBoxesStacked} />
                  </ListItemIcon>
                  <ListItemText primary="Delete Product" />
                </ListItemButton>
              </ListItem>
              <ListItem onClick={() => setSelectedIndex(3)}>
                <ListItemButton>
                  <ListItemIcon>
                    <FontAwesomeIcon icon={faBoxesStacked} />
                  </ListItemIcon>
                  <ListItemText primary="Update info of Products" />
                </ListItemButton>
              </ListItem>
            </List>
          </nav>
        </MDBCol>
        <MDBCol md="8">
          {selectedIndex === 1 && <CreateProduct />}
          {selectedIndex === 2 && (
            <DeleteProductBySeller
              products={products}
              setProducts={setProducts}
            />
          )}
          {selectedIndex === 3 && (
            <UpdateInfoProduct products={products} setProducts={setProducts} />
          )}
        </MDBCol>
      </MDBRow>
      <Footer />
    </>
  );
}

export default ManageProducts;
