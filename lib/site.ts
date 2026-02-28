/**
 * Production site URL. Used for metadata, Open Graph, and canonical URLs.
 * Override with NEXT_PUBLIC_APP_URL in .env for staging or local preview.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL || "http://focusfeed.study";

export const SITE_NAME = "FocusFeed";
export const SITE_DESCRIPTION =
  "Short educational video reels for university courses";
