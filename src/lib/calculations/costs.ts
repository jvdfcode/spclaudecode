import { ML_FEES, ML_INSTALLMENT_FEES } from '@/lib/mercadolivre.config'
import type { ViabilityInput, CostBreakdown, MlFeesMap } from '@/types'

export function calculateCostBreakdown(input: ViabilityInput, fees?: MlFeesMap): CostBreakdown {
  const { productCost, shippingCost, packagingCost, taxRate, overheadRate,
          salePrice, listingType, installments } = input

  if (salePrice < 0) throw new Error('salePrice não pode ser negativo')
  if (installments < 1 || installments > 12)
    throw new Error('installments deve estar entre 1 e 12')

  const baseRate = fees
    ? (fees.base[listingType] ?? ML_FEES[listingType]) / 100
    : ML_FEES[listingType] / 100
  const commission = salePrice * baseRate

  const installmentTable = fees
    ? (fees.installment[listingType] ?? {})
    : (ML_INSTALLMENT_FEES[listingType] as Record<number, number>)
  const installmentRate = (installmentTable[installments] ?? 0) / 100
  const installmentFee = salePrice * installmentRate

  const tax = salePrice * taxRate
  const overhead = salePrice * overheadRate

  const total =
    productCost + commission + installmentFee +
    shippingCost + packagingCost + tax + overhead

  return {
    acquisition: productCost,
    commission,
    installmentFee,
    shipping: shippingCost,
    packaging: packagingCost,
    tax,
    overhead,
    total,
  }
}
