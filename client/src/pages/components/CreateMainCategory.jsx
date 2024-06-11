import { MDBBtn, MDBInput } from "mdb-react-ui-kit";
import { useState } from "react";
import axiosInstance from "../../axiosInstance";
import { useSelector } from "react-redux";
function CreateMainCategory() {
  const authState = useSelector((state) => state.auth);
  const [mainCategoryName, setMainCategoryName] = useState("");

  const handleCreateMainCategory = async () => {
    try {
      const response = await axiosInstance.post(
        "/categories/add-categories",
        {
          name: mainCategoryName,
        },
        {
          headers: {
            Authorization: `Bearer ${authState.token}`, // Add this if your endpoint requires authorization
          },
        }
      );
      alert("Main Category created successfully");
      // Optionally, you can reset the form or provide feedback to the user here
    } catch (error) {
      console.error("Error creating main category:", error);
    }
  };

  return (
    <div style={{ margin: "1rem" }}>
      <MDBInput
        label="Main Category Name"
        value={mainCategoryName}
        id="mainCategoryName"
        type="text"
        onChange={(e) => setMainCategoryName(e.target.value)}
      />
      <MDBBtn style={{ margin: "1rem" }} onClick={handleCreateMainCategory}>
        Create
      </MDBBtn>
    </div>
  );
}

export default CreateMainCategory;
