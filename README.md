# Personal Finance & Investment Tracker

A full-stack web application for tracking personal finances, expenses, income, savings goals, and investment portfolios with interactive dashboards.

## Features

- User registration and JWT-based authentication
- Expense tracking with categories and filtering
- Income tracking by source
- Savings goals with progress visualization
- Investment portfolio management with gain/loss tracking
- Interactive dashboard with Chart.js visualizations:
  - Spending by category (Pie chart)
  - Income vs Expenses (Bar chart)
  - Investment allocation (Doughnut chart)
  - Savings goal progress bars
- Secure data isolation — each user sees only their own data
- Responsive UI with a clean modern design

## Tech Stack

### Backend
- Java 17
- Spring Boot 3.2
- Spring Security (JWT authentication)
- Spring Data JPA
- MySQL 8
- Lombok
- Maven

### Frontend
- React 18
- React Router v6
- Axios
- Chart.js + react-chartjs-2
- CSS3 (custom, responsive)

---

## Project Structure

```
personal-finance-investment-tracker/
├── backend/                  # Spring Boot application
│   ├── src/main/java/com/finance/tracker/
│   │   ├── config/           # Security & CORS config
│   │   ├── controller/       # REST controllers
│   │   ├── dto/              # Data transfer objects
│   │   ├── entity/           # JPA entities
│   │   ├── exception/        # Global exception handling
│   │   ├── repository/       # Spring Data repositories
│   │   ├── security/         # JWT filter & UserDetailsService
│   │   └── service/          # Business logic
│   └── src/main/resources/
│       └── application.properties
├── frontend/                 # React application
│   ├── public/
│   └── src/
│       ├── components/       # Reusable UI components
│       ├── context/          # React Context (Auth)
│       ├── pages/            # Page components
│       ├── services/         # Axios API calls
│       └── styles/           # CSS stylesheets
├── .gitignore
└── README.md
```

---

## Prerequisites

- Java 17+
- Maven 3.8+
- Node.js 18+ and npm
- MySQL 8.0+

---

## Database Setup

1. Start MySQL and open a client (MySQL Workbench, CLI, etc.)
2. Create the database:

```sql
CREATE DATABASE finance_tracker_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

3. Create a user (or use root for development):

```sql
CREATE USER 'finance_user'@'localhost' IDENTIFIED BY 'yourpassword';
GRANT ALL PRIVILEGES ON finance_tracker_db.* TO 'finance_user'@'localhost';
FLUSH PRIVILEGES;
```

---

## Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Open `src/main/resources/application.properties` and set your credentials:

```properties
spring.datasource.username=YOUR_MYSQL_USERNAME
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

3. Build and run:

```bash
mvn clean install
mvn spring-boot:run
```

The backend starts on **http://localhost:8080**.

Tables are created automatically via `spring.jpa.hibernate.ddl-auto=update`.

---

## Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

The frontend starts on **http://localhost:3000** and proxies API calls to the backend.

---

## Environment Configuration

Backend `application.properties`:

| Property | Description |
|---|---|
| `spring.datasource.url` | MySQL connection URL |
| `spring.datasource.username` | MySQL username |
| `spring.datasource.password` | MySQL password |
| `jwt.secret` | 64-char hex string for JWT signing |
| `jwt.expiration` | Token validity in ms (default: 86400000 = 24h) |
| `cors.allowed-origins` | Frontend URL (default: http://localhost:3000) |

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT |

### Expenses
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/expenses` | Get all user expenses |
| GET | `/api/expenses/{id}` | Get expense by ID |
| POST | `/api/expenses` | Create new expense |
| PUT | `/api/expenses/{id}` | Update expense |
| DELETE | `/api/expenses/{id}` | Delete expense |

### Income
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/income` | Get all user income records |
| GET | `/api/income/{id}` | Get income by ID |
| POST | `/api/income` | Create new income record |
| PUT | `/api/income/{id}` | Update income record |
| DELETE | `/api/income/{id}` | Delete income record |

### Savings Goals
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/savings-goals` | Get all savings goals |
| GET | `/api/savings-goals/{id}` | Get goal by ID |
| POST | `/api/savings-goals` | Create new savings goal |
| PUT | `/api/savings-goals/{id}` | Update savings goal |
| DELETE | `/api/savings-goals/{id}` | Delete savings goal |

### Investments
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/investments` | Get all investments |
| GET | `/api/investments/{id}` | Get investment by ID |
| POST | `/api/investments` | Create new investment |
| PUT | `/api/investments/{id}` | Update investment |
| DELETE | `/api/investments/{id}` | Delete investment |

### Dashboard
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/dashboard/summary` | Get full dashboard summary |

#### Dashboard Response Schema
```json
{
  "totalIncome": 5000.00,
  "totalExpenses": 2500.00,
  "netSavings": 2500.00,
  "totalInvestmentValue": 15000.00,
  "savingsGoalProgress": [
    {
      "goalName": "Emergency Fund",
      "targetAmount": 10000.00,
      "currentAmount": 4000.00,
      "progressPercentage": 40.0
    }
  ],
  "expensesByCategory": {
    "Food": 800.00,
    "Transport": 300.00
  },
  "monthlyIncomeExpense": [
    { "year": 2024, "month": 1, "income": 5000.00, "expense": 2500.00 }
  ],
  "investmentsByAssetType": {
    "Stocks": 10000.00,
    "ETF": 5000.00
  }
}
```

All protected endpoints require the header:
```
Authorization: Bearer <jwt_token>
```

---

## Screenshots

> Screenshots will be added after deployment.

---

## Future Improvements

- Budget planning with monthly limits per category
- Recurring transaction scheduling
- CSV/PDF export for reports
- Multi-currency support
- Email notifications for goal milestones
- Mobile app via React Native
- Two-factor authentication
- Dark mode toggle
