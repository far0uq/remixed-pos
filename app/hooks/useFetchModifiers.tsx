import { useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";
import { DiscountOption } from "~/interface/DiscountInterface";
import { TaxOption } from "~/interface/TaxInterface";

export const useFetchModifiers = () => {
  const [TaxesCleaned, setTaxesCleaned] = useState<TaxOption[]>();
  const [DiscountsCleaned, setDiscountsCleaned] = useState<DiscountOption[]>();
  const [areTaxesLoading, setAreTaxesLoading] = useState(false);
  const [areDiscountsLoading, setAreDiscountsLoading] = useState(false);
  const [taxError, setTaxError] = useState(false);
  const [discountError, setDiscountError] = useState(false);
  const fetcher = useFetcher();

  useEffect(() => {
    if (fetcher.data && !TaxesCleaned && !DiscountsCleaned) {
      if (fetcher.data.TaxesResp.error) {
        setTaxError(true);
      } else if (fetcher.data.DiscountsResp.error) {
        setDiscountError(true);
      } else {
        setAreTaxesLoading(false);
        setAreDiscountsLoading(false);
        setTaxesCleaned(JSON.parse(fetcher.data.TaxesResp));
        setDiscountsCleaned(JSON.parse(fetcher.data.DiscountsResp));
      }
    }
  }, [fetcher.data]);

  const loadModifiers = () => {
    fetcher.load("/modifiers");
    setAreTaxesLoading(true);
    setAreDiscountsLoading(true);
  };

  return {
    loadModifiers,
    areTaxesLoading,
    areDiscountsLoading,
    TaxesCleaned,
    DiscountsCleaned,
    taxError,
    discountError,
  };
};
