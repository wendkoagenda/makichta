export interface Asset {
  id: string;
  label: string;
  purchaseValue: number;
  depreciationDurationMonths: number;
  acquisitionDate: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAssetInput {
  label: string;
  purchaseValue: number;
  depreciationDurationMonths: number;
  acquisitionDate: string;
}

export function getAssetCalculations(asset: Asset) {
  const monthlyDepreciation = asset.purchaseValue / asset.depreciationDurationMonths;
  const annualDepreciation = monthlyDepreciation * 12;
  const acquisition = new Date(asset.acquisitionDate);
  const now = new Date();
  const monthsElapsed = Math.max(
    0,
    (now.getFullYear() - acquisition.getFullYear()) * 12 +
      (now.getMonth() - acquisition.getMonth())
  );
  const totalDepreciated = Math.min(
    monthsElapsed * monthlyDepreciation,
    asset.purchaseValue
  );
  const residualValue = Math.max(0, asset.purchaseValue - totalDepreciated);
  const isAmortized = monthsElapsed >= asset.depreciationDurationMonths;

  return {
    monthlyDepreciation,
    annualDepreciation,
    monthsElapsed,
    residualValue,
    isAmortized,
    totalDepreciated,
  };
}
