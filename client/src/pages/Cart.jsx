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
import { useNavigate } from "react-router";
import TextExpander from "./components/TextExpander";

function Cart() {
  const [cart, setcart] = useState([]);
  const token = useSelector((state) => state.auth.token); // Get token from Redux store
  const navigate = useNavigate();

  const addToCart = async (productId, token) => {
    try {
      await axiosInstance.post(
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

  const deleteFromcart = async (productId) => {
    try {
      await axiosInstance.delete(
        `/customer/products/delete-from-cart/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Product removed from cart successfully");
    } catch (error) {
      console.error("Error removing product from cart:", error);
    }
  };

  const handleDelete = async (productId) => {
    await deleteFromcart(productId);
    setcart((prevcart) => prevcart.filter((item) => item._id !== productId));
  };

  useEffect(() => {
    document.title = "Cart - E-Shopping";

    async function getcart() {
      try {
        const response = await axiosInstance.get("/customer/products/cart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setcart(response.data);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    }

    getcart();
  }, [token]);

  const NumberButton = ({ id, initialCount, onIncrement, onDecrement }) => {
    const [count, setCount] = useState(initialCount);

    useEffect(() => {
      async function updateCart() {
        try {
          await axiosInstance.put(
            `/customer/products/cart`,
            { productId: id, quantity: count },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        } catch (error) {
          console.error("Error updating cart:", error);
        }
      }
      if (count !== initialCount) {
        updateCart();
      }
    }, [count, id, initialCount, token]);

    const handleIncrement = () => {
      setCount((prevCount) => prevCount + 1);
      if (onIncrement) {
        onIncrement(count + 1);
      }
    };

    const handleDecrement = () => {
      if (count > 1) {
        setCount((prevCount) => prevCount - 1);
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
  function handleCheckout() {
    // alert("Checkout is not implemented yet.");
    async function checkout() {
      try {
        const res = await axiosInstance.post(
          "/checkout",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // alert("Checkout successful");
        const url = res.data.paymentLink;
        window.location.href = url;
        setcart([]);
      } catch (error) {
        console.error("Error checking out:", error);
      }
    }
    checkout();
  }
  return (
    <div>
      <NavBar />
      <h2 style={{ display: "flex", justifyContent: "center" }}>Cart</h2>
      <div
        style={{
          display: "flex",
          justifyContent: "right",
          marginRight: "1rem",
        }}
      >
        <MDBBtn color="success" onClick={handleCheckout}>
          CheckOut
        </MDBBtn>
      </div>
      <MDBRow>
        {cart.length > 0 ? (
          cart.map((product) => (
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
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>Quantity</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <NumberButton
                        id={product._id}
                        initialCount={product.quantity}
                      />
                    </MDBCol>
                  </MDBRow>
                  <MDBBtn
                    color="danger"
                    onClick={() => handleDelete(product._id)}
                  >
                    Delete from cart
                  </MDBBtn>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          ))
        ) : (
          <p style={{ display: "flex", justifyContent: "center" }}>
            No items in your cart.
          </p>
        )}
      </MDBRow>
      <Footer />
    </div>
  );
}

export default Cart;
