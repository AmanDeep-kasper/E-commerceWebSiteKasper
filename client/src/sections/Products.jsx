import LatestProducts from "../components/homecomponents/LatestProducts";
import CategoryProducts from "../components/homecomponents/CategoryProducts";
import TopProducts from "../components/homecomponents/TopProducts";
import DiwaliProducts from "../components/homecomponents/DiwaliProducts";
import Design from "../components/homecomponents/Design";

function Products() {
  return (
    <section className="lg:px-0  px-0 py-[23px] flex flex-col gap-6 bg-gray-50">

      <LatestProducts />
      <CategoryProducts />
      <section className="lg:px-0 md:px-0 px-0 py-0">
       <Design/>
       </section>
      <TopProducts />
      <DiwaliProducts />
    </section>
  );
}

export default Products;
