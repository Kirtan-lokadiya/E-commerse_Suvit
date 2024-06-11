import React, { useEffect, useState } from "react";
import axiosInstance from "./../axiosInstance";
import { useSelector } from "react-redux";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
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
import TextExpander from "./components/TextExpander";

function WishList() {
  const [wishlist, setWishList] = useState([]);
  const token = useSelector((state) => state.auth.token); // Get token from Redux store

  const addToCart = async (productId, token) => {
    try {
      const response = await axiosInstance.post(
        "/customer/products/add-to-cart",
        { productId },
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

  const deleteFromWishlist = async (productId) => {
    try {
      await axiosInstance.delete(`/wishlist/remove/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Product removed from wishlist successfully");
    } catch (error) {
      console.error("Error removing product from wishlist:", error);
    }
  };

  const handleDelete = async (productId) => {
    await deleteFromWishlist(productId);
    setWishList((prevWishlist) =>
      prevWishlist.filter((item) => item._id !== productId)
    );
  };

  useEffect(() => {
    document.title = "WishList - E-Shopping";

    async function getWishList() {
      try {
        const response = await axiosInstance.get("/wishlist", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setWishList(response.data.products);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    }

    getWishList();
  }, [token]);
  return (
    <div>
      <NavBar />
      <h2 style={{ display: "flex", justifyContent: "center" }}>Wishlist</h2>
      <MDBRow>
        {wishlist.length > 0 ? (
          wishlist.map((product) => (
            <MDBCol key={product._id} md="4">
              <MDBCard className="same-size-card">
                <MDBCardImage
                  className="wishlist-card-img-top"
                  src={`${process.env.REACT_APP_IMAGE_PREFIX}${product.imageUrls[0]}`}
                  position="top"
                  alt={product.name}
                />
                <MDBCardBody className="wishlist-card-body">
                  <MDBCardTitle>{product.name}</MDBCardTitle>
                  <MDBCardText>
                    <TextExpander>{product.description}</TextExpander>
                  </MDBCardText>
                  <MDBCardText>₹ {product.price}</MDBCardText>
                  <MDBBtn
                    color="danger"
                    onClick={() => handleDelete(product._id)}
                  >
                    Delete form wishlist
                  </MDBBtn>
                  <MDBBtn style={{marginTop: "1rem"}}
                    color="success"
                    onClick={() => addToCart(product._id, token)}
                  >
                    Add to Cart
                  </MDBBtn>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          ))
        ) : (
          <p>No items in your wishlist.</p>
        )}
      </MDBRow>
      <Footer />
    </div>
  );
}

export default WishList;
