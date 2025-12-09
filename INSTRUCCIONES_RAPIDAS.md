# Quick Start - HelpDeskPro

## Steps to run the project

### 1. Configure MongoDB Atlas (5 minutes)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a cluster (select the FREE plan)
4. In "Database Access": Create a user with a password
5. In "Network Access": Add 0.0.0.0/0 (allow all IPs)
6. Click on "Connect" → "Connect your application"
7. Copy the connection string

### 2. Configure Gmail (3 minutes)

1. Go to https://myaccount.google.com/
2. Security → 2-Step Verification (turn on)
3. Security → App passwords
4. Generate a password for "Mail"
5. Copy the generated password

### 3. Configure environment variables

Edit the `.env.local` file and replace:

```env
MONGODB_URI=<paste-your-mongodb-string-here>
EMAIL_USER=<your-email@gmail.com>
EMAIL_PASS=<paste-app-password-here>
NEXT_PUBLIC_API_URL=http://localhost:3000
JWT_SECRET=helpdeskpro-secret-key-change-in-production
```

### 4. Install and run

```bash
npm install
npm run dev
```

### 5. Create Users

The system starts empty. You must create your users:

1. Go to http://localhost:3000/register
2. Create a **Client** by selecting the "Client" role
3. Create an **Agent** by selecting the "Agent" role

### 6. Test the application

Use the credentials you just created to log in.

### 7. Activate reminders (optional)

Visit: http://localhost:3000/api/cron

---

## Ready!

The application is running at: http://localhost:3000

## Test emails

1. Create a ticket as a customer
2. Check your inbox
3. Respond as an agent
4. The customer will receive an email

## Full test flow

1. Login as customer → Create ticket
2. Logout → Login as agent
3. View the ticket → Change status to "In Progress"
4. Add a comment
5. Change status to "Closed"
6. Verify received emails

---

Enjoy HelpDeskPro!
