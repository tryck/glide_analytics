# Bills and Payments Module

## Overview

This module provides comprehensive bills and payments management for the GlideCare Hospital Management System. It includes license subscription management, automatic monthly bill generation, payment tracking, and reporting capabilities.

## Features

### 1. License Subscription Management

- Create and manage multiple subscription plans
- Set billing cycles (monthly, quarterly, yearly)
- Define plan features and pricing
- Activate/deactivate subscriptions

### 2. Bills Management

- Auto-generate monthly bills based on active subscription
- Manual bill creation
- Track bill status (Pending, Partial, Paid, Overdue, Cancelled)
- Bill filtering and search

### 3. Payments Management

- Record payments against bills
- Multiple payment methods support (Cash, MPesa, Bank Transfer, Cheque, Card)
- Transaction reference tracking
- Payment history

### 4. Reporting

- Dashboard with key statistics
- Monthly revenue reports
- Collection rate analysis
- Visual charts and graphs

### 5. Automation

- Cron job for auto-generating monthly bills
- Automatic overdue status updates
- Bill status auto-updates based on payments

## Installation

### 1. Run Migration

The migration will automatically run when you access the application. The following tables will be created:

- `license_subscriptions` - Stores subscription plans
- `bills` - Stores bills
- `bill_payments` - Stores payment records

### 2. Permissions (Automatic)

The migrations automatically add permissions to your RBAC system:

**Permission Group Created:**

- Bills & Payments (short_code: `bills_payments`)

**Permission Category Created:**

- Bills (short_code: `bills`) with privileges:
  - `can_view` - View bills and subscriptions
  - `can_add` - Add new bills, subscriptions, and payments
  - `can_edit` - Edit bills and subscriptions
  - `can_delete` - Delete bills, subscriptions, and payments

**Default Role Assignment:**

- Super Admin role (role_id: 1) is automatically granted all Bills permissions

**To Grant Permissions to Other Roles:**

1. Navigate to: **Human Resource** → **Role Permissions**
2. Select the role
3. Find **Bills & Payments** section
4. Check desired permissions
5. Save

### 3. Configure Cron Jobs

Set up the following cron jobs on your server:

#### Monthly Bill Generation (Run on 1st of each month at midnight)

```bash
0 0 1 * * /usr/bin/curl http://yourdomain.com/cron/generate_monthly_bills/YOUR_CRON_SECRET_KEY
```

#### Update Overdue Bills (Run daily at 1 AM)

```bash
0 1 * * * /usr/bin/curl http://yourdomain.com/cron/update_overdue_bills/YOUR_CRON_SECRET_KEY
```

**Note:** Replace `YOUR_CRON_SECRET_KEY` with your actual cron secret key from `sch_settings` table.

### 4. Get Your Cron Secret Key

1. Go to Admin Dashboard
2. Navigate to Settings > Backup
3. Generate or view your cron secret key
4. Use this key in your cron job URLs

## Usage

### Access the Module

Navigate to: `http://yourdomain.com/admin/bills`

### Main Menu Items

1. **Dashboard** - `/admin/bills` - Overview of bills and payments statistics
2. **Subscriptions** - `/admin/bills/subscriptions` - Manage license subscription plans
3. **Bills List** - `/admin/bills/bills_list` - View and manage all bills
4. **Reports** - `/admin/bills/reports` - View revenue reports and analytics

### Creating a Subscription Plan

1. Go to Subscriptions page
2. Click "Add Subscription"
3. Fill in the form:
   - Plan Name (e.g., "Standard Monthly Plan")
   - Description
   - Amount
   - Currency (default: KES)
   - Billing Cycle (monthly/quarterly/yearly)
   - Features (comma-separated)
   - Active status
4. Click "Save"

### Auto-Generate Monthly Bills

Bills are automatically generated on the 1st of each month via cron job. They can also be manually generated:

1. Go to Bills List
2. Click "Generate Monthly Bill" button
3. System will create a bill for the current month if:
   - An active subscription exists
   - A bill for the current month doesn't already exist

### Manual Bill Creation

1. Go to Bills List
2. Click "Create Bill"
3. Select subscription plan
4. Choose bill month
5. Set amount (auto-filled from subscription)
6. Set due date
7. Add notes (optional)
8. Click "Create Bill"

### Recording Payments

1. Go to Bills List
2. Click "View" on the bill you want to record payment for
3. Click "Add Payment"
4. Fill in payment details:
   - Payment Date
   - Amount
   - Payment Method
   - Transaction Reference
   - Notes
5. Click "Add Payment"
6. Bill status will be automatically updated

### Viewing Bill Details

1. Go to Bills List
2. Click the "Eye" icon on any bill
3. View:
   - Bill information
   - Payment summary
   - Payment history
4. Options:
   - Add payment
   - Print bill
   - Delete payment records

### Printing Bills

1. Go to Bills List
2. Click the "Print" icon on any bill
3. Bill opens in new window
4. Click "Print Bill" button
5. Use browser's print function

### Viewing Reports

1. Go to Reports page
2. Select year from dropdown
3. View:
   - Monthly billing statistics
   - Payment collection rates
   - Visual charts
   - Outstanding amounts

## Database Structure

### license_subscriptions Table

- `id` - Primary key
- `plan_name` - Name of the subscription plan
- `description` - Plan description
- `amount` - Subscription amount
- `currency` - Currency code (default: KES)
- `billing_cycle` - monthly/quarterly/yearly
- `features` - JSON array of features
- `is_active` - Active status (1/0)
- Audit fields (created_at, updated_at, deleted_at, etc.)

### bills Table

- `id` - Primary key
- `bill_number` - Unique bill number (BILL-YYYYMMDD-XXXX)
- `subscription_id` - Foreign key to license_subscriptions
- `bill_month` - Billing month (first day of month)
- `due_date` - Payment due date
- `amount` - Bill amount
- `paid_amount` - Amount paid
- `balance` - Outstanding balance
- `status` - pending/partial/paid/overdue/cancelled
- `notes` - Additional notes
- `is_auto_generated` - Auto-generated flag (1/0)
- Audit fields

### bill_payments Table

- `id` - Primary key
- `payment_number` - Unique payment number (PAY-YYYYMMDD-XXXX)
- `bill_id` - Foreign key to bills
- `payment_date` - Date of payment
- `amount` - Payment amount
- `payment_method` - Cash/MPesa/Bank Transfer/etc.
- `transaction_reference` - Transaction reference/code
- `notes` - Payment notes
- `receipt_url` - Receipt file URL (optional)
- Audit fields

## API Endpoints

### Subscriptions

- `GET /admin/bills/subscriptions` - List all subscriptions
- `POST /admin/bills/save_subscription` - Create/update subscription
- `GET /admin/bills/get_subscription?id={id}` - Get subscription details
- `POST /admin/bills/delete_subscription` - Soft delete subscription

### Bills

- `GET /admin/bills/bills_list` - List all bills (with filters)
- `POST /admin/bills/create_bill` - Create new bill
- `POST /admin/bills/update_bill` - Update bill
- `GET /admin/bills/view_bill/{id}` - View bill details
- `GET /admin/bills/get_bill?id={id}` - Get bill data (AJAX)
- `POST /admin/bills/delete_bill` - Soft delete bill
- `GET /admin/bills/print_bill/{id}` - Print bill
- `GET /admin/bills/generate_monthly_bill` - Manual bill generation

### Payments

- `POST /admin/bills/add_payment` - Add payment to bill
- `POST /admin/bills/delete_payment` - Soft delete payment

### Reports

- `GET /admin/bills/reports?year={year}` - View annual reports

### Cron Jobs

- `GET /cron/generate_monthly_bills/{key}` - Auto-generate monthly bills
- `GET /cron/update_overdue_bills/{key}` - Update overdue bill statuses

## File Structure

```
application/
├── controllers/
│   ├── admin/
│   │   └── Bills.php                          # Main bills controller
│   └── Cron.php                                # Cron jobs (updated)
├── models/
│   └── Bills_model.php                         # Bills data model
├── views/
│   └── admin/
│       └── bills/
│           ├── dashboard.php                   # Dashboard view
│           ├── subscriptions.php               # Subscriptions management
│           ├── bills_list.php                  # Bills listing
│           ├── view_bill.php                   # Bill details & payments
│           ├── print_bill.php                  # Printable bill
│           └── reports.php                     # Reports & analytics
├── migrations/
│   ├── 20251013000001_create_bills_and_payments_tables.php
│   └── 20251013000002_add_bills_permissions.php
└── config/
    └── autoload.php                            # Updated with bills_model
```

## Troubleshooting

### Bills not auto-generating

1. Check if cron job is set up correctly
2. Verify cron secret key matches
3. Check if active subscription exists
4. Check application logs: `application/logs/`

### Migration not running

1. Enable migrations: `application/config/migration.php`
2. Set `$config['migration_enabled'] = TRUE;`
3. Check database connection
4. Review migration logs

Expected migrations to run:

- `20251013000001_create_bills_and_payments_tables.php` - Creates database tables
- `20251013000002_add_bills_permissions.php` - Adds RBAC permissions

### Permission errors

1. Ensure user has `bills` module permissions
2. Check RBAC configuration
3. Verify user role has required privileges

### Payment not updating bill status

1. Check bill_id in payment record
2. Verify bill_payments table data
3. Check model `update_bill_status()` method
4. Review application logs

## Support and Maintenance

### Backup

The bills module data is included in the standard database backup. Ensure regular backups are scheduled.

### Updates

- Keep the bills_model.php updated
- Check for migration updates
- Review cron job logs regularly

### Security

- Protect cron endpoints with secret key
- Implement proper RBAC permissions
- Validate all user inputs
- Use prepared statements (already implemented)

## Future Enhancements

Potential features for future versions:

- Email notifications for due bills
- SMS reminders for overdue payments
- Automated receipt generation
- Integration with payment gateways
- Multi-currency support
- Recurring payment plans
- Discount and penalty management
- Export reports to PDF/Excel

## Credits

Developed for GlideCare Hospital Management System
Version: 1.0
Date: October 2025

## License

This module is part of the GlideCare Hospital Management System and follows the same license.
