-- ==========================================
-- SAMPLE USERS
-- ==========================================

INSERT INTO users (name, email, password, role)
VALUES 
('Harini Jobseeker', 'jobseeker@test.com', 'hashedpassword', 'jobseeker'),
('Test Employer', 'employer@test.com', 'hashedpassword', 'employer');

-- ==========================================
-- SAMPLE COMPANY
-- ==========================================

INSERT INTO companies (name, website, industry, size, verification_status)
VALUES 
('Tech Solutions Pvt Ltd', 'www.techsolutions.com', 'Information Technology', '100-500', 'verified');

-- ==========================================
-- SAMPLE EMPLOYER
-- ==========================================

INSERT INTO employers (user_id, company_id, recruiter_name, designation, mobile)
VALUES 
(2, 1, 'HR Manager', 'Senior HR', '+919999999999');

-- ==========================================
-- SAMPLE JOBS
-- ==========================================

INSERT INTO jobs (
    employer_id,
    title,
    description,
    location,
    salary_min,
    salary_max,
    job_type,
    experience_min,
    experience_max
)
VALUES 
(1, 'Backend Developer - Node.js', 'Looking for experienced Node.js developer', 'Hyderabad', 500000, 900000, 'full-time', 2, 5),
(1, 'Frontend Developer - React', 'Looking for React developer', 'Bangalore', 400000, 800000, 'full-time', 1, 4);

-- ==========================================
-- SAMPLE SKILLS
-- ==========================================

INSERT INTO skills (name)
VALUES 
('Node.js'),
('React'),
('MongoDB'),
('AWS');

-- ==========================================
-- ASSIGN SKILLS TO USER
-- ==========================================

INSERT INTO user_skills (user_id, skill_id, proficiency, experience_years)
VALUES 
(1, 1, 'Expert', 4),
(1, 3, 'Intermediate', 3);

-- ==========================================
-- ASSIGN SKILLS TO JOB
-- ==========================================

INSERT INTO job_skills (job_id, skill_id)
VALUES 
(1, 1),
(1, 3),
(2, 2);

-- ==========================================
-- SAMPLE APPLICATION
-- ==========================================

INSERT INTO applications (job_id, user_id, cover_letter, status)
VALUES 
(1, 1, 'I am very interested in this position.', 'applied');