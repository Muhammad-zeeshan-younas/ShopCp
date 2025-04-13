import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { Review } from "@/types/Review";
import { useSelector } from "react-redux";
import { user } from "@/Redux/reducers/slices/userSlice";

interface ProductReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (review: Review) => void;
}

const ProductReviewModal: React.FC<ProductReviewModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const loggedInUser = useSelector(user);
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>("");

  const handleSubmit = (): void => {
    if (rating === 0 || review.trim() === "") return;
    onSubmit({ rating, comment: review, user: loggedInUser });
    setRating(0);
    setReview("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Write a Review</DialogTitle>
        </DialogHeader>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star: number) => (
            <Star
              key={star}
              className={`w-6 h-6 cursor-pointer ${
                rating >= star ? "text-yellow-500" : "text-gray-300"
              }`}
              onClick={() => setRating(star)}
            />
          ))}
        </div>
        <Textarea
          placeholder="Write your review here..."
          value={review}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setReview(e.target.value)
          }
        />
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={rating === 0 || review.trim() === ""}
          >
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductReviewModal;
