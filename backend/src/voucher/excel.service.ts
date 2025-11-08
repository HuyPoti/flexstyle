import * as ExcelJS from 'exceljs';
export class ExcelService {
    async generateToExcel(data: any[]): Promise<Buffer> {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Báo cáo voucher');
    
            // Định nghĩa các cột
            worksheet.columns = [
                { header: 'Tên Voucher', key: 'TenVoucher', width: 30 },
                { header: 'Giá Trị', key: 'SoTien', width: 15 },
                { header: 'FreeShip', key: 'FreeShip', width: 15 },
                { header: 'Ngày Bắt Đầu', key: 'NgayBatDau', width: 15 },
                { header: 'Ngày Kết Thúc', key: 'NgayKetThuc', width: 15 },
                { header: 'Điều Kiện', key: 'DieuKien', width: 15 },
                { header: 'Trạng Thái', key: 'TrangThai', width: 15 },
                    ];
                    worksheet.getRow(1).values = ['Tên Voucher', 'Giá Trị', 'FreeShip', 'Ngày Bắt Đầu', 'Ngày Kết Thúc', 'Điều Kiện', 'Trạng Thái'];
            worksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true, color: { argb: 'FFFFFF' } };
                cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '366092' }
                };
                cell.alignment = { vertical: 'middle', horizontal: 'center' };
                cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
                };
            });
            // Thêm dữ liệu vào worksheet
            data.forEach((item, index) => {
                const row = worksheet.addRow({
                    TenVoucher: item.TenVoucher,
                    SoTien: item.SoTien,
                    FreeShip: item.FreeShip ? 'Có' : 'Không',
                    NgayBatDau: item.NgayBatDau ? new Date(item.NgayBatDau).toLocaleDateString() : '',
                    NgayKetThuc: item.NgayKetThuc ? new Date(item.NgayKetThuc).toLocaleDateString() : '',
                    DieuKien: item.DieuKien,
                    TrangThai: item.TrangThai,
                });
    
                row.eachCell((cell) => {
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                    cell.alignment = { vertical: 'middle', horizontal: 'center' };
                });
                if (index % 2 === 0) {
                    row.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'F2F2F2' }
                    };
                }
            });
            //auto-fit width
            worksheet.columns.forEach(column => {
                if (column.key) {
                    let maxLength = 0;
                    const columnKey = column.key;
                    
                    worksheet.eachRow((row) => {
                    const cell = row.getCell(columnKey);
                    const cellValue = cell.value ? cell.value.toString() : '';
                    if (cellValue.length > maxLength) {
                        maxLength = cellValue.length;
                    }
                    });
                    
                    column.width = Math.min(Math.max(maxLength + 2, 10), 50);
                }
            });
            // Tạo buffer từ workbook
            const buffer = await workbook.xlsx.writeBuffer();
            return Buffer.from(buffer);
        } 
}