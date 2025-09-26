/*
  # Create jobs table

  1. New Tables
    - `jobs`
      - `id` (uuid, primary key)
      - `title` (text)
      - `company` (text)
      - `location` (text)
      - `type` (text)
      - `salary_range` (text)
      - `description` (text)
      - `requirements` (text array)
      - `benefits` (text array)
      - `posted_date` (date)
      - `application_deadline` (date)
      - `created_at` (timestamp)
  2. Security
    - Enable RLS on `jobs` table
    - Add policy for all users to read job data
*/

CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  company text NOT NULL,
  location text NOT NULL,
  type text NOT NULL DEFAULT 'full-time',
  salary_range text NOT NULL,
  description text NOT NULL,
  requirements text[] DEFAULT '{}',
  benefits text[] DEFAULT '{}',
  posted_date date DEFAULT CURRENT_DATE,
  application_deadline date,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Jobs are viewable by everyone"
  ON jobs
  FOR SELECT
  TO authenticated, anon
  USING (true);

-- Insert sample jobs
INSERT INTO jobs (title, company, location, type, salary_range, description, requirements, benefits) VALUES
  (
    'Senior Frontend Developer',
    'TechCorp Inc.',
    'San Francisco, CA',
    'full-time',
    '$120,000 - $160,000',
    'We are seeking a talented Senior Frontend Developer to join our growing team. You will be responsible for building modern, responsive web applications using React, TypeScript, and other cutting-edge technologies. This role offers the opportunity to work on challenging projects and mentor junior developers.',
    ARRAY['5+ years of frontend development experience', 'Proficiency in React, TypeScript, and modern JavaScript', 'Experience with state management libraries (Redux, Zustand)', 'Strong CSS skills and responsive design', 'Experience with testing frameworks (Jest, Cypress)', 'Bachelor''s degree in Computer Science or related field'],
    ARRAY['Competitive salary and equity package', 'Comprehensive health, dental, and vision insurance', 'Flexible work schedule and remote work options', '401(k) matching', 'Professional development budget', 'Catered lunch and snacks']
  ),
  (
    'Product Manager',
    'StartupXYZ',
    'New York, NY',
    'full-time',
    '$100,000 - $140,000',
    'Join our dynamic startup as a Product Manager where you''ll drive product strategy and work closely with engineering and design teams. You''ll be responsible for defining product roadmaps, gathering user feedback, and ensuring successful product launches.',
    ARRAY['3+ years of product management experience', 'Strong analytical and problem-solving skills', 'Experience with agile development methodologies', 'Excellent communication and leadership skills', 'Data-driven decision making approach', 'Experience with product analytics tools'],
    ARRAY['Competitive salary and significant equity', 'Flexible PTO policy', 'Health and wellness benefits', 'Learning and development opportunities', 'Modern office space in Manhattan', 'Team building events and company retreats']
  ),
  (
    'UX/UI Designer',
    'DesignStudio Pro',
    'Remote',
    'contract',
    '$80 - $120 per hour',
    'We''re looking for a creative UX/UI Designer to help us create beautiful, user-centered digital experiences. You''ll work on various projects ranging from mobile apps to web platforms, collaborating with cross-functional teams to deliver exceptional user experiences.',
    ARRAY['4+ years of UX/UI design experience', 'Proficiency in Figma, Sketch, or Adobe Creative Suite', 'Strong portfolio demonstrating design process', 'Experience with user research and usability testing', 'Understanding of responsive design principles', 'Knowledge of design systems and component libraries'],
    ARRAY['Flexible contract terms', 'Opportunity to work with diverse clients', 'Professional development support', 'Access to design tools and software', 'Potential for long-term partnership', 'Work with talented design team']
  ),
  (
    'Data Scientist',
    'Analytics Corp',
    'Austin, TX',
    'full-time',
    '$110,000 - $150,000',
    'Be part of our data science team working on machine learning models and advanced analytics. You''ll analyze large datasets, build predictive models, and provide insights that drive business decisions across the organization.',
    ARRAY['Master''s degree in Data Science, Statistics, or related field', '3+ years of data science experience', 'Proficiency in Python, R, and SQL', 'Experience with machine learning frameworks (TensorFlow, PyTorch)', 'Strong statistical analysis skills', 'Experience with cloud platforms (AWS, GCP, Azure)'],
    ARRAY['Competitive salary with performance bonuses', 'Comprehensive benefits package', 'Flexible work arrangements', 'Conference attendance and training budget', 'Access to latest data science tools', 'Collaborative and innovative work environment']
  ),
  (
    'Marketing Coordinator',
    'GrowthAgency',
    'Chicago, IL',
    'part-time',
    '$25 - $35 per hour',
    'Support our marketing team in executing campaigns across digital channels. This part-time role is perfect for someone looking to grow their marketing skills while maintaining work-life balance. You''ll assist with content creation, social media management, and campaign analytics.',
    ARRAY['1-2 years of marketing experience', 'Familiarity with social media platforms', 'Basic knowledge of Google Analytics and marketing tools', 'Strong written and verbal communication skills', 'Creative thinking and attention to detail', 'Bachelor''s degree in Marketing or related field'],
    ARRAY['Flexible part-time schedule', 'Opportunity for full-time conversion', 'Professional mentorship program', 'Access to marketing tools and platforms', 'Performance-based bonuses', 'Team building activities']
  ),
  (
    'DevOps Engineer',
    'CloudTech Solutions',
    'Seattle, WA',
    'full-time',
    '$130,000 - $170,000',
    'Join our infrastructure team as a DevOps Engineer focused on cloud architecture and automation. You''ll work on building scalable systems, implementing CI/CD pipelines, and ensuring high availability of our production systems.',
    ARRAY['4+ years of DevOps/infrastructure experience', 'Strong experience with AWS, Docker, and Kubernetes', 'Proficiency in Infrastructure as Code (Terraform, CloudFormation)', 'Experience with CI/CD tools (Jenkins, GitLab CI)', 'Knowledge of monitoring and logging tools', 'Scripting skills in Python, Bash, or Go'],
    ARRAY['Highly competitive salary', 'Stock options', 'Premium healthcare coverage', 'Unlimited PTO', 'Home office setup allowance', 'Annual technology budget']
  );