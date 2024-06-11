import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Button from "@mui/material/Button";
import axiosInstance from "../../axiosInstance";
import { useSelector } from "react-redux";

function UpdateProduct({ id }) {
  const [product, setProduct] = React.useState({});
  const authState = useSelector((state) => state.auth);
  const [productDetails, setProductDetails] = React.useState({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    images: [],
    featured: false,
    brandName: "",
  });

  const fetchProductById = async (id) => {
    try {
      const response = await axiosInstance.get(`/customer/products/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching product by ID:", error);
      throw error;
    }
  };

  React.useEffect(() => {
    const getProduct = async () => {
      try {
        const data = await fetchProductById(id);
        setProduct(data);
        setProductDetails({
          name: data.name,
          description: data.description,
          price: data.price,
          stock: data.stock,
          images: data.imageUrls, // assuming your API returns image URLs
          featured: data.featured,
          brandName: data.brandName,
        });
      } catch (error) {
        console.error("Error fetching product by ID:", error);
      }
    };
    getProduct();
  }, [id]);

  const handleProductDetailChange = (event) => {
    const { name, value } = event.target;
    setProductDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleImageUpload = (event, index) => {
    const { files } = event.target;
    const file = files[0];
    setProductDetails((prevDetails) => {
      const newImages = [...prevDetails.images];
      newImages[index] = file;
      return {
        ...prevDetails,
        images: newImages,
      };
    });
  };

  const handleToggleChange = (event) => {
    const { checked } = event.target;
    setProductDetails((prevDetails) => ({
      ...prevDetails,
      featured: checked,
    }));
  };

  const handleUpdateProduct = async () => {
    const formData = new FormData();
    formData.append("name", productDetails.name);
    formData.append("description", productDetails.description);
    formData.append("price", productDetails.price);
    formData.append("stock", productDetails.stock);
    formData.append("featured", productDetails.featured);
    formData.append("brandName", productDetails.brandName);

    productDetails.images.forEach((image, index) => {
      if (image instanceof File) {
        formData.append(`image${index + 1}`, image);
      }
    });

    try {
      const response = await axiosInstance.put(
        `/seller/products/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${authState.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Product updated successfully");
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h2>Update Product</h2>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "50%",
          marginTop: "1rem",
        }}
      >
        <TextField
          fullWidth
          label="Product Name"
          name="name"
          value={productDetails.name}
          onChange={handleProductDetailChange}
          sx={{ marginRight: "1rem" }}
        />
      </Box>
      <Box sx={{ minWidth: 120, width: "50%", marginTop: "1rem" }}>
        <TextField
          fullWidth
          label="Description"
          name="description"
          multiline
          rows={4}
          value={productDetails.description}
          onChange={handleProductDetailChange}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "50%",
          marginTop: "1rem",
        }}
      >
        <TextField
          fullWidth
          label="Price"
          name="price"
          type="number"
          value={productDetails.price}
          onChange={handleProductDetailChange}
          sx={{ marginRight: "1rem" }}
        />
        <TextField
          fullWidth
          label="Stock"
          name="stock"
          type="number"
          value={productDetails.stock}
          onChange={handleProductDetailChange}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "50%",
          marginTop: "1rem",
        }}
      >
        {[0, 1, 2].map((index) => (
          <Box sx={{ minWidth: "30%" }} key={index}>
            <InputLabel>{`Image ${index + 1}`}</InputLabel>
            <input
              type="file"
              name={`image${index + 1}`}
              accept="image/*"
              onChange={(event) => handleImageUpload(event, index)}
            />
          </Box>
        ))}
      </Box>
      <Box sx={{ minWidth: 120, width: "50%", marginTop: "1rem" }}>
        <FormControlLabel
          control={
            <Switch
              checked={productDetails.featured}
              onChange={handleToggleChange}
              name="featured"
            />
          }
          label="Featured"
        />
      </Box>
      <Box sx={{ minWidth: 120, width: "50%", marginTop: "1rem" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpdateProduct}
        >
          Update Product
        </Button>
      </Box>
    </div>
  );
}

export default UpdateProduct;
