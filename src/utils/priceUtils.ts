export const calculateOffer = (
  mrp: string,
  price: string,
  tags: string[]
) => {
  const mrpNum = Number(mrp);
  const priceNum = Number(price);

  if (tags.includes("trending")) return 30;
  if (tags.includes("new")) return 20;

  return Math.round(((mrpNum - priceNum) / mrpNum) * 100);
};
