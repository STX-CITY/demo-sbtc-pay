# 🎓 BlockchainEdu - Demo sBTC Pay Education Store

A demonstration of an online education platform that integrates with sBTC Pay for Bitcoin payments. This project showcases how to build an e-commerce store that accepts Bitcoin payments through the sBTC Pay API and webhook system.

## ✨ Features

- **Course Catalog**: Browse blockchain and Web3 education courses
- **Shopping Cart**: Add multiple courses to cart
- **sBTC Payments**: Secure Bitcoin payments via sBTC Pay API
- **Webhook Integration**: Real-time payment status updates
- **Order Management**: Track purchases and course enrollments
- **Responsive Design**: Mobile-friendly interface

## 🛠 Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Database**: SQLite with better-sqlite3
- **Payments**: sBTC Pay API integration
- **Webhooks**: Real-time payment notifications

## 📋 Prerequisites

Before running this demo, ensure you have:

1. **sBTC Pay Server Running**: The main sBTC Pay application should be running on `http://localhost:3000`
2. **Node.js**: Version 18 or higher
3. **npm**: Package manager

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy the environment template:
```bash
cp .env.example .env.local
```

Update `.env.local` with your configuration:
```env
SBTC_PAY_API_URL=http://localhost:3000
SBTC_PAY_MERCHANT_ID=your-merchant-id
WEBHOOK_URL=http://localhost:3001/api/webhooks
WEBHOOK_SECRET=your-webhook-secret
```

### 3. Start Development Server

```bash
npm run dev
```

The demo store will be available at `http://localhost:3001`

## 🔧 Configuration

### sBTC Pay Integration

The demo integrates with sBTC Pay through several API endpoints:

- **Payment Intent Creation**: `POST /api/v1/payment_intents`
- **Payment Status**: `GET /api/v1/public/payment_intents/{id}`
- **Webhook Notifications**: Receives payment updates

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `SBTC_PAY_API_URL` | sBTC Pay server URL | `http://localhost:3000` |
| `SBTC_PAY_MERCHANT_ID` | Your merchant ID from sBTC Pay | Required |
| `WEBHOOK_URL` | Your webhook endpoint URL | `http://localhost:3001/api/webhooks` |
| `WEBHOOK_SECRET` | Secret for webhook signature verification | Required |

## 🎯 Usage Flow

### 1. Browse Courses
- Visit the home page to see featured courses
- Browse all courses at `/courses`
- Filter by category, level, or search

### 2. Add to Cart
- Click "View Course" on any course
- Click "Add to Cart" on the course detail page
- Review items in cart at `/cart`

### 3. Checkout Process
- Enter email address in cart
- Click "Pay with sBTC" to create payment intent
- Get redirected to checkout page with payment instructions

### 4. Payment
- Copy the recipient address, amount, and memo
- Send sBTC payment from your wallet
- Or click "I've Sent the Payment" for manual verification

### 5. Confirmation
- Payment status updates automatically via webhooks
- Successful payments grant course access
- Failed payments can be retried

## 🗃 Database Schema

The demo uses SQLite with the following tables:

### Courses
```sql
CREATE TABLE courses (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,        -- Price in sBTC microunits
  price_usd REAL NOT NULL,       -- Price in USD
  instructor TEXT NOT NULL,
  duration TEXT,
  level TEXT,                    -- Beginner/Intermediate/Advanced
  category TEXT,                 -- Blockchain/Development/Finance/etc
  image_url TEXT,
  features TEXT,                 -- JSON array of features
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Orders
```sql
CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  payment_intent_id TEXT UNIQUE,
  customer_email TEXT,
  course_ids TEXT NOT NULL,      -- JSON array of course IDs
  total_amount INTEGER NOT NULL,
  total_amount_usd REAL NOT NULL,
  status TEXT DEFAULT 'pending', -- pending/processing/completed/failed
  tx_id TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Enrollments
```sql
CREATE TABLE enrollments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id TEXT NOT NULL,
  course_id TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  access_granted_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Webhook Events
```sql
CREATE TABLE webhook_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id TEXT UNIQUE,
  event_type TEXT NOT NULL,
  payload TEXT NOT NULL,
  processed BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 🔌 API Endpoints

### Course Management
- `GET /api/courses/[id]` - Get course details
- `GET /api/cart` - Get cart contents
- `POST /api/cart` - Add course to cart
- `DELETE /api/cart` - Remove course from cart

### Payment Processing
- `POST /api/checkout` - Create payment intent and redirect to sBTC Pay
- `GET /api/payment-intent/[id]` - Get payment intent status (proxy to sBTC Pay)

### Webhooks
- `POST /api/webhooks` - Receive payment notifications from sBTC Pay
- `GET /api/webhooks` - Webhook health check

## 🎮 Demo Data

The application comes with 6 pre-loaded courses:

1. **Introduction to Blockchain** ($49) - Beginner
2. **Smart Contract Development** ($149) - Intermediate  
3. **DeFi Masterclass** ($299) - Advanced
4. **NFT Creation Workshop** ($99) - Beginner
5. **Building on Bitcoin with Stacks** ($199) - Intermediate
6. **Web3 Security & Auditing** ($249) - Advanced

## 🔄 Webhook Integration

The webhook handler at `/api/webhooks` processes these events:

- `payment_intent.succeeded` - Grants course access
- `payment_intent.failed` - Updates order status
- `payment_intent.canceled` - Marks order as canceled

### Webhook Security

Webhooks are secured using HMAC signature verification similar to sBTC Pay's implementation.

## 🚦 Development

### Running Tests

```bash
npm test
```

### Building for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## 🛟 Troubleshooting

### Common Issues

1. **Database errors**: Make sure the SQLite file has proper permissions
2. **sBTC Pay connection**: Ensure the main sBTC Pay server is running
3. **Webhook issues**: Check that the webhook URL is accessible from sBTC Pay server
4. **Payment status**: Verify merchant ID matches your sBTC Pay configuration

### Debug Mode

Set `NODE_ENV=development` for detailed logging:

```bash
NODE_ENV=development npm run dev
```

## 📚 Learning Resources

This demo showcases:

- Next.js App Router with TypeScript
- Server-side database operations with SQLite
- API integration patterns
- Webhook signature verification
- Real-time payment status updates
- E-commerce cart and checkout flow

## 🤝 Contributing

This is a demo project, but feel free to:

1. Fork the repository
2. Create a feature branch
3. Make improvements
4. Submit a pull request

## 📄 License

This project is for demonstration purposes. See the main sBTC Pay project for licensing information.

## 🔗 Links

- [sBTC Pay Repository](https://github.com/your-org/sbtc-pay)
- [Stacks Documentation](https://docs.stacks.co)
- [sBTC Documentation](https://docs.stacks.co/sbtc)

---

Built with ❤️ for the Bitcoin and Stacks ecosystem
