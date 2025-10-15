import Breadcrumbs from "../components/Breadcrumbs";
import Filter from "../components/Filter";
import Categories from "../components/Categories";
import Card from "../components/Card";
import Footer from "../sections/Footer";

function RatedProducts() {
  return (
    <>
      <Navbar />
      <Breadcrumbs title={subcategoryName || categoryName || "Products"} />
      <section className="lg:px-20 md:px-[60px] px-4 py-[23px]">
        <Filter
          text={subcategoryName || categoryName || "Products"}
          sort={sort}
        />
        <div className="flex lg:gap-6 items-start">
          <div className="sticky top-4">
            <Categories
              categoryName={categoryName}
              setParam={setParam}
              setColor={setColor}
              val={val}
              colors={colors}
            />
          </div>
          {loading ? (
            <p>Loading products...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : filteredArts.length > 0 ? (
            <Card cardData={filteredArts} />
          ) : (
            <p>No products found.</p>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}

export default RatedProducts;
