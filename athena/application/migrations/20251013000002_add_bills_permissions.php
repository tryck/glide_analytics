<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Add_bills_permissions extends CI_Migration
{
    public function up()
    {
        // Step 1: Add Bills & Payments to permission_group
        $group_data = [
            'name' => 'Bills & Payments',
            'short_code' => 'bills_payments',
            'is_active' => 1,
            'system' => 1,
            'sort_order' => '23.00',
            'created_at' => date('Y-m-d H:i:s')
        ];

        // Check if group exists
        $group_exists = $this->db
            ->where('short_code', $group_data['short_code'])
            ->get('permission_group')
            ->row();

        if (!$group_exists) {
            $this->db->insert('permission_group', $group_data);
            $perm_group_id = $this->db->insert_id();
            log_message('info', 'Created permission_group: Bills & Payments with ID: ' . $perm_group_id);
        } else {
            $perm_group_id = $group_exists->id;
            log_message('info', 'Permission group Bills & Payments already exists with ID: ' . $perm_group_id);
        }

        // Step 2: Add Bills permission category
        $category_data = [
            'perm_group_id' => $perm_group_id,
            'name' => 'Bills',
            'short_code' => 'bills',
            'enable_view' => 1,
            'enable_add' => 1,
            'enable_edit' => 1,
            'enable_delete' => 1,
            'created_at' => date('Y-m-d H:i:s')
        ];

        // Check if category exists
        $category_exists = $this->db
            ->where('short_code', $category_data['short_code'])
            ->get('permission_category')
            ->row();

        if (!$category_exists) {
            $this->db->insert('permission_category', $category_data);
            $perm_cat_id = $this->db->insert_id();
            log_message('info', 'Created permission_category: Bills with ID: ' . $perm_cat_id);
        } else {
            $perm_cat_id = $category_exists->id;
            log_message('info', 'Permission category Bills already exists with ID: ' . $perm_cat_id);
        }

        // Step 3: Grant permissions to Super Admin (role_id = 1)
        $role_id = 1; // Super Admin role

        // Check if role permission already exists
        $role_perm_exists = $this->db
            ->where('role_id', $role_id)
            ->where('perm_cat_id', $perm_cat_id)
            ->get('roles_permissions')
            ->row();

        if (!$role_perm_exists) {
            $role_permission_data = [
                'role_id' => $role_id,
                'perm_cat_id' => $perm_cat_id,
                'can_view' => 1,
                'can_add' => 1,
                'can_edit' => 1,
                'can_delete' => 1,
                'created_at' => date('Y-m-d H:i:s')
            ];

            $this->db->insert('roles_permissions', $role_permission_data);
            log_message('info', 'Granted Bills permissions to Super Admin role');
        } else {
            log_message('info', 'Super Admin already has Bills permissions');
        }

        echo "✅ Bills & Payments permissions added successfully\n";
    }

    public function down()
    {
        // Optional: Remove permissions in reverse order
        // Note: We don't actually delete to preserve data integrity
        
        // Get permission category
        $category = $this->db
            ->where('short_code', 'bills')
            ->get('permission_category')
            ->row();

        if ($category) {
            // Delete role permissions
            // $this->db->where('perm_cat_id', $category->id)->delete('roles_permissions');
            
            // Delete permission category
            // $this->db->where('id', $category->id)->delete('permission_category');
        }

        // Delete permission group
        // $this->db->where('short_code', 'bills_payments')->delete('permission_group');
        
        log_message('info', 'Bills permissions rollback completed (soft - data preserved)');
    }
}
