import { ReviewVO, UserVO } from "../parsers";

export function isLoggedIn(user: UserVO | null): boolean {
  return !!user;
}

export function canAddToCart(user: UserVO | null): boolean {
  return isLoggedIn(user);
}

export function canWriteReview(user: UserVO | null): boolean {
  return isLoggedIn(user);
}
export function canEditReview(user: UserVO, review: ReviewVO): boolean {
  if (!user) return false;
  return user.id === review.userId;
}

export function canDeleteReview(user: UserVO, review: ReviewVO): boolean {
  if (!user) return false;
  return user.id === review.userId;
}
