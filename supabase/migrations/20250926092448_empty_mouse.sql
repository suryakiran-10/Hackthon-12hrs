/*
  # Create interviews table

  1. New Tables
    - `interviews`
      - `id` (uuid, primary key)
      - `application_id` (uuid, foreign key to applications)
      - `scheduled_date` (timestamp)
      - `duration` (integer, minutes)
      - `status` (enum)
      - `feedback_score` (integer)
      - `feedback_report` (text)
      - `created_at` (timestamp)
  2. Security
    - Enable RLS on `interviews` table
    - Add policies for users to manage interviews for their applications
*/

CREATE TYPE interview_status AS ENUM ('scheduled', 'completed', 'cancelled');

CREATE TABLE IF NOT EXISTS interviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid REFERENCES applications(id) ON DELETE CASCADE NOT NULL,
  scheduled_date timestamptz NOT NULL,
  duration integer DEFAULT 30,
  status interview_status DEFAULT 'scheduled',
  feedback_score integer CHECK (feedback_score >= 0 AND feedback_score <= 100),
  feedback_report text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own interviews"
  ON interviews
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM applications
      WHERE applications.id = interviews.application_id
      AND applications.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create interviews for own applications"
  ON interviews
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM applications
      WHERE applications.id = interviews.application_id
      AND applications.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own interviews"
  ON interviews
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM applications
      WHERE applications.id = interviews.application_id
      AND applications.user_id = auth.uid()
    )
  );