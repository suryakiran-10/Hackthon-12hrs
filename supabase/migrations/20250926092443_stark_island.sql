/*
  # Create applications table

  1. New Tables
    - `applications`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `job_id` (uuid, foreign key to jobs)
      - `resume_url` (text)
      - `cover_letter` (text)
      - `status` (enum)
      - `applied_at` (timestamp)
  2. Security
    - Enable RLS on `applications` table
    - Add policies for users to manage their own applications
*/

CREATE TYPE application_status AS ENUM ('pending', 'reviewed', 'interview', 'rejected', 'hired');

CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  job_id uuid REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
  resume_url text NOT NULL,
  cover_letter text DEFAULT '',
  status application_status DEFAULT 'pending',
  applied_at timestamptz DEFAULT now(),
  UNIQUE(user_id, job_id)
);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own applications"
  ON applications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own applications"
  ON applications
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own applications"
  ON applications
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);