require('dotenv').config({ path: './.env.local' });
console.log('STRIPE_SECRET_KEY from test-env.js:', process.env.STRIPE_SECRET_KEY);
console.log('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY from test-env.js:', process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
