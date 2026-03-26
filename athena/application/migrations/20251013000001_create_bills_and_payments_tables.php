<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Create_bills_and_payments_tables extends CI_Migration
{
    public function up()
    {
        // Create license_subscriptions table
        if (!$this->db->table_exists('license_subscriptions')) {
            $this->dbforge->add_field([
                'id' => [
                    'type' => 'INT',
                    'constraint' => 11,
                    'unsigned' => TRUE,
                    'auto_increment' => TRUE,
                ],
                'plan_name' => [
                    'type' => 'VARCHAR',
                    'constraint' => '255',
                    'null' => FALSE,
                ],
                'description' => [
                    'type' => 'TEXT',
                    'null' => TRUE,
                ],
                'amount' => [
                    'type' => 'DECIMAL',
                    'constraint' => '10,2',
                    'null' => FALSE,
                    'default' => 0.00,
                ],
                'currency' => [
                    'type' => 'VARCHAR',
                    'constraint' => '10',
                    'null' => FALSE,
                    'default' => 'KES',
                ],
                'billing_cycle' => [
                    'type' => 'ENUM',
                    'constraint' => ['monthly', 'quarterly', 'yearly'],
                    'default' => 'monthly',
                ],
                'features' => [
                    'type' => 'TEXT',
                    'null' => TRUE,
                    'comment' => 'JSON array of features',
                ],
                'is_active' => [
                    'type' => 'TINYINT',
                    'constraint' => 1,
                    'default' => 1,
                ],
                'created_by' => [
                    'type' => 'VARCHAR',
                    'constraint' => '255',
                    'null' => TRUE,
                ],
                'updated_by' => [
                    'type' => 'VARCHAR',
                    'constraint' => '255',
                    'null' => TRUE,
                ],
                'deleted_by' => [
                    'type' => 'VARCHAR',
                    'constraint' => '255',
                    'null' => TRUE,
                ],
            ]);

                         // Add timestamps manually because DBForge can't handle CURRENT_TIMESTAMP default
    $this->dbforge->add_field("created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP");
    $this->dbforge->add_field("updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP");
    $this->dbforge->add_field("deleted_at TIMESTAMP NULL DEFAULT NULL");

            $this->dbforge->add_key('id', TRUE);
            $this->dbforge->create_table('license_subscriptions', TRUE);
        }

        // Create bills table
        if (!$this->db->table_exists('bills')) {
            $this->dbforge->add_field([
                'id' => [
                    'type' => 'INT',
                    'constraint' => 11,
                    'unsigned' => TRUE,
                    'auto_increment' => TRUE,
                ],
                'bill_number' => [
                    'type' => 'VARCHAR',
                    'constraint' => '100',
                    'null' => FALSE,
                    'unique' => TRUE,
                ],
                'subscription_id' => [
                    'type' => 'INT',
                    'constraint' => 11,
                    'unsigned' => TRUE,
                    'null' => FALSE,
                ],
                'bill_month' => [
                    'type' => 'DATE',
                    'null' => FALSE,
                    'comment' => 'First day of billing month',
                ],
                'due_date' => [
                    'type' => 'DATE',
                    'null' => FALSE,
                ],
                'amount' => [
                    'type' => 'DECIMAL',
                    'constraint' => '10,2',
                    'null' => FALSE,
                    'default' => 0.00,
                ],
                'paid_amount' => [
                    'type' => 'DECIMAL',
                    'constraint' => '10,2',
                    'null' => FALSE,
                    'default' => 0.00,
                ],
                'balance' => [
                    'type' => 'DECIMAL',
                    'constraint' => '10,2',
                    'null' => FALSE,
                    'default' => 0.00,
                ],
                'status' => [
                    'type' => 'ENUM',
                    'constraint' => ['pending', 'partial', 'paid', 'overdue', 'cancelled'],
                    'default' => 'pending',
                ],
                'notes' => [
                    'type' => 'TEXT',
                    'null' => TRUE,
                ],
                'is_auto_generated' => [
                    'type' => 'TINYINT',
                    'constraint' => 1,
                    'default' => 0,
                    'comment' => '1 if generated by cron',
                ],
                'created_by' => [
                    'type' => 'VARCHAR',
                    'constraint' => '255',
                    'null' => TRUE,
                ],
                'updated_by' => [
                    'type' => 'VARCHAR',
                    'constraint' => '255',
                    'null' => TRUE,
                ],
                'deleted_by' => [
                    'type' => 'VARCHAR',
                    'constraint' => '255',
                    'null' => TRUE,
                ],
            ]);

                         // Add timestamps manually because DBForge can't handle CURRENT_TIMESTAMP default
    $this->dbforge->add_field("created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP");
    $this->dbforge->add_field("updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP");
    $this->dbforge->add_field("deleted_at TIMESTAMP NULL DEFAULT NULL");

            $this->dbforge->add_key('id', TRUE);
            $this->dbforge->add_key('subscription_id');
            $this->dbforge->add_key('bill_month');
            $this->dbforge->create_table('bills', TRUE);
        }

        // Create payments table
        if (!$this->db->table_exists('bill_payments')) {
            $this->dbforge->add_field([
                'id' => [
                    'type' => 'INT',
                    'constraint' => 11,
                    'unsigned' => TRUE,
                    'auto_increment' => TRUE,
                ],
                'payment_number' => [
                    'type' => 'VARCHAR',
                    'constraint' => '100',
                    'null' => FALSE,
                    'unique' => TRUE,
                ],
                'bill_id' => [
                    'type' => 'INT',
                    'constraint' => 11,
                    'unsigned' => TRUE,
                    'null' => FALSE,
                ],
                'payment_date' => [
                    'type' => 'DATE',
                    'null' => FALSE,
                ],
                'amount' => [
                    'type' => 'DECIMAL',
                    'constraint' => '10,2',
                    'null' => FALSE,
                    'default' => 0.00,
                ],
                'payment_method' => [
                    'type' => 'VARCHAR',
                    'constraint' => '50',
                    'null' => TRUE,
                    'comment' => 'Cash, MPesa, Bank Transfer, etc',
                ],
                'transaction_reference' => [
                    'type' => 'VARCHAR',
                    'constraint' => '255',
                    'null' => TRUE,
                ],
                'notes' => [
                    'type' => 'TEXT',
                    'null' => TRUE,
                ],
                'receipt_url' => [
                    'type' => 'VARCHAR',
                    'constraint' => '255',
                    'null' => TRUE,
                ],
           
                'created_by' => [
                    'type' => 'VARCHAR',
                    'constraint' => '255',
                    'null' => TRUE,
                ],
                'updated_by' => [
                    'type' => 'VARCHAR',
                    'constraint' => '255',
                    'null' => TRUE,
                ],
                'deleted_by' => [
                    'type' => 'VARCHAR',
                    'constraint' => '255',
                    'null' => TRUE,
                ],
            ]);

                $this->dbforge->add_field("created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP");
    $this->dbforge->add_field("updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP");
    $this->dbforge->add_field("deleted_at TIMESTAMP NULL DEFAULT NULL");

            $this->dbforge->add_key('id', TRUE);
            $this->dbforge->add_key('bill_id');
            $this->dbforge->create_table('bill_payments', TRUE);
        }

        // Add foreign keys
        if ($this->db->table_exists('bills') && $this->db->table_exists('license_subscriptions')) {
            $this->db->query('
                ALTER TABLE bills 
                ADD CONSTRAINT fk_bills_subscription 
                FOREIGN KEY (subscription_id) 
                REFERENCES license_subscriptions(id) 
                ON DELETE CASCADE
            ');
        }

        if ($this->db->table_exists('bill_payments') && $this->db->table_exists('bills')) {
            $this->db->query('
                ALTER TABLE bill_payments 
                ADD CONSTRAINT fk_payments_bill 
                FOREIGN KEY (bill_id) 
                REFERENCES bills(id) 
                ON DELETE CASCADE
            ');
        }

        // Insert default subscription plan
        $default_plan = [
            'plan_name' => 'Standard Monthly Plan',
            'description' => 'Standard monthly subscription for hospital management system',
            'amount' => 5000.00,
            'currency' => 'KES',
            'billing_cycle' => 'monthly',
            'features' => json_encode(['Full Access', 'Email Support', 'Cloud Backup']),
            'is_active' => 1,
            'created_at' => date('Y-m-d H:i:s'),
        ];

        $exists = $this->db->get_where('license_subscriptions', ['plan_name' => $default_plan['plan_name']])->row();
        if (!$exists) {
            $this->db->insert('license_subscriptions', $default_plan);
        }
    }

    public function down()
    {
        // Drop foreign keys first
        if ($this->db->table_exists('bill_payments')) {
            $this->db->query('ALTER TABLE bill_payments DROP FOREIGN KEY IF EXISTS fk_payments_bill');
        }
        
        if ($this->db->table_exists('bills')) {
            $this->db->query('ALTER TABLE bills DROP FOREIGN KEY IF EXISTS fk_bills_subscription');
        }

        // Drop tables
        // $this->dbforge->drop_table('bill_payments', TRUE);
        // $this->dbforge->drop_table('bills', TRUE);
        // $this->dbforge->drop_table('license_subscriptions', TRUE);
    }
}
