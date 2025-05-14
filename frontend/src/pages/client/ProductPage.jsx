import { useLocation } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
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
  const [products, setProducts] = useState([]);
  const [totalPage, setTotalPage] = useState(0);
  const [loading, setLoading] = useState(false);

  const page = parseInt(query.get('page') || '1', 10);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const updatedQuery = new URLSearchParams(location.search);

        if (selectedTypes.length > 0)
          updatedQuery.set('productType', selectedTypes.join(','));
        if (selectedRecommendations.length > 0)
          updatedQuery.set(
            'recommendedTypes',
            selectedRecommendations.join(',')
          );

        const response = await productService.getProducts(
          updatedQuery,
          page,
          8,
          null
        );

        setProducts(response.data);
        setTotalPage(response.meta.totalPages);
      } catch (error) {
        setLoading(false);
        setProducts([]);
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [location.search, selectedTypes, selectedRecommendations, page]);

  const handleTypeChange = (types) => {
    setSelectedTypes(types);
  };

  const handleRecommendedChange = (recommendations) => {
    setSelectedRecommendations(recommendations);
  };

  const productType = products[0]?.productTypeDetails?.productTypeName;

  return (
    <>
      {products.length > 0 && (
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
            priceOptions={[]}
          />
        </div>
        <div className='w-full lg:w-4/5 ml-2'>
          {loading ? (
            <div className='w-full h-full flex justify-center items-center'>
              <div className='w-24 h-24 border-8 border-primary border-dotted rounded-full animate-spin'></div>
            </div>
          ) : (
            <>
              <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3'>
                {products.map((product, index) => (
                  <ProductItem key={index} product={product} />
                ))}
              </div>
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
