import {
  MDBCard,
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBCardImage,
  MDBBtn,
} from "mdb-react-ui-kit";

import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axiosInstance from "../axiosInstance";
import Electronics from "./Electronics";
import TextExpander from "./components/TextExpander";

const fetchFeaturedProducts = async () => {
  try {
    const response = await axiosInstance.get("/customer/products/trending");
    return response.data;
  } catch (error) {
    console.error("Error fetching featured products:", error);
    throw error;
  }
};

function TrendingArea() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await fetchFeaturedProducts();
        setProducts(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <>
      {products.map((singleCategory) => (
        <>
          <h2>{singleCategory.category}</h2>
          <MDBRow>
            {singleCategory.trendingProducts.map((product) => (
              <MDBCol key={product._id} md="4">
                <MDBCard className="same-size-card">
                  <MDBCardImage className="same-size-card-image"
                    src={
                      `${process.env.REACT_APP_IMAGE_PREFIX}${product.imageUrls[0]}` ||
                      "https://mdbootstrap.com/img/new/standard/nature/184.webp"
                    }
                    position="top"
                    alt={product.name}
                  />
                  <MDBCardBody>
                    <MDBCardTitle>{product.name}</MDBCardTitle>
                    <MDBCardText>
                      <TextExpander>{product.description}</TextExpander>
                    </MDBCardText>
                    <MDBBtn onClick={() => navigate(`/product/${product._id}`)}>
                      View Details
                    </MDBBtn>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            ))}
          </MDBRow>
        </>
      ))}
    </>
  );
}

function Outlet() {
  return (
    <>
      <div className="outlet-container">
        <MDBContainer>
          <MDBRow>
            <MDBCol>
              <h1>Welcome to one of the best E-commerce websites</h1>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </div>
      <div className="outlet-info">
        <MDBRow>
          <MDBCol>
            <h3>10+</h3>
            <p>Years on the market</p>
          </MDBCol>
          <MDBCol>
            <h3>10+</h3>
            <p>Years on the market</p>
          </MDBCol>
          <MDBCol>
            <h3>1000+</h3>
            <p>Global Partners</p>
          </MDBCol>
          <MDBCol>
            <h3>10000+</h3>
            <p>Daily visitors on website</p>
          </MDBCol>
        </MDBRow>
      </div>
      <MDBContainer>
        <h2 style={{ margin: "50px 0px" }}>Trending Products</h2>
        <TrendingArea />
      </MDBContainer>
    </>
  );
}

function HomePage() {
  return (
    <div className="App">
      <NavBar />
      <Outlet />
      <Footer />
    </div>
  );
}

export default HomePage;
