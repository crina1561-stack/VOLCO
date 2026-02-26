/*
  # Add Review Approval System

  1. Changes
    - Add is_approved column to reviews table
    - Set default to false for new reviews
    - Update existing reviews to approved
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reviews' AND column_name = 'is_approved'
  ) THEN
    ALTER TABLE reviews ADD COLUMN is_approved boolean DEFAULT false;
    UPDATE reviews SET is_approved = true WHERE is_approved IS NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_reviews_approved ON reviews(is_approved);
CREATE INDEX IF NOT EXISTS idx_reviews_product_approved ON reviews(product_id, is_approved);
