import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardText,
  MDBCol,
  MDBInput,
  MDBRow,
} from "mdb-react-ui-kit";
import Slider from "@mui/material/Slider";
import Dropdown from "./Dropdown";
import { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance";
import { useParams } from "react-router";
function Filters({
  subcategory,
  brand,
  maxPrice,
  onChangeCategory,
  onChangeBrand,
  sort_names,
  onChangeSort,
  onChangeMaxPrice,
  sort,
  onClickFilter,
}) {
  const [subcategory_names, setSubcategory_names] = useState([]);
  const { id } = useParams();
  useEffect(() => {
    async function getSubcategories() {
      try {
        const response = await axiosInstance.get(
          `/categories/${id}/subcategories`
        );
        // console.log(response.data);
        const subCategoryNames = response.data.map((subcategory) => {
          return { name: subcategory.name, _id: subcategory._id };
        });
        setSubcategory_names(subCategoryNames);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    }
    getSubcategories();
  }, [id]);
  // console.log(subcategory_names);
  // const subcategory_names = [
  //   { _id: 4, name: "Electronics" },
  //   { _id: 5, name: "Clothing" },
  //   { _id: 6, name: "Footwear" },
  // ];
  return (
    <div>
      <MDBCard>
        <MDBCardBody>
          <MDBRow>
            <MDBCol>
              <Dropdown
                subcategories={subcategory_names}
                name={"Sub Categories"}
                value={subcategory}
                handleChange={onChangeCategory}
              />
            </MDBCol>
            <MDBCol>
              <Dropdown
                subcategories={sort_names}
                name={"Sort by"}
                value={sort}
                handleChange={onChangeSort}
              />
            </MDBCol>
          </MDBRow>
          <MDBRow>
            <MDBCardText style={{ marginTop: "20px" }}>
              Select Price
            </MDBCardText>
            <MDBCol sm="3">
              <Slider
                min={500}
                max={50000}
                valueLabelDisplay="auto"
                shiftStep={30}
                step={500}
                marks
                value={maxPrice}
                onChange={onChangeMaxPrice}
              />
            </MDBCol>
            <MDBCol sm="9">
              <MDBBtn onClick={onClickFilter}>Filter</MDBBtn>
            </MDBCol>
          </MDBRow>
        </MDBCardBody>
      </MDBCard>
    </div>
  );
}

export default Filters;
