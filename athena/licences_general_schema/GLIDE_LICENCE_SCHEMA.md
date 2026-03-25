═══════════════════════════════════════════════════════════════════════════════
🗄️ DATABASE LICENCE MODULE TABLES 
═══════════════════════════════════════════════════════════════════════════════

1. license_subscriptions
   ├─ Stores subscription plans
   ├─ Fields: id, plan_name, description, amount, currency, billing_cycle,
   │          features, is_active, timestamps, audit fields
   └─ Default plan: "Standard Monthly Plan" (KES 5,000)

2. bills
   ├─ Stores monthly bills
   ├─ Fields: id, bill_number, subscription_id, bill_month, due_date,
   │          amount, paid_amount, balance, status, notes,
   │          is_auto_generated, timestamps, audit fields
   ├─ Statuses: pending, partial, paid, overdue, cancelled
   └─ Foreign Key: subscription_id → license_subscriptions(id)

3. bill_payments
   ├─ Stores payment records
   ├─ Fields: id, payment_number, bill_id, payment_date, amount,
   │          payment_method, transaction_reference, notes, receipt_url,
   │          timestamps, audit fields
   └─ Foreign Key: bill_id → bills(id)
