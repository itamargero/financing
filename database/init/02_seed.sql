-- Seed data for development
-- Insert sample blog categories
INSERT INTO blog_categories (name, slug, description) VALUES
('Personal Loans', 'personal-loans', 'Information about personal loan products and tips'),
('Business Loans', 'business-loans', 'Business financing and loan options'),
('Financial Tips', 'financial-tips', 'General financial advice and money management'),
('Credit Score', 'credit-score', 'Credit score improvement and monitoring'),
('Loan Guides', 'loan-guides', 'Step-by-step guides for loan applications');

-- Insert sample lenders (including from www app)
INSERT INTO lenders (name, slug, description, website_url, phone, email, address, rating, review_count, is_verified, is_active, minimum_loan_amount, maximum_loan_amount, minimum_interest_rate, maximum_interest_rate, processing_time_days, requirements) VALUES
-- Original lenders
('BPI Personal Loan', 'bpi-personal-loan', 'Bank of the Philippine Islands offers competitive personal loan rates with fast approval.', 'https://www.bpi.com.ph', '+63-2-89-100', 'loans@bpi.com.ph', 'Ayala Avenue, Makati City', 4.2, 156, true, true, 30000.00, 2000000.00, 1.42, 2.95, 3, ARRAY['Valid ID', 'Proof of Income', 'Bank Statements']),

('Metrobank Quick Cash', 'metrobank-quick-cash', 'Metropolitan Bank offers quick cash loans with minimal requirements.', 'https://www.metrobank.com.ph', '+63-2-88-700', 'quickcash@metrobank.com.ph', 'Sen. Gil Puyat Ave, Makati City', 4.0, 203, true, true, 25000.00, 1500000.00, 1.75, 3.25, 5, ARRAY['Valid ID', 'Payslip', 'Certificate of Employment']),

('UnionBank Personal Financing', 'unionbank-personal', 'Union Bank of the Philippines provides flexible personal financing solutions.', 'https://www.unionbankph.com', '+63-2-8841-8600', 'personal@unionbank.com', 'Pasig City', 4.1, 89, true, true, 50000.00, 3000000.00, 1.58, 2.88, 7, ARRAY['Valid ID', 'ITR/Certificate of Compensation', 'Bank Statements']),

('Security Bank Cash Loan', 'security-bank-cash', 'Security Bank offers instant cash loans with competitive rates.', 'https://www.securitybank.com', '+63-2-8887-9188', 'loans@securitybank.com', 'Makati City', 3.9, 124, true, true, 20000.00, 1000000.00, 2.15, 3.95, 2, ARRAY['Valid ID', 'Proof of Income']),

('RCBC MyLoan', 'rcbc-myloan', 'Rizal Commercial Banking Corporation fast and easy personal loans.', 'https://www.rcbc.com', '+63-2-8877-7222', 'myloan@rcbc.com', 'Makati City', 3.8, 97, true, true, 30000.00, 2500000.00, 1.88, 3.45, 4, ARRAY['Valid ID', 'Latest Payslip', 'Employment Certificate']),

-- Lenders from www app
('Alon Capital', 'alon-capital', 'Business loan provider with competitive rates and fast processing for business expansion needs.', 'https://www.aloncapital.ph', '+63-2-8888-1000', 'info@aloncapital.ph', 'BGC, Taguig City', 4.8, 1250, true, true, 500000.00, 3000000.00, 3.5, 3.5, 5, ARRAY['Business Registration', 'Financial Statements', 'Bank Statements']),

('QuickCash Pro', 'quickcash-pro', 'Personal loan specialist offering quick approval and competitive monthly rates for personal financing needs.', 'https://www.quickcashpro.ph', '+63-2-8888-2000', 'loans@quickcashpro.ph', 'Ortigas Center, Pasig', 4.6, 890, true, true, 100000.00, 2000000.00, 2.8, 2.8, 3, ARRAY['Valid ID', 'Proof of Income', 'Bank Statements']),

('FlexiLend', 'flexilend', 'Flexible business lending solutions with higher loan amounts and customizable payment terms.', 'https://www.flexilend.ph', '+63-2-8888-3000', 'business@flexilend.ph', 'Makati City', 4.7, 2100, true, true, 250000.00, 5000000.00, 4.2, 4.2, 7, ARRAY['Business Registration', 'Financial Statements', 'Collateral Documents']),

('FastTrack Finance', 'fasttrack-finance', 'Ultra-fast personal loan approval with same-day processing and competitive interest rates.', 'https://www.fasttrackfinance.ph', '+63-2-8888-4000', 'express@fasttrackfinance.ph', 'Quezon City', 4.5, 650, true, true, 150000.00, 1500000.00, 3.1, 3.1, 2, ARRAY['Valid ID', 'Latest Payslip']),

('SecureCredit', 'securecredit', 'Premium business financing with the highest ratings and largest loan amounts for established businesses.', 'https://www.securecredit.ph', '+63-2-8888-5000', 'premium@securecredit.ph', 'Bonifacio Global City', 4.9, 1800, true, true, 300000.00, 4000000.00, 3.8, 3.8, 4, ARRAY['Business Registration', 'Audited Financial Statements', 'Tax Returns']),

('InstantFunds', 'instantfunds', 'Same-day personal loans with minimal requirements and lowest minimum loan amounts in the market.', 'https://www.instantfunds.ph', '+63-2-8888-6000', 'instant@instantfunds.ph', 'Manila', 4.4, 420, true, true, 50000.00, 1000000.00, 2.5, 2.5, 1, ARRAY['Valid ID', 'Bank Statement']);

-- Insert sample loan products
INSERT INTO loan_products (lender_id, name, type, description, minimum_amount, maximum_amount, minimum_term_months, maximum_term_months, interest_rate_min, interest_rate_max, processing_fee, requirements, features, is_active) VALUES
((SELECT id FROM lenders WHERE slug = 'bpi-personal-loan'), 'BPI Personal Loan Standard', 'personal', 'Standard personal loan with competitive rates', 30000.00, 2000000.00, 12, 60, 1.42, 2.95, 2500.00, ARRAY['Valid ID', 'Proof of Income', 'Bank Statements'], ARRAY['No collateral required', 'Fast approval', 'Flexible payment terms'], true),

((SELECT id FROM lenders WHERE slug = 'metrobank-quick-cash'), 'Quick Cash Express', 'personal', 'Express cash loan for immediate needs', 25000.00, 500000.00, 6, 36, 2.25, 3.25, 1500.00, ARRAY['Valid ID', 'Payslip'], ARRAY['Same day approval', 'Minimal requirements', 'Online application'], true),

((SELECT id FROM lenders WHERE slug = 'unionbank-personal'), 'UB Flexi Loan', 'personal', 'Flexible personal loan with customizable terms', 50000.00, 3000000.00, 12, 84, 1.58, 2.88, 3000.00, ARRAY['Valid ID', 'ITR', 'Bank Statements'], ARRAY['Flexible terms', 'Competitive rates', 'No early payment penalty'], true),

((SELECT id FROM lenders WHERE slug = 'bpi-personal-loan'), 'BPI Business Loan', 'business', 'Business financing for SMEs', 100000.00, 10000000.00, 12, 120, 2.15, 4.25, 5000.00, ARRAY['Business Registration', 'Financial Statements', 'Bank Statements'], ARRAY['Business expansion funding', 'Working capital', 'Equipment financing'], true),

((SELECT id FROM lenders WHERE slug = 'security-bank-cash'), 'SB Auto Loan', 'auto', 'Car financing with competitive rates', 200000.00, 5000000.00, 12, 84, 1.95, 3.15, 2000.00, ARRAY['Valid ID', 'Proof of Income', 'Car Documents'], ARRAY['Up to 80% financing', 'Fast approval', 'Flexible down payment'], true);

-- Insert sample leads
INSERT INTO leads (first_name, last_name, email, phone, loan_amount, loan_purpose, employment_status, monthly_income, status, source, lender_id) VALUES
('Juan', 'Cruz', 'juan.cruz@email.com', '+63-917-123-4567', 150000.00, 'Home improvement', 'Employed', 45000.00, 'new', 'website', (SELECT id FROM lenders WHERE slug = 'bpi-personal-loan')),
('Maria', 'Santos', 'maria.santos@email.com', '+63-918-234-5678', 80000.00, 'Medical expenses', 'Employed', 35000.00, 'contacted', 'website', (SELECT id FROM lenders WHERE slug = 'metrobank-quick-cash')),
('Pedro', 'Reyes', 'pedro.reyes@email.com', '+63-919-345-6789', 250000.00, 'Business expansion', 'Self-employed', 60000.00, 'qualified', 'referral', (SELECT id FROM lenders WHERE slug = 'unionbank-personal')),
('Ana', 'Garcia', 'ana.garcia@email.com', '+63-920-456-7890', 120000.00, 'Debt consolidation', 'Employed', 40000.00, 'new', 'website', (SELECT id FROM lenders WHERE slug = 'security-bank-cash'));

-- Insert sample blog posts
INSERT INTO blog_posts (title, slug, excerpt, content, meta_title, meta_description, status, is_featured, published_at) VALUES
('How to Improve Your Credit Score in the Philippines', 'improve-credit-score-philippines', 'Learn practical steps to boost your credit score and qualify for better loan rates in the Philippines.', 
'{"type":"doc","content":[{"type":"heading","attrs":{"level":1},"content":[{"type":"text","text":"How to Improve Your Credit Score in the Philippines"}]},{"type":"paragraph","content":[{"type":"text","text":"Your credit score is crucial for getting approved for loans and credit cards. Here are proven strategies to improve it."}]},{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"1. Pay Bills on Time"}]},{"type":"paragraph","content":[{"type":"text","text":"Payment history is the most important factor in your credit score. Always pay your bills before the due date."}]}]}',
'Credit Score Philippines | How to Improve Your Credit Rating', 'Discover effective ways to improve your credit score in the Philippines. Get better loan rates and credit card approvals.', 'published', true, NOW() - INTERVAL '5 days'),

('Top 5 Personal Loan Providers in the Philippines 2024', 'top-personal-loan-providers-philippines-2024', 'Compare the best personal loan options available in the Philippines with competitive rates and fast approval.', 
'{"type":"doc","content":[{"type":"heading","attrs":{"level":1},"content":[{"type":"text","text":"Top 5 Personal Loan Providers in the Philippines 2024"}]},{"type":"paragraph","content":[{"type":"text","text":"Finding the right personal loan can be challenging. We have compared the top lenders to help you make an informed decision."}]},{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"1. BPI Personal Loan"}]},{"type":"paragraph","content":[{"type":"text","text":"Bank of the Philippine Islands offers competitive rates starting from 1.42% per month."}]}]}',
'Best Personal Loans Philippines 2024 | Compare Rates & Terms', 'Find the best personal loan providers in the Philippines. Compare interest rates, terms, and requirements.', 'published', false, NOW() - INTERVAL '2 days'),

('Business Loan Requirements in the Philippines: Complete Guide', 'business-loan-requirements-philippines-guide', 'Everything you need to know about business loan requirements and how to prepare your application.', 
'{"type":"doc","content":[{"type":"heading","attrs":{"level":1},"content":[{"type":"text","text":"Business Loan Requirements in the Philippines"}]},{"type":"paragraph","content":[{"type":"text","text":"Getting a business loan requires proper documentation and preparation. Here is your complete guide."}]}]}',
'Business Loan Requirements Philippines | Complete Application Guide', 'Learn about business loan requirements in the Philippines. Complete guide to prepare your loan application successfully.', 'published', false, NOW() - INTERVAL '1 day');

-- Insert sample reviews
INSERT INTO reviews (lender_id, rating, title, content, is_verified, is_approved) VALUES
((SELECT id FROM lenders WHERE slug = 'bpi-personal-loan'), 5, 'Excellent service and fast approval', 'Applied for a personal loan and got approved within 3 days. The interest rate was competitive and the staff was very helpful throughout the process.', true, true),
((SELECT id FROM lenders WHERE slug = 'metrobank-quick-cash'), 4, 'Quick and convenient', 'The online application was straightforward and I received the funds quickly. The only downside was the processing fee was a bit high.', true, true),
((SELECT id FROM lenders WHERE slug = 'unionbank-personal'), 4, 'Flexible terms', 'I appreciated the flexibility in payment terms. The interest rate was reasonable and the customer service was responsive.', true, true),
((SELECT id FROM lenders WHERE slug = 'security-bank-cash'), 3, 'Good rates but slow processing', 'The interest rates were attractive but the approval process took longer than expected. Overall satisfied with the loan.', true, true);

-- Link blog posts to categories
INSERT INTO blog_post_categories (blog_post_id, category_id) VALUES
((SELECT id FROM blog_posts WHERE slug = 'improve-credit-score-philippines'), (SELECT id FROM blog_categories WHERE slug = 'credit-score')),
((SELECT id FROM blog_posts WHERE slug = 'improve-credit-score-philippines'), (SELECT id FROM blog_categories WHERE slug = 'financial-tips')),
((SELECT id FROM blog_posts WHERE slug = 'top-personal-loan-providers-philippines-2024'), (SELECT id FROM blog_categories WHERE slug = 'personal-loans')),
((SELECT id FROM blog_posts WHERE slug = 'top-personal-loan-providers-philippines-2024'), (SELECT id FROM blog_categories WHERE slug = 'loan-guides')),
((SELECT id FROM blog_posts WHERE slug = 'business-loan-requirements-philippines-guide'), (SELECT id FROM blog_categories WHERE slug = 'business-loans')),
((SELECT id FROM blog_posts WHERE slug = 'business-loan-requirements-philippines-guide'), (SELECT id FROM blog_categories WHERE slug = 'loan-guides'));