import { convertToLocale } from "@lib/util/money"
import repeat from "@lib/util/repeat"
import { HttpTypes, StoreCartLineItem } from "@medusajs/types"
import { BaseCartLineItem } from "@medusajs/types/dist/http/cart/common"
import { Container, Text } from "@medusajs/ui"

import Item from "@modules/cart/components/item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"

type ItemsTemplateProps = {
  cart: HttpTypes.StoreCart
  showBorders?: boolean
  showTotal?: boolean
}

const ItemsTemplate = ({
  cart,
  showBorders = true,
  showTotal = true,
}: ItemsTemplateProps) => {
  const items = cart?.items

  return (
    <div className="w-full flex flex-col gap-y-2">
      <div className="flex flex-col gap-y-2 w-full">
        {items
          ? items
              .sort((a, b) => {
                if (a.created_at === b.created_at) {
                  return a.id?.localeCompare(b.id ?? "") ?? 0
                }

                return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
              })
              .map((item: StoreCartLineItem) => {
                return (
                  <Item
                    showBorders={showBorders}
                    key={item.id}
                    item={
                      item as StoreCartLineItem & {
                        metadata?: { note?: string }
                      }
                    }
                  />
                )
              })
          : repeat(5).map((i) => {
              return <SkeletonLineItem key={i} />
            })}
      </div>
      {showTotal && (
        <Container>
          <div className="flex items-start justify-between h-full self-stretch">
            <Text>Total: {items?.length} items</Text>
            <Text>
              {convertToLocale({
                amount: cart?.total,
                currency_code: cart?.currency_code,
              })}
            </Text>
          </div>
        </Container>
      )}
    </div>
  )
}

export default ItemsTemplate
