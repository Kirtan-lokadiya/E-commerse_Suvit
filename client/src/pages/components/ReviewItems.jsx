import React from "react";
import Rating from "@mui/material/Rating";

const ReviewItem = ({ review }) => {
  const date = review.createdAt.split("T")[0];
  return (
    <div className="review-item">
      <div className="review-header">
        <span className="reviewer-name">
          {review.user.firstName} {review.user.lastName}
        </span>
        <div className="rating">
          <Rating name="read-only" value={review.rating} readOnly />
        </div>
        <span className="review-date">{date}</span>
      </div>
      <div className="review-text">{review.text}</div>
      <hr />
    </div>
  );
};

const ReviewItems = ({ reviews }) => {
  return (
    <div className="review-items">
      {reviews.map((review, index) => (
        <ReviewItem key={index} review={review} />
      ))}
    </div>
  );
};

export default ReviewItems;
