import { Table, TableStatus } from '@/types/Table';
import { mockTable } from '@/mock/mockTable';

class WaiterTableModel {
  private tables: Table[];

  constructor(tables: Table[]) {
    this.tables = tables;
  }

  // Phương thức cập nhật trạng thái bàn
  updateTableStatus(tableId: number, newStatus: TableStatus): Table[] {
    this.tables = this.tables.map(table => {
      if (table.id === tableId) {
        return { ...table, status: newStatus };
      }
      return table;
    });
    return this.tables;
  }

  // Phương thức lấy danh sách bàn
  getTables(): Table[] {
    return this.tables;
  }
}

export default WaiterTableModel;