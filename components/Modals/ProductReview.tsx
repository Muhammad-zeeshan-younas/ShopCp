import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { ReviewVO, UserVO } from "@/utils/parsers";
import { useUserStore } from "@/Zustand/store/user.store";

interface ProductReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (review: ReviewVO) => void;
}

const ProductReviewModal: React.FC<ProductReviewModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const user = useUserStore((user) => user.user);
  const loggedInUser = user as UserVO;
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>("");

  const handleSubmit = (): void => {
    if (!user) return;
    if (rating === 0 || review.trim() === "") return;

    onSubmit(new ReviewVO({ rating, comment: review, user_id: user.id, product_id: 1 }));
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
              className={`w-6 h-6 cursor-pointer ${rating >= star ? "text-yellow-500" : "text-gray-300"}`}
              onClick={() => setRating(star)}
            />
          ))}
        </div>
        <Textarea
          placeholder="Write your review here..."
          value={review}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReview(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={rating === 0 || review.trim() === ""}>
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductReviewModal;
