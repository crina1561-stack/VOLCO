/*
  # Add Review Triggers and Functions

  1. Functions
    - `update_product_rating()` - Updates average_rating and review_count for a product
  
  2. Triggers
    - Trigger on INSERT to reviews table
    - Trigger on UPDATE to reviews table
    - Trigger on DELETE from reviews table
  
  3. Notes
    - Only approved reviews are counted in the average
    - Automatically recalculates when reviews are added, updated, or deleted
*/

CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products
  SET 
    average_rating = COALESCE(
      (SELECT AVG(rating)::numeric(3,2) 
       FROM reviews 
       WHERE product_id = COALESCE(NEW.product_id, OLD.product_id) 
       AND is_approved = true),
      0
    ),
    review_count = COALESCE(
      (SELECT COUNT(*) 
       FROM reviews 
       WHERE product_id = COALESCE(NEW.product_id, OLD.product_id) 
       AND is_approved = true),
      0
    )
  WHERE id = COALESCE(NEW.product_id, OLD.product_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_product_rating_on_insert ON reviews;
CREATE TRIGGER update_product_rating_on_insert
AFTER INSERT ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_product_rating();

DROP TRIGGER IF EXISTS update_product_rating_on_update ON reviews;
CREATE TRIGGER update_product_rating_on_update
AFTER UPDATE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_product_rating();

DROP TRIGGER IF EXISTS update_product_rating_on_delete ON reviews;
CREATE TRIGGER update_product_rating_on_delete
AFTER DELETE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_product_rating();
