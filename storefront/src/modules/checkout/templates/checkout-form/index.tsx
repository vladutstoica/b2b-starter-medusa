import { listCartShippingMethods } from "@lib/data/fulfillment"
import { listCartPaymentMethods } from "@lib/data/payment"
import { HttpTypes } from "@medusajs/types"
import BillingAddress from "@modules/checkout/components/billing-address"
import ShippingAddress from "@modules/checkout/components/shipping-address"
import Payment from "@modules/checkout/components/payment"
import Review from "@modules/checkout/components/review"
import Shipping from "@modules/checkout/components/shipping"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import UTurnArrowRight from "@modules/common/icons/u-turn-arrow-right"
import Button from "@modules/common/components/button"
import Company from "@modules/checkout/components/company"
import { Company as CompanyType } from "types/global"

export default async function CheckoutForm({
  cart,
  customer,
}: {
  cart: (HttpTypes.StoreCart & { company: CompanyType }) | null
  customer: HttpTypes.StoreCustomer | null
}) {
  if (!cart) {
    return null
  }

  const shippingMethods = await listCartShippingMethods(cart.id)
  const paymentMethods = await listCartPaymentMethods(cart.region?.id ?? "")

  if (!shippingMethods || !paymentMethods) {
    return null
  }

  return (
    <div>
      <div className="w-full grid grid-cols-1 gap-y-2">
        <LocalizedClientLink
          className="flex items-baseline gap-2 text-sm text-neutral-400 hover:text-neutral-500"
          href="/cart"
        >
          <Button variant="secondary">
            <UTurnArrowRight />
            Back to shopping cart
          </Button>
        </LocalizedClientLink>

        {cart?.company && <Company cart={cart} />}

        <ShippingAddress cart={cart} customer={customer} />

        <BillingAddress cart={cart} customer={customer} />

        <Shipping cart={cart} availableShippingMethods={shippingMethods} />

        <Payment cart={cart} availablePaymentMethods={paymentMethods} />

        <Review cart={cart} />
      </div>
    </div>
  )
}
