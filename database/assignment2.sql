-- 5.1
INSERT INTO public.account (
	account_firstname,
	account_lastname,
	account_email,
	account_password
) VALUES (
'Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n'
);

-- 5.2
UPDATE public.account
SET account_type = 'Admin'
-- The only account so far
WHERE account_id = 1;

-- 5.3
DELETE FROM public.account
WHERE account_id = 1;

-- 5.4
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
-- GM Hummer
WHERE inv_id = 10;

-- 5.5
SELECT
a.inv_make "Make",
a.inv_model "Model",
b.classification_name "Classification"
FROM public.inventory a
JOIN public.classification b ON a.classification_id = b.classification_id
WHERE b.classification_name = 'Sport';

-- 5.6
UPDATE public.inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');