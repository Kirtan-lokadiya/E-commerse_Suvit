import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Button from "@mui/material/Button";
import axiosInstance from "../../axiosInstance";
import { useSelector } from "react-redux";

function CreateProduct() {
  const authState = useSelector((state) => state.auth);
  const [selectedCategory, setSelectedCategory] = React.useState({
    id: "",
    name: "",
  });
  const [mainCategories, setMainCategories] = React.useState([]);
  const [subCategories, setSubCategories] = React.useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = React.useState({
    id: "",
    name: "",
  });
  const [productDetails, setProductDetails] = React.useState({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    images: [],
    featured: false,
    brandName: "",
  });

  const handleChangeCategory = (event) => {
    const selectedCategory = mainCategories.find(
      (category) => category.name === event.target.value
    );
    setSelectedCategory({
      id: selectedCategory._id,
      name: selectedCategory.name,
    });
    setSubCategories([]); // Reset subcategories when the main category changes
    setSelectedSubCategory({ id: "", name: "" }); // Reset selected subcategory
  };

  const handleChangeSubcategory = (event) => {
    const selectedSubCategory = subCategories.find(
      (subcategory) => subcategory.name === event.target.value
    );
    setSelectedSubCategory({
      id: selectedSubCategory._id,
      name: selectedSubCategory.name,
    });
  };

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

  const handleCreateProduct = async () => {
    const formData = new FormData();
    formData.append("name", productDetails.name);
    formData.append("description", productDetails.description);
    formData.append("price", productDetails.price);
    formData.append("stock", productDetails.stock);
    formData.append("featured", productDetails.featured);
    formData.append("brandName", productDetails.brandName);
    formData.append("categoryId", selectedCategory.id);
    formData.append("subcategoryId", selectedSubCategory.id);
    formData.append("seller", authState.seller._id);
    productDetails.images.forEach((image, index) => {
      formData.append(`image${index + 1}`, image);
    });

    try {
      const response = await axiosInstance.post(
        "/seller/products/createproduct",
        formData,
        {
          headers: {
            Authorization: `Bearer ${authState.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Product created successfully");
    } catch (error) {
      console.error("Error creating product:", error);
    }
    // console.log(productDetails);
    setProductDetails({
      name: "",
      description: "",
      price: 0,
      stock: 0,
      images: [],
      featured: false,
      brandName: "",
    });
  };

  React.useEffect(() => {
    const fetchMainCategories = async () => {
      try {
        const response = await axiosInstance.get("/categories/main");
        setMainCategories(response.data);
      } catch (error) {
        console.error("Error fetching main categories:", error);
      }
    };

    fetchMainCategories();
  }, []);

  React.useEffect(() => {
    const fetchSubCategories = async () => {
      if (selectedCategory.id) {
        try {
          const response = await axiosInstance.get(
            `/categories/${selectedCategory.id}/subcategories`
          );
          setSubCategories(response.data);
        } catch (error) {
          console.error("Error fetching subcategories:", error);
        }
      }
    };

    fetchSubCategories();
  }, [selectedCategory.id]);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h2>Create Product</h2>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "50%",
          marginTop: "1rem",
        }}
      >
        <FormControl fullWidth sx={{ marginRight: "1rem" }}>
          <InputLabel id="category-select-label">Category</InputLabel>
          <Select
            labelId="category-select-label"
            id="category-select"
            value={selectedCategory.name}
            label="Category"
            onChange={handleChangeCategory}
          >
            {mainCategories.map((category) => (
              <MenuItem key={category._id} value={category.name}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="subcategory-select-label">Subcategory</InputLabel>
          <Select
            labelId="subcategory-select-label"
            id="subcategory-select"
            value={selectedSubCategory.name}
            label="Subcategory"
            onChange={handleChangeSubcategory}
          >
            {subCategories.map((subcategory) => (
              <MenuItem key={subcategory._id} value={subcategory.name}>
                {subcategory.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
          label="Product Name"
          name="name"
          value={productDetails.name}
          onChange={handleProductDetailChange}
          sx={{ marginRight: "1rem" }}
        />
        <TextField
          fullWidth
          label="Brand Name"
          name="brandName"
          value={productDetails.brandName}
          onChange={handleProductDetailChange}
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
          onClick={handleCreateProduct}
        >
          Create Product
        </Button>
      </Box>
    </div>
  );
}

export default CreateProduct;
