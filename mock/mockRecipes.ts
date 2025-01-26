export interface Recipe {
    id: number;
    productId: number;
    productName: string;
    ingredients: string[];
    steps: string[];
}

export const mockRecipes: Recipe[] = [
    {
        id: 1,
        productId: 1,
        productName: 'Cafe Đen',
        ingredients: [
            '15g cà phê xay',
            '100ml nước nóng',
        ],
        steps: [
            'Cho cà phê vào phin',
            'Đổ nước sôi 100 độ C',
            'Chờ 3-4 phút cho cà phê nhỏ giọt',
        ]
    },
    {
        id: 2,
        productId: 2,
        productName: 'Cafe Sữa',
        ingredients: [
            '15g cà phê xay',
            '30ml sữa đặc',
            '100ml nước nóng',
        ],
        steps: [
            'Cho sữa đặc vào đáy ly',
            'Đặt phin và cho cà phê vào',
            'Đổ nước sôi 100 độ C',
            'Chờ 3-4 phút cho cà phê nhỏ giọt',
            'Khuấy đều trước khi dùng',
        ]
    },
]; 