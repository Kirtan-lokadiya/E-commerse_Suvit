import React from "react";
import ProgressBar from "react-bootstrap/ProgressBar";
import { MDBCardText } from "mdb-react-ui-kit";
import Rating from "@mui/material/Rating";
const RatingPercentage = ({ reviews }) => {
  const ratingCounts = {};
  for (let i = 1; i <= 5; i++) {
    ratingCounts[i] = 0; // Initialize count for all ratings (1-5)
  }

  reviews.forEach((review) => {
    const rating = review.rating;
    if (rating >= 1 && rating <= 5) {
      ratingCounts[rating] = (ratingCounts[rating] || 0) + 1;
    }
  });

  const totalReviews = reviews.length;

  const ratingPercentages = Object.keys(ratingCounts).map((rating) => {
    const count = ratingCounts[rating];
    const percentage = ((count / totalReviews) * 100).toFixed(1);
    return { rating: parseInt(rating), percentage };
  });

  return (
    <div className="review-display">
      <div className="review-count">{`(${totalReviews} reviews)`}</div>
      {ratingPercentages.map((ratingPercentage) => (
        <MDBCardText key={ratingPercentage.rating} className="rating-bar">
          <div className="group-stars-per">
            <Rating name="read-only" value={ratingPercentage.rating} readOnly />

            <span className="rating-percentage">
              {ratingPercentage.percentage}%
            </span>
          </div>
          <ProgressBar now={ratingPercentage.percentage} />
          <div className="rating-progress">
            <div
              className="progress-fill"
              style={{ width: `${ratingPercentage.percentage}%` }}
            ></div>
          </div>
        </MDBCardText>
      ))}
    </div>
  );
};

export default RatingPercentage;
