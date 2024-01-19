import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import ProductReel from "@/components/ProductReel";
import { PRODUCT_CATEGORIES } from "@/config";

type Param = string | string[] | undefined;

type ProductsPageProps = {
  searchParams: { [key: string]: Param };
};

const parse = (param: Param) => {
  return typeof param === "string" ? param : undefined;
};
const Page = ({ searchParams }: ProductsPageProps) => {
  const sort = parse(searchParams.sort);
  const category = parse(searchParams.category);
  const label = PRODUCT_CATEGORIES.find(
    ({ value }) => value === category
  )?.label;

  return (
    <MaxWidthWrapper>
      <ProductReel
        title={label ?? "Browse high-quality assets"}
        query={{
          category,
          limit: 40,
          sort: sort === "asc" || sort === "desc" ? sort : undefined,
        }}
      />
    </MaxWidthWrapper>
  );
};

export default Page;
