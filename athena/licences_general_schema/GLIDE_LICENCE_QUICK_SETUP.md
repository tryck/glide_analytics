# Bills Module - Quick Setup Guide

## 🚀 Quick Start (5 Minutes)

### Step 1: Access Your Application

The migration will run automatically when you first access the application. All tables will be created automatically.

### Step 2: Access Bills Module

1. Log in to admin panel
2. Navigate to: `http://yourdomain.com/admin/bills`

### Step 3: Create Your First Subscription Plan

1. Go to **Subscriptions** menu
2. Click **"Add Subscription"**
3. Fill in:
   ```
   Plan Name: Standard Monthly Plan
   Description: Monthly license subscription
   Amount: 5000
   Currency: KES
   Billing Cycle: monthly
   ✓ Active
   ```
4. Click **Save**

### Step 4: Generate First Bill (Optional - Manual)

1. Go to **Bills List**
2. Click **"Generate Monthly Bill"**
3. A bill will be created for the current month

### Step 5: Record a Payment

1. Click **"View"** on the bill
2. Click **"Add Payment"**
3. Fill in payment details
4. Click **"Add Payment"**
5. Bill status will update automatically!

---

## ⏰ Setup Automated Monthly Bills (Cron Jobs)

### Get Your Cron Secret Key

1. Go to: Settings > Backup in admin panel
2. Copy your **Cron Secret Key**
3. If none exists, generate one

### Setup Cron Jobs on Your Server

#### For Linux/Ubuntu (cPanel/SSH)

**1. Monthly Bill Generation** (1st of each month at midnight)

```bash
crontab -e
```

Add this line:

```bash
0 0 1 * * /usr/bin/curl http://yourdomain.com/cron/generate_monthly_bills/YOUR_SECRET_KEY
```

**2. Update Overdue Bills** (Daily at 1 AM)

```bash
0 1 * * * /usr/bin/curl http://yourdomain.com/cron/update_overdue_bills/YOUR_SECRET_KEY
```

#### For cPanel

1. Go to **Cron Jobs** in cPanel
2. Add New Cron Job:
   - **Minute:** 0
   - **Hour:** 0
   - **Day:** 1
   - **Month:** \*
   - **Weekday:** \*
   - **Command:**
     ```
     /usr/bin/curl http://yourdomain.com/cron/generate_monthly_bills/YOUR_SECRET_KEY
     ```

#### For Windows (Task Scheduler)

1. Open Task Scheduler
2. Create Basic Task
3. Set trigger: Monthly, 1st day, 12:00 AM
4. Action: Start a program
5. Program: `curl.exe`
6. Arguments: `http://yourdomain.com/cron/generate_monthly_bills/YOUR_SECRET_KEY`

---

## 🎯 Accessing the Module

### Main URLs

- **Dashboard:** `http://yourdomain.com/admin/bills`
- **Subscriptions:** `http://yourdomain.com/admin/bills/subscriptions`
- **Bills List:** `http://yourdomain.com/admin/bills/bills_list`
- **Reports:** `http://yourdomain.com/admin/bills/reports`

---

## ✅ Verify Installation

### Check 1: Database Tables Created

Run this SQL query:

```sql
SHOW TABLES LIKE '%bill%';
```

You should see:

- `bills`
- `bill_payments`
- `license_subscriptions`

### Check 2: Migration Status

```sql
SELECT * FROM migrations ORDER BY version DESC LIMIT 1;
```

Should show migration version: `20251013000001`

### Check 3: Default Subscription

```sql
SELECT * FROM license_subscriptions;
```

Should show: "Standard Monthly Plan"

### Check 4: Test Cron Job

Visit in browser:

```
http://yourdomain.com/cron/generate_monthly_bills/YOUR_SECRET_KEY
```

Should see: "SUCCESS: Monthly bill generated successfully" or "INFO: Bill already exists"

---

## 📊 Features Overview

### ✨ What You Get

- ✅ Automatic monthly bill generation
- ✅ Payment tracking with multiple methods
- ✅ Bill status auto-updates (Pending → Partial → Paid)
- ✅ Overdue bill detection
- ✅ Professional printable bills
- ✅ Revenue reports with charts
- ✅ Payment history tracking
- ✅ Dashboard with statistics

### 💰 Payment Methods Supported

- Cash
- MPesa
- Bank Transfer
- Cheque
- Card

### 📈 Bill Statuses

- **Pending** - Not paid yet
- **Partial** - Partially paid
- **Paid** - Fully paid
- **Overdue** - Past due date
- **Cancelled** - Cancelled bill

---

## 🔐 Permissions Setup

The permissions are **automatically added** by the migration! The migration creates:

### Permission Group

- **Bills & Payments** (short_code: `bills_payments`)

### Permission Category

- **Bills** (short_code: `bills`) with all privileges:
  - `can_view` - View bills and subscriptions
  - `can_add` - Create bills, subscriptions, payments
  - `can_edit` - Edit bills and subscriptions
  - `can_delete` - Delete bills, subscriptions, payments

### Default Roles

- **Super Admin** - Automatically granted all Bills permissions

### Assign to Other Roles

To grant Bills permissions to other staff roles:

1. Go to **Human Resource** → **Role Permissions**
2. Select the role you want to grant permissions to
3. Find **Bills & Payments** section
4. Check the permissions you want to grant (View, Add, Edit, Delete)
5. Click **Save**

---

## 🆘 Troubleshooting

### "No bills generated"

- ✓ Check if active subscription exists
- ✓ Verify cron job is running
- ✓ Check application logs: `application/logs/`

### "Permission denied"

- ✓ Permissions are auto-added by migration for Super Admin
- ✓ For other roles: Go to Human Resource → Role Permissions → Bills & Payments
- ✓ Check that your user has the correct role assigned

### "Tables not created"

- ✓ Check `application/config/migration.php`
- ✓ Ensure `migration_enabled = TRUE`
- ✓ Verify database connection

### "Cron job not working"

- ✓ Verify cron secret key
- ✓ Test URL manually in browser
- ✓ Check server cron logs: `/var/log/cron` or cPanel logs

---

## 📞 Support

For detailed documentation, see: **BILLS_MODULE_README.md**

---

## 🎉 You're All Set!

The Bills and Payments module is now fully operational!

### Next Steps:

1. ✅ Create your subscription plans
2. ✅ Setup cron jobs for automation
3. ✅ Start generating bills
4. ✅ Record payments
5. ✅ View reports

**Happy Billing! 💰**
