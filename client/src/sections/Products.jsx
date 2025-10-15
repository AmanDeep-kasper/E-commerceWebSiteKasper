import LatestProducts from "../components/homecomponents/LatestProducts";
import CategoryProducts from "../components/homecomponents/CategoryProducts";
import TopProducts from "../components/homecomponents/TopProducts";
import DiwaliProducts from "../components/homecomponents/DiwaliProducts";

function Products() {
  return (
    <section className="lg:px-20 md:px-[60px] px-4 py-[23px] flex flex-col gap-6 bg-gray-50">

      <LatestProducts />
      <CategoryProducts />
      <TopProducts />
      <DiwaliProducts />
    </section>
  );
}

export default Products;
