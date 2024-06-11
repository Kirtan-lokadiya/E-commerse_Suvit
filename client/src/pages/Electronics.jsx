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
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import { useSelector } from "react-redux";
import Footer from "./components/Footer";
import Pagination from "@mui/material/Pagination";
import TextExpander from "./components/TextExpander";

const sort_names = [
  { _id: 1, name: "asc" },
  { _id: 2, name: "desc" },
];

function Electronics() {
  const authState = useSelector((state) => state.auth);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [subcategory, setSubcategory] = useState({ name: "", id: "" });
  const [brand, setBrand] = useState("");
  const [sort, setSort] = useState({ name: "asc", id: 1 });
  const [maxPrice, setMaxPrice] = useState(500);
  const navigate = useNavigate();
  const { id } = useParams();
  const limit = 3;

  const handleChangecategory = (e, selectedSubcategory) => {
    setSubcategory({
      name: selectedSubcategory.name,
      id: selectedSubcategory._id,
    });
  };
  const handleChangebrand = (e) => {
    setBrand(e.target.value);
  };

  const handleChangeSort = (e, selectedSort) => {
    console.log(selectedSort);
    // const selectedOption = JSON.parse(e.target.value);
    setSort({ name: selectedSort.name, id: selectedSort._id });
  };

  const handleChangeMaxPrice = (e, newValue) => {
    setMaxPrice(newValue);
  };

  const handlePageChange = (event, value) => {
    setPage(event.target.textContent);
  };
  console.log(page);
  const getFilteredProducts = async (token, params) => {
    const temp = {
      type: "Point",
      coordinates: [
        authState.user.location.coordinates.coordinates[0],
        authState.user.location.coordinates.coordinates[1],
      ],
    };
    try {
      const response = await axiosInstance.post(
        "/customer/products/getproducts",
        temp,
        {
          params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  };

  const handleFilterClick = async () => {
    let params;
    if (subcategory.id === "") {
      params = {
        categoryId: id,
        page,
        limit,
        minPrice: 100,
        maxPrice,
        sortOrder: sort.name,
      };
    } else {
      params = {
        categoryId: id,
        subcategoryId: subcategory.id,
        page,
        limit,
        minPrice: 100,
        maxPrice,
        sortOrder: sort.name,
      };
    }

    try {
      setLoading(true);
      const data = await getFilteredProducts(authState.token, params);
      setProducts(data.products);
      setTotalPages(Math.ceil(data.totalProducts / limit));
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFilterClick();
  }, [authState.token, id, maxPrice, page, sort, subcategory.id]);

  return (
    <div>
      <NavBar />
      <Filters
        subcategory={subcategory}
        brand={brand}
        maxPrice={maxPrice}
        onChangeCategory={handleChangecategory}
        onChangeBrand={handleChangebrand}
        sort_names={sort_names}
        onChangeSort={handleChangeSort}
        onChangeMaxPrice={handleChangeMaxPrice}
        sort={sort}
        onClickFilter={handleFilterClick}
      />
      {loading && <div>Loading...</div>}
      {error && <div>Error fetching products: {error.message}</div>}
      <MDBRow style={{ marginRight: "0" }}>
        {products.map((product) => (
          <MDBCol key={product._id} md="4">
            <MDBCard style={{ margin: "1rem" }} className="same-size-card">
              <MDBCardImage
                className="same-size-card-image"
                src={
                  `${process.env.REACT_APP_IMAGE_PREFIX}${product.imageUrls[0]}` ||
                  "https://mdbootstrap.com/img/new/standard/nature/184.webp"
                }
                position="top"
                alt={product.name}
              />
              <MDBCardBody>
                <MDBCardTitle>{product.name}</MDBCardTitle>
                <TextExpander>{product.description}</TextExpander>
                <MDBCardText>₹ {product.price}</MDBCardText>
                <MDBBtn onClick={() => navigate(`/product/${product._id}`)}>
                  View Details
                </MDBBtn>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        ))}
      </MDBRow>
      <Pagination
        className="pagination-style"
        onChange={(e) => handlePageChange(e)}
        count={totalPages}
        page={page}
      />
      <Footer />
    </div>
  );
}

export default Electronics;
