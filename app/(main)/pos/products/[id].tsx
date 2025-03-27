import { View, Text, Image, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { mockProducts } from '@/mock/mockProducts';
import { Size } from '@/types/Product';

const ProductDetail = () => {
  const { id } = useLocalSearchParams();
  const product = mockProducts.find((p) => p.id === Number(id));

  if (!product) {
    return <Text>Không tìm thấy sản phẩm</Text>;
  }

  return (
    <ScrollView className="p-4 bg-white">
      {/* Hiển thị ảnh */}
      <Image source={{ uri: product.image }} className="w-full rounded-lg h-60" resizeMode="contain" />

      {/* Thông tin sản phẩm */}
      <Text className="mt-4 text-2xl font-bold">{product.name}</Text>
      <Text className="text-gray-600">{product.description}</Text>
      <Text className="mt-2 text-xl font-semibold text-red-500">{product.price.toLocaleString()}đ</Text>

      {/* Hiển thị size */}
      <View className="mt-4">
        <Text className="text-lg font-semibold">Chọn Size:</Text>
        {product.size.map((s: Size) => (
          <Text key={s.name} className="text-gray-700">
            {s.name} - {s.price.toLocaleString()}đ {s.isDefault && "(Mặc định)"}
          </Text>
        ))}
      </View>

      {/* Hiển thị topping nếu có */}
      {product.toppings && (
        <View className="mt-4">
          <Text className="text-lg font-semibold">Topping:</Text>
          {product.toppings.map((t) => (
            <Text key={t.id} className="text-gray-700">
              {t.name} - {t.price.toLocaleString()}đ
            </Text>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default ProductDetail;


