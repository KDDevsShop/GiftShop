import { useLocation } from 'react-router-dom';
import { useEffect, useState, useMemo, useCallback } from 'react';
import productService from '../../services/product.service';
import CustomBreedCrumb from '../../components/CustomBreedCrumb';
import Filter from '../../components/Products/Filter';
import CustomPagination from '../../components/Pagination';
import ProductItem from '../../components/Products/ProductItem';

const ProductPage = () => {
  const location = useLocation();
  const query = useMemo(
    () => new URLSearchParams(location.search || ''),
    [location.search]
  );

  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedRecommendations, setSelectedRecommendations] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [displayProducts, setDisplayProducts] = useState([]);
  const [totalPage, setTotalPage] = useState(0);
  const [loading, setLoading] = useState(false);

  const page = parseInt(query.get('page') || '1', 10);
  const ITEMS_PER_PAGE = 8;

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true);
        const baseQuery = new URLSearchParams(location.search);

        baseQuery.delete('page');
        baseQuery.delete('productType');
        baseQuery.delete('recommendedTypes');

        const response = await productService.getProducts(
          baseQuery,
          1,
          1000,
          null
        );

        setAllProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
        setAllProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, [location.pathname, location.search]);

  const applyFilters = useCallback(() => {
    let results = [...allProducts];

    if (selectedTypes.length > 0) {
      results = results.filter((product) =>
        selectedTypes.includes(product.productType?.productTypeName)
      );
    }

    if (selectedRecommendations.length > 0) {
      results = results.filter((product) =>
        product.recommendedTypes?.some((type) =>
          selectedRecommendations.includes(type)
        )
      );
    }

    setFilteredProducts(results);

    const totalPages = Math.ceil(results.length / ITEMS_PER_PAGE);
    setTotalPage(totalPages);

    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    setDisplayProducts(results.slice(startIndex, endIndex));
  }, [allProducts, selectedTypes, selectedRecommendations, page]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleTypeChange = (types) => {
    setSelectedTypes(types);
  };

  const handleRecommendedChange = (recommendations) => {
    setSelectedRecommendations(recommendations);
  };

  const productType = displayProducts[0]?.productTypeDetails?.productTypeName;

  return (
    <>
      {displayProducts.length > 0 && (
        <CustomBreedCrumb
          breadcrumbs={[
            { label: 'Home', href: '/' },
            {
              label: productType || 'Products',
              href: `/products?productType=${productType}`,
            },
          ]}
        />
      )}
      <div className='flex p-4'>
        <div className='hidden lg:block w-1/5 m-1'>
          <Filter
            onTypeChange={handleTypeChange}
            onRecommendedChange={handleRecommendedChange}
            allProducts={allProducts}
            selectedTypes={selectedTypes}
            selectedRecommendations={selectedRecommendations}
          />
        </div>
        <div className='w-full lg:w-4/5 ml-2'>
          {loading ? (
            <div className='w-full h-full flex justify-center items-center'>
              <div className='w-24 h-24 border-8 border-primary border-dotted rounded-full animate-spin'></div>
            </div>
          ) : (
            <>
              <div className='mb-4 flex justify-between items-center'>
                <p className='text-gray-600'>
                  Showing {displayProducts.length} of {filteredProducts.length}{' '}
                  products
                </p>
              </div>

              {displayProducts.length === 0 ? (
                <div className='text-center py-10'>
                  <p className='text-xl text-gray-500'>
                    No products found matching your criteria
                  </p>
                  <button
                    className='mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-hover-primary'
                    onClick={() => {
                      setSelectedTypes([]);
                      setSelectedRecommendations([]);
                    }}
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3'>
                  {displayProducts.map((product, index) => (
                    <ProductItem key={index} product={product} />
                  ))}
                </div>
              )}
            </>
          )}
          <CustomPagination
            path={`${location.pathname}`}
            totalPages={totalPage}
          />
        </div>
      </div>
    </>
  );
};

export default ProductPage;
