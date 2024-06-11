import NavBar from "./components/NavBar";
import Filters from "./components/Filters";
import {
  MDBCard,
  MDBCol,
  MDBCardImage,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBBtn,
  MDBRow,
} from "mdb-react-ui-kit";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import { useSelector } from "react-redux";
import Footer from "./components/Footer";

const subcategories = [];
const brands = [];

const fetchProducts = async (token, category) => {
  try {
    const response = await axiosInstance.get("/customer/products/category", {
      params: { category },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching featured products:", error);
    throw error;
  }
};
function Grocery() {
  const authState = useSelector((state) => state.auth);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const category = "Grocery";
  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await fetchProducts(authState.token, category);
        setProducts(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, [authState.token, category]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <div>
      <NavBar />
      <Filters subcategories={subcategories} brands={brands} />
      <MDBRow style={{ marginRight: "0" }}>
        {products.map((product) => (
          <MDBCol key={product._id} md="4">
            <MDBCard style={{ margin: "1rem" }}>
              <MDBCardImage
                src={
                  product.imageUrl[0] ||
                  "https://mdbootstrap.com/img/new/standard/nature/184.webp"
                }
                position="top"
                alt={product.name}
              />
              <MDBCardBody>
                <MDBCardTitle>{product.name}</MDBCardTitle>
                <MDBCardText>{product.description}</MDBCardText>
                <MDBBtn onClick={() => navigate(`/product/${product._id}`)}>
                  View Details
                </MDBBtn>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        ))}
      </MDBRow>
      <Footer />
    </div>
  );
}

export default Grocery;
