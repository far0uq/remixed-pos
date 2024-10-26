import {
  LineItemResponseCleaned,
  OrderTotalResponseObject,
} from "~/interface/OrderInterface";
import { Product, CatalogProductAPI } from "../interface/ProductInterface";

export const cleanProductObjects = (
  objects: CatalogProductAPI[]
): Product[] => {
  const cleanedObjects: Product[] = [];
  objects.forEach((object) => {
    // const cleanedPrice = object.itemData?.variations?.[0]?.itemVariationData
    //   ?.priceMoney?.amount
    //   ? Number(
    //       object.itemData.variations[0].itemVariationData.priceMoney.amount
    //     ) / 100
    //   : 0;
    cleanedObjects.push({
      id: object.variations[0]?.variationId ?? "",
      name: object.name,
      price: object.variations[0]?.price?.amount ?? 0,
      priceExists:
        object.variations[0]?.price?.amount !== undefined ? true : false,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjw-x2av0YFJfxJx6oN6lOQqC3TxftSOqtKA&s",
    });
  });
  return cleanedObjects;
};

export const getProductMoneyDetails = (
  productID: string,
  mutationData: OrderTotalResponseObject | undefined
) => {
  console.log("🚀 ~ getProductMoneyDetails ~ mutationData", mutationData);
  if (mutationData) {
    const foundData = mutationData.lineItemDetails.find(
      (lineItem: LineItemResponseCleaned) => lineItem.uid === productID
    );
    return foundData;
  }
};
