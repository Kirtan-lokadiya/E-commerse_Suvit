import React, { useEffect, useState } from "react";
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBBtn,
  MDBCarousel,
  MDBCarouselItem,
  MDBCardTitle,
} from "mdb-react-ui-kit";
import RatingPercentage from "./components/RatingPercentage";
import ReviewItems from "./components/ReviewItems";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";

import axiosInstance from "./../axiosInstance";
import { useParams } from "react-router";
import ReviewAddModal from "./components/ReviewAddModal";
import { useSelector } from "react-redux";

const fetchProductById = async (id) => {
  try {
    const response = await axiosInstance.get(`/customer/products/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    throw error;
  }
};

function Carousel({ images }) {
  return (
    <MDBCarousel showIndicators showControls fade>
      {images.map((ele, i) => (
        <MDBCarouselItem itemId={i + 1} key={i + 1}>
          <img
            src={`${process.env.REACT_APP_IMAGE_PREFIX}${ele}`}
            className="same-size-card-image d-block w-100"
            alt={`Slide ${i + 1}`}
          />
        </MDBCarouselItem>
      ))}
    </MDBCarousel>
  );
}

const NumberButton = ({
  count,
  setCount,
  initialCount,
  onIncrement,
  onDecrement,
}) => {
  const handleIncrement = () => {
    setCount(count + 1);
    if (onIncrement) {
      onIncrement(count + 1);
    }
  };

  const handleDecrement = () => {
    if (count > initialCount) {
      setCount(count - 1);
      if (onDecrement) {
        onDecrement(count - 1);
      }
    }
  };

  return (
    <div className="number-button">
      <button className="decrement-button" onClick={handleDecrement}>
        -
      </button>
      <span className="number-display">{count}</span>
      <button className="increment-button" onClick={handleIncrement}>
        +
      </button>
    </div>
  );
};

export default function Product() {
  const authState = useSelector((state) => state.auth);
  const { id } = useParams();
  const [count, setCount] = useState(1);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const getProduct = async () => {
      try {
        const data = await fetchProductById(id);
        setProduct(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    getProduct();
  }, [id]);

  const addToCart = async (productId, count, token) => {
    try {
      const response = await axiosInstance.post(
        "/customer/products/add-to-cart",
        { productId, quantity: count },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Product added to cart successfully");
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };

  useEffect(() => {
    const fetchReviews = async (id) => {
      try {
        const response = await axiosInstance.get(`/comments/${id}`);
        setReviews(response.data);
        return response.data;
      } catch (error) {
        console.error("Error fetching reviews:", error);
        throw error;
      }
    };
    fetchReviews(id);
    console.log(reviews);
  }, [id]);
  // fetchReviews(id).then((data) => setReviews(data));
  // console.log(reviews);
  const handleAddWishList = async (id) => {
    try {
      const response = await axiosInstance.post(
        `/wishlist/add`,
        { productId: id },
        {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error adding product to wishlist:", error);
      throw error;
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <>
      <NavBar />
      <section style={{ backgroundColor: "#eee" }}>
        <h3 className="text-center py-2">Product Details</h3>
        <MDBContainer className="">
          <MDBRow>
            <MDBCol lg="4">
              <MDBCard className="mb-4">
                <MDBCardBody
                  className="text-center"
                  style={{ margin: "0px", padding: "0px" }}
                >
                  <Carousel images={product.imageUrls} />
                </MDBCardBody>
              </MDBCard>

              <MDBCard className="mb-4 mb-lg-0">
                <MDBCardBody className="p-0">
                  <MDBCardTitle className="review-stats">
                    Review Statistics
                  </MDBCardTitle>
                  <RatingPercentage reviews={reviews} />
                  <MDBBtn>
                    <ReviewAddModal product={product} />
                  </MDBBtn>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
            <MDBCol lg="8">
              <MDBCard className="mb-4">
                <MDBCardBody>
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>Name</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBCardText className="text-muted">
                        {product.name}
                      </MDBCardText>
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>Price</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBCardText className="text-muted">
                        ₹ {product.price}
                      </MDBCardText>
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>Description</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBCardText className="text-muted">
                        {product.description}
                      </MDBCardText>
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>Quantity</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <NumberButton
                        count={count}
                        setCount={setCount}
                        initialCount={1}
                      />
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <MDBRow>
                    <MDBCol>
                      <MDBBtn
                        onClick={() =>
                          addToCart(product._id, count, authState.token)
                        }
                      >
                        Add to Cart
                      </MDBBtn>
                    </MDBCol>
                    <MDBCol>
                      <MDBBtn onClick={() => handleAddWishList(product._id)}>
                        Add to wishlist
                      </MDBBtn>
                    </MDBCol>
                  </MDBRow>
                </MDBCardBody>
              </MDBCard>

              <MDBRow>
                <MDBCol style={{ marginBottom: "1rem" }}>
                  <MDBCard>
                    <MDBCardBody>
                      <MDBCardTitle className="review-stats">
                        Reviews
                      </MDBCardTitle>
                      <ReviewItems reviews={reviews} />
                    </MDBCardBody>
                  </MDBCard>
                </MDBCol>
              </MDBRow>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </section>
      <Footer />
    </>
  );
}
