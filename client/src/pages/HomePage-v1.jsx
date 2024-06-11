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
// import ExampleCarouselImage from "./../public/wallpaper.jpg";

import axiosInstance from "./../axiosInstance";
import { useEffect, useState } from "react";
import axios from "axios";

const fetchFeaturedProducts = async (category) => {
  try {
    const response = await axios.get(
      `http://192.168.20.173:5000/api/customer/products/featured`,
      { params: { category } }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching featured products:", error);
    throw error;
  }
};

function TrendingArea({ category }) {
  // const data = fetchFeaturedProducts(category);
  // console.log(data)
  // return (
  //   <>
  //     <h2 style={{ margin: "20px 0px" }}>{category}</h2>
  //     <MDBRow>
  //       <MDBCol>
  //         <MDBCard>
  //           <MDBCardImage
  //             src="https://mdbootstrap.com/img/new/standard/nature/184.webp"
  //             position="top"
  //             alt="..."
  //           />
  //           <MDBCardBody>
  //             <MDBCardTitle>Card title</MDBCardTitle>
  //             <MDBCardText>
  //               Some quick example text to build on the card title and make up
  //               the bulk of the card's content.
  //             </MDBCardText>
  //             <MDBBtn href="#">Button</MDBBtn>
  //           </MDBCardBody>
  //         </MDBCard>
  //       </MDBCol>
  //       <MDBCol>
  //         <MDBCard>
  //           <MDBCardImage
  //             src="https://mdbootstrap.com/img/new/standard/nature/184.webp"
  //             position="top"
  //             alt="..."
  //           />
  //           <MDBCardBody>
  //             <MDBCardTitle>Card title</MDBCardTitle>
  //             <MDBCardText>
  //               Some quick example text to build on the card title and make up
  //               the bulk of the card's content.
  //             </MDBCardText>
  //             <MDBBtn href="#">Button</MDBBtn>
  //           </MDBCardBody>
  //         </MDBCard>
  //       </MDBCol>
  //       <MDBCol>
  //         <MDBCard>
  //           <MDBCardImage
  //             src="https://mdbootstrap.com/img/new/standard/nature/184.webp"
  //             position="top"
  //             alt="..."
  //           />
  //           <MDBCardBody>
  //             <MDBCardTitle>Card title</MDBCardTitle>
  //             <MDBCardText>
  //               Some quick example text to build on the card title and make up
  //               the bulk of the card's content.
  //             </MDBCardText>
  //             <MDBBtn href="#">Button</MDBBtn>
  //           </MDBCardBody>
  //         </MDBCard>
  //       </MDBCol>
  //       <MDBCol>
  //         <MDBCard>
  //           <MDBCardImage
  //             src="https://mdbootstrap.com/img/new/standard/nature/184.webp"
  //             position="top"
  //             alt="..."
  //           />
  //           <MDBCardBody>
  //             <MDBCardTitle>Card title</MDBCardTitle>
  //             <MDBCardText>
  //               Some quick example text to build on the card title and make up
  //               the bulk of the card's content.
  //             </MDBCardText>
  //             <MDBBtn href="#">Button</MDBBtn>
  //           </MDBCardBody>
  //         </MDBCard>
  //       </MDBCol>
  //     </MDBRow>
  //   </>
  // );
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await fetchFeaturedProducts({ category });
        setProducts(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, [category]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  console.log(products);
  return (
    <></>
    // <MDBRow>
    //   {products.map((product) => (
    //     <MDBCol key={product.id} md="4">
    //       <MDBCard>
    //         <MDBCardImage
    //           src={
    //             product.image ||
    //             "https://mdbootstrap.com/img/new/standard/nature/184.webp"
    //           }
    //           position="top"
    //           alt={product.name}
    //         />
    //         <MDBCardBody>
    //           <MDBCardTitle>{product.name}</MDBCardTitle>
    //           <MDBCardText>{product.description}</MDBCardText>
    //           <MDBBtn href="#">View Details</MDBBtn>
    //         </MDBCardBody>
    //       </MDBCard>
    //     </MDBCol>
    //   ))}
    // </MDBRow>
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
        <TrendingArea category={"Electronics"} />
        <TrendingArea category={"Grocery"} />
        <TrendingArea category={"Furniture"} />
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
