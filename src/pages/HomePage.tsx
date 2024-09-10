import HeroSection from "../components/ui/HeroSection";
import ReviewSection from "../components/ui/ReviewSection";

import {
  useCreateReviewMutation,
  useGetAllReviewQuery,
} from "../redux/api/reviewApi";
import { useAppSelector } from "../redux/hook";
import FeaturedServices from "./FeaturedServices";

const HomePage = () => {
  const { token } = useAppSelector((state) => state.auth);
  const { data: allReview } = useGetAllReviewQuery(undefined);
  const [createReview] = useCreateReviewMutation();

  const allReviewData = allReview?.response.data || [];

  const overallRating =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    allReviewData.reduce((acc: any, review: any) => acc + review.rating, 0) /
    allReviewData.length;

  return (
    <div>
      <HeroSection />
      <FeaturedServices />
      <ReviewSection
        reviews={allReviewData}
        overallRating={overallRating}
        isLoggedIn={!!token}
        onSubmitReview={createReview}
      />
    </div>
  );
};

export default HomePage;