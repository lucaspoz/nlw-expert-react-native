import { useRef, useState } from 'react'
import { FlatList, SectionList, Text, View } from 'react-native'
import { Link } from 'expo-router'

import { CategoryButton } from '@/components/category-button'
import { Header } from '@/components/header'
import { Product } from '@/components/product'
import { useCartStore } from '@/stores/cart-store'
import { CATEGORIES, MENU, ProductProps } from '@/utils/data/products'

export default function Home() {
  const cartStore = useCartStore()
  const [category, setCategory] = useState(CATEGORIES[0])

  const sectionListRef = useRef<SectionList<ProductProps>>(null)

  const cartQuantityItems = cartStore.products.reduce(
    (total, product) => total + product.quantity,
    0
  )

  function handleCategorySelect(selectedCategory: string) {
    setCategory(selectedCategory)

    const sectionIndex = CATEGORIES.findIndex(
      (category) => category === selectedCategory
    )

    if (sectionListRef.current) {
      sectionListRef.current.scrollToLocation({
        animated: true,
        itemIndex: 0,
        sectionIndex,
      })
    }
  }

  return (
    <View className='flex-1 pt-11'>
      <Header title='Faça seu pedido' cartQuantityItems={cartQuantityItems} />

      <FlatList
        contentContainerStyle={{ gap: 12, paddingHorizontal: 20 }}
        data={CATEGORIES}
        horizontal
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <CategoryButton
            title={item}
            isSelected={item === category}
            onPress={() => handleCategorySelect(item)}
          />
        )}
        showsHorizontalScrollIndicator={false}
        className='max-h-10 mt-5'
      />

      <SectionList
        contentContainerStyle={{ paddingBottom: 100 }}
        keyExtractor={(item) => item.id}
        ref={sectionListRef}
        renderItem={({ item }) => (
          <Link asChild href={`/product/${item.id}`}>
            <Product data={item} />
          </Link>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text className='text-xl text-white font-heading mt-8 mb-3'>
            {title}
          </Text>
        )}
        sections={MENU}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
        className='flex-1 p-5'
      />
    </View>
  )
}
