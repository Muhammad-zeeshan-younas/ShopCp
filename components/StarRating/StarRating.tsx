import React from "react";

export const StarRating = ({ rating }: { rating: number }): JSX.Element => {
  const filledStars = Math.floor(rating);
  const emptyStars = 5 - filledStars;

  const starIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 fill-current text-yellow-500" viewBox="0 0 24 24">
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21L12 17.77L5.82 21L7 14.14L2 9.27L8.91 8.26L12 2Z" />
    </svg>
  );

  const filledStarArray = Array.from({ length: filledStars }, (_, index) => <span key={index}>{starIcon}</span>);
  const emptyStarArray = Array.from({ length: emptyStars }, (_, index) => (
    <span key={index}>
      <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 fill-current text-gray-300" viewBox="0 0 24 24">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21L12 17.77L5.82 21L7 14.14L2 9.27L8.91 8.26L12 2Z" />
      </svg>
    </span>
  ));

  return (
    <div className="flex space-x-1">
      {filledStarArray}
      {emptyStarArray}
    </div>
  );
};
