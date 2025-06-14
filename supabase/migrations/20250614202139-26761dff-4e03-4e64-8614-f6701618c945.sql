
-- Update a user's role to admin based on email
UPDATE user_roles
SET role = 'admin'
WHERE user_id = (
  SELECT id FROM users WHERE email = 'YOUR_ADMIN_EMAIL_HERE'
);

-- If the user does not have a user_roles entry, insert one
INSERT INTO user_roles (user_id, role)
SELECT id, 'admin' FROM users
WHERE email = 'YOUR_ADMIN_EMAIL_HERE'
  AND id NOT IN (SELECT user_id FROM user_roles);
