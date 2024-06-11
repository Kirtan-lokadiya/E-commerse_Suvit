import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBRow,
  MDBCol,
  MDBInput,
  MDBBtn,
  MDBCardText,
} from "mdb-react-ui-kit";
import axiosInstance from "../../axiosInstance";
import { useSelector } from "react-redux";
import { Typography } from "@mui/material";

function CreateSubCategory() {
  const authState = useSelector((state) => state.auth);
  const [mainCategories, setMainCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState({
    id: "",
    name: "",
  });
  const [subCategoryName, setSubCategoryName] = useState("");

  useEffect(() => {
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

  const handleCreateSubCategory = async () => {
    try {
      const response = await axiosInstance.post(
        "/categories/add-categories",
        {
          name: subCategoryName,
          parentCategory: selectedCategory.id,
        },
        {
          headers: {
            Authorization: `Bearer ${authState.token}`, // Add this if your endpoint requires authorization
          },
        }
      );
      alert("Subcategory created successfully");
      // Optionally, you can reset the form or provide feedback to the user here
    } catch (error) {
      console.error("Error creating subcategory:", error);
    }
  };

  return (
    <>
      <MDBRow style={{ margin: "1rem" }}>
        <MDBCol>
          <MDBDropdown>
            <MDBDropdownToggle>Main Category</MDBDropdownToggle>
            <MDBDropdownMenu>
              {mainCategories.map((category) => (
                <MDBDropdownItem
                  key={category._id}
                  onClick={() =>
                    setSelectedCategory({
                      id: category._id,
                      name: category.name,
                    })
                  }
                >
                  <Typography>{category.name}</Typography>
                </MDBDropdownItem>
              ))}
            </MDBDropdownMenu>
          </MDBDropdown>
          {selectedCategory.name && (
            <p>Selected Category: {selectedCategory.name}</p>
          )}
        </MDBCol>
        <MDBCol>
          <MDBInput
            label="Sub Category Name"
            value={subCategoryName}
            onChange={(e) => setSubCategoryName(e.target.value)}
          />
        </MDBCol>
      </MDBRow>
      <MDBRow style={{ margin: "1rem" }}>
        <MDBCol>
          <MDBBtn onClick={handleCreateSubCategory}>Create</MDBBtn>
        </MDBCol>
      </MDBRow>
    </>
  );
}

export default CreateSubCategory;
