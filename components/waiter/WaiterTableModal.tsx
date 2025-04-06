import { Table, TableStatus } from '@/types/Table';
import { updateTable } from '@/api/table';

class WaiterTableModel {
  private tables: Table[];

  constructor(tables: Table[]) {
    this.tables = tables;
  }

  // Update table status through API
  async updateTableStatus(tableId: number, newStatus: TableStatus): Promise<Table[]> {
    try {
      // Find the table to update
      const tableToUpdate = this.tables.find(table => table.id === tableId);
      if (!tableToUpdate) {
        throw new Error('Không tìm thấy bàn');
      }

      // Call API to update table status
      await updateTable({
        id: tableId,
        name: tableToUpdate.name,
        capacity: tableToUpdate.capacity,
        notes: tableToUpdate.note || '',
        status: newStatus,
        areaId: tableToUpdate.areaId
      });

      // Update local state
      this.tables = this.tables.map(table => {
        if (table.id === tableId) {
          return { ...table, status: newStatus };
        }
        return table;
      });

      return this.tables;
    } catch (error) {
      console.error('Error updating table status:', error);
      throw new Error('Không thể cập nhật trạng thái bàn');
    }
  }

  // Get all tables
  getTables(): Table[] {
    return this.tables;
  }
}

export default WaiterTableModel;