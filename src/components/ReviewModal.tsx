/** @format */

import { Consultation, createReview } from "@/lib/api/consultations";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useState } from "react";

function ReviewModal({
  consultation,
  onClose,
  onReviewed,
}: {
  consultation: Consultation;
  onClose: () => void;
  onReviewed: () => void;
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReviewSubmit = async () => {
    if (rating === 0) {
      alert("Please select a rating.");
      return;
    }
    setLoading(true);
    try {
      await createReview(consultation.id, rating, comment);
      onReviewed();
    } catch (_error) {
      console.error(_error);
      alert("Failed to submit review.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">
          Leave a Review for Dr. {consultation.doctor?.first_name}
        </h2>
        <div className="flex justify-center my-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className={`text-4xl ${
                star <= rating ? "text-yellow-400" : "text-gray-300"
              }`}
            >
              ★
            </button>
          ))}
        </div>
        <Textarea
          placeholder="Share your experience..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <div className="flex justify-end space-x-4 mt-4">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleReviewSubmit} disabled={loading}>
            {loading ? "Submitting..." : "Submit Review"}
          </Button>
        </div>
      </div>
    </div>
  );
}
export default ReviewModal;
