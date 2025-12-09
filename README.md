
## Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas (free account) or local MongoDB
- Gmail account for sending emails

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd helpdeskpro
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root with the following variables:

```env
# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/helpdeskpro?retryWrites=true&w=majority

# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# App Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000
JWT_SECRET=helpdeskpro-secret-key-change-in-production
```


### 4. Create Users

The system starts with an empty database. To start using the application:

1. Go to the registration page: http://localhost:3000/register
2. Create a **Client** account:
   - Name: Test Client
   - Email: client@test.com
   - Password: Your password
   - Role: Client
   - ID: 12345

3. Create an **Agent** account:
   - Name: Test Agent
   - Email: agent@test.com
   - Password: Your password
   - Role: Agent
   - ID: 67890

### 5. Start the development server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

### 6. Activate Cron Jobs (optional)

Visit http://localhost:3000/api/cron to activate automatic reminders.

## Application Usage

### As a Customer

1. Log in with a customer account
2. On the dashboard, you will see your tickets
3. Create a new ticket with the "+ Create Ticket" button
4. Complete the form with:
   - Problem title
   - Detailed description
   - Your ID, name, and email
   - Priority (low, medium, high)
5. You will receive a confirmation email
6. You can view the ticket details and add comments
7. You will receive emails when an agent responds

### As an Agent

1. Log in with an agent account
2. You will see all tickets on the dashboard
3. Use filters to search by status or priority
4. Click on a ticket to view details
5. You can:
   - Change status (open, in progress, resolved, closed)
   - Change priority
   - Respond to the customer via comments
6. When closing a ticket, an email will be sent to the customer

## Project Structure

```
helpdeskpro/
├── app/
│   ├── api/                    # API Routes
│   │   ├── auth/              # Authentication (login, register)
│   │   ├── tickets/           # Ticket management
│   │   ├── comments/          # Comment system
│   │   ├── cron/              # Cron jobs initialization
│   ├── client/                # Customer pages
│   │   ├── dashboard/         # Customer dashboard
│   │   └── tickets/           # Create and view tickets
│   ├── agent/                 # Agent pages
│   │   ├── dashboard/         # Agent dashboard
│   │   └── tickets/           # Manage tickets
│   ├── login/                 # Login page
│   └── layout.tsx             # Main layout with AuthProvider
├── components/
│   └── ui/                    # Reusable components
│       ├── Button.tsx
│       ├── Badge.tsx
│       └── Card.tsx
├── contexts/
│   └── AuthContext.tsx        # Context API for authentication
├── lib/
│   ├── mongodb.ts             # MongoDB connection
│   ├── emailService.ts        # Email service
│   └── cronJobs.ts            # Cron jobs for reminders
├── models/
│   ├── User.ts                # User model
│   ├── Ticket.ts              # Ticket model
│   └── Comment.ts             # Comment model
├── services/
│   ├── ticketService.ts       # Ticket service (Axios)
│   └── commentService.ts      # Comment service (Axios)
```

## Application Flow

### Customer Flow

1. **Login** → Customer dashboard
2. **Create ticket** → Form with validations
3. **Email sent** → Creation confirmation
4. **View tickets** → Card grid with badges
5. **Ticket detail** → Conversation with agent
6. **Add comment** → Email to agent
7. **Ticket closed** → Close email

### Agent Flow

1. **Login** → Agent dashboard
2. **View all tickets** → With filters and statistics
3. **Open ticket** → View full details
4. **Change status/priority** → Real-time update
5. **Respond** → Email to customer
6. **Close ticket** → Closing email to customer

### Cron Job (Automatic)

- Runs daily at 9:00 AM
- Searches for open tickets with no response in 24h
- Sends reminder emails to agents

## Manual Testing

### Test ticket creation

1. Login as customer
2. Create ticket with high priority
3. Verify received email
4. Verify it appears on the dashboard

### Test agent management

1. Login as agent
2. Filter by high priority
3. Open the created ticket
4. Change status to "In Progress"
5. Add a comment
6. Verify email to customer

### Test ticket closure

1. As agent, change status to "Closed"
2. Verify close email
3. As customer, verify that comments cannot be added

## Screenshots

### Login
![Login](docs/screenshots/login.png)

### Customer Dashboard
![Customer Dashboard](docs/screenshots/client-dashboard.png)

### Create Ticket
![Create Ticket](docs/screenshots/new-ticket.png)

### Agent Dashboard
![Agent Dashboard](docs/screenshots/agent-dashboard.png)

### Ticket Detail
![Detail](docs/screenshots/ticket-detail.png)

## Troubleshooting

### MongoDB connection error

- Verify the connection URL is correct
- Ensure your IP is allowed in MongoDB Atlas
- Verify username and password are correct

### Emails not sending

- Verify `EMAIL_USER` and `EMAIL_PASS` are configured
- Make sure to use an app password, not your normal password
- Check console for specific errors

### Cron jobs not working

- Visit `/api/cron` to initialize them manually
- Check server console logs

## Developer Data

- **Name**: [Your Name]
- **Clan**: [Your Clan]
- **Email**: [your-email@example.com]
- **Document**: [Your Identity Document]

## License

This project was developed as part of an academic exercise.

## Acknowledgments

Developed with Next.js, TypeScript, and lots of coffee
