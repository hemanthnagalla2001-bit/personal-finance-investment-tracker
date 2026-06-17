const delay = () => new Promise((r) => setTimeout(r, 200 + Math.random() * 200));

const DEMO_TOKEN = "demo-finance-token-2024";
const DEMO_USER = { email: "demo@finance.com", fullName: "Jordan Smith" };

const DASHBOARD_SUMMARY = {
  totalIncome: 87400.0,
  totalExpenses: 52180.0,
  netSavings: 35220.0,
  totalInvestmentValue: 142600.0,
  expensesByCategory: {
    Housing: 18000,
    Food: 9600,
    Transport: 6500,
    Entertainment: 4200,
    Healthcare: 3800,
    Utilities: 4080,
    Other: 6000,
  },
  monthlyIncomeExpense: [
    { month: 1, year: 2024, income: 7200, expense: 4300 },
    { month: 2, year: 2024, income: 7200, expense: 4100 },
    { month: 3, year: 2024, income: 7400, expense: 4600 },
    { month: 4, year: 2024, income: 7200, expense: 3900 },
    { month: 5, year: 2024, income: 7600, expense: 4700 },
    { month: 6, year: 2024, income: 7800, expense: 4400 },
    { month: 7, year: 2024, income: 7200, expense: 4200 },
    { month: 8, year: 2024, income: 8000, expense: 4500 },
    { month: 9, year: 2024, income: 7200, expense: 4100 },
    { month: 10, year: 2024, income: 7400, expense: 4380 },
    { month: 11, year: 2024, income: 7200, expense: 4900 },
    { month: 12, year: 2024, income: 9200, expense: 5000 },
  ],
  investmentsByAssetType: {
    Stocks: 68000,
    ETFs: 34000,
    Bonds: 18000,
    "Real Estate": 15000,
    Crypto: 7600,
  },
  savingsGoalProgress: [
    { goalName: "Emergency Fund", targetAmount: 25000, currentAmount: 22500, progressPercentage: 90.0, targetDate: "2024-09-01" },
    { goalName: "Vacation Fund", targetAmount: 8000, currentAmount: 5600, progressPercentage: 70.0, targetDate: "2024-12-01" },
    { goalName: "New Car", targetAmount: 35000, currentAmount: 14000, progressPercentage: 40.0, targetDate: "2025-06-01" },
  ],
};

const INCOMES = [
  { id: 1, amount: 7200, source: "SALARY", description: "Monthly salary", date: "2024-06-01" },
  { id: 2, amount: 350, source: "FREELANCE", description: "Web consulting", date: "2024-06-08" },
  { id: 3, amount: 180, source: "INVESTMENT", description: "Dividend payment", date: "2024-06-15" },
  { id: 4, amount: 70, source: "OTHER", description: "Cashback rewards", date: "2024-06-20" },
];

const EXPENSES = [
  { id: 1, amount: 1800, category: "Housing", description: "Monthly rent", date: "2024-06-01" },
  { id: 2, amount: 650, category: "Transport", description: "Car insurance", date: "2024-06-02" },
  { id: 3, amount: 280, category: "Food", description: "Grocery shopping", date: "2024-06-05" },
  { id: 4, amount: 120, category: "Entertainment", description: "Streaming subscriptions", date: "2024-06-06" },
  { id: 5, amount: 340, category: "Healthcare", description: "Dental checkup", date: "2024-06-10" },
  { id: 6, amount: 95, category: "Utilities", description: "Internet bill", date: "2024-06-12" },
  { id: 7, amount: 420, category: "Food", description: "Dining out", date: "2024-06-14" },
  { id: 8, amount: 200, category: "Other", description: "Clothing", date: "2024-06-18" },
];

const INVESTMENTS = [
  { id: 1, assetType: "Stocks", name: "Apple Inc.", ticker: "AAPL", quantity: 50, purchasePrice: 165.0, currentPrice: 182.5, currentValue: 9125.0, gainLoss: 875.0, gainLossPct: 10.6 },
  { id: 2, assetType: "Stocks", name: "Microsoft", ticker: "MSFT", ticker2: "MSFT", quantity: 30, purchasePrice: 310.0, currentPrice: 378.0, currentValue: 11340.0, gainLoss: 2040.0, gainLossPct: 21.9 },
  { id: 3, assetType: "ETFs", name: "Vanguard S&P 500", ticker: "VOO", quantity: 80, purchasePrice: 380.0, currentPrice: 418.0, currentValue: 33440.0, gainLoss: 3040.0, gainLossPct: 10.0 },
  { id: 4, assetType: "Bonds", name: "US Treasury 10Y", ticker: "GOVT", quantity: 100, purchasePrice: 95.0, currentPrice: 93.5, currentValue: 9350.0, gainLoss: -150.0, gainLossPct: -1.6 },
  { id: 5, assetType: "Crypto", name: "Bitcoin", ticker: "BTC", quantity: 0.12, purchasePrice: 42000.0, currentPrice: 63333.0, currentValue: 7600.0, gainLoss: 2560.0, gainLossPct: 50.8 },
];

const SAVINGS_GOALS = DASHBOARD_SUMMARY.savingsGoalProgress.map((g, i) => ({ id: i + 1, ...g }));

function mockResponse(url) {
  const u = url || "";

  if (u.includes("/auth/login") || u.includes("/auth/register")) {
    return { token: DEMO_TOKEN, ...DEMO_USER };
  }
  if (u.includes("/dashboard/summary")) return DASHBOARD_SUMMARY;
  if (u.includes("/incomes")) return Array.isArray([]) ? INCOMES : INCOMES;
  if (u.includes("/expenses")) return EXPENSES;
  if (u.includes("/investments")) return INVESTMENTS;
  if (u.includes("/savings-goals")) return SAVINGS_GOALS;

  return {};
}

export async function demoAdapter(config) {
  await delay();
  const data = mockResponse(config.url);
  return { data, status: 200, statusText: "OK", headers: {}, config, request: {} };
}
