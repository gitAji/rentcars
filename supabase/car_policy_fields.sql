-- Adds rental policy / extra-charge fields to the `cars` table so admins can
-- set per-car pricing and policy text for things that aren't part of the
-- base daily rate: extra km charges, a missing-fuel fee, scratch damage
-- fees, a general damage policy, the accident procedure, and glass cover.
--
-- Run this once in the Supabase SQL editor (or via the CLI) against your
-- project. It is safe to re-run -- every column is added with
-- IF NOT EXISTS, so running it twice is a no-op the second time.

ALTER TABLE cars
  ADD COLUMN IF NOT EXISTS extra_km_charge numeric(10, 2),
  ADD COLUMN IF NOT EXISTS fuel_missing_charge numeric(10, 2),
  ADD COLUMN IF NOT EXISTS scratch_charge numeric(10, 2),
  ADD COLUMN IF NOT EXISTS damage_policy text,
  ADD COLUMN IF NOT EXISTS accident_procedure text,
  ADD COLUMN IF NOT EXISTS glass_cover_policy text;

COMMENT ON COLUMN cars.extra_km_charge IS 'Fee per km driven beyond the included daily/rental allowance (in NOK).';
COMMENT ON COLUMN cars.fuel_missing_charge IS 'Flat fee charged if the car is returned with less fuel than at pickup (in NOK).';
COMMENT ON COLUMN cars.scratch_charge IS 'Flat fee charged for minor scratches found at return (in NOK).';
COMMENT ON COLUMN cars.damage_policy IS 'Free-text description of how larger damage to the vehicle is handled/charged.';
COMMENT ON COLUMN cars.accident_procedure IS 'Free-text instructions for what the renter must do if they are in an accident.';
COMMENT ON COLUMN cars.glass_cover_policy IS 'Free-text description of what glass/windshield damage coverage this car includes.';
