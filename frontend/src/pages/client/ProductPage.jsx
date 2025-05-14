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
  const [sortBy, setSortBy] = useState('');
  const [sortOption, setSortOption] = useState(query.get('sortBy'));
  const [isDesc, setIsDesc] = useState('false');
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

        updatedQuery.set('sortBy', sortOption);
        updatedQuery.set('isDesc', isDesc);

        const response = await productService.getProducts(
          updatedQuery,
          page,
          12,
          sortBy
        );

        console.log(response);

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
  }, [
    location.search,
    selectedTypes,
    selectedRecommendations,
    sortOption,
    isDesc,
    page,
    sortBy,
  ]);

  const handleTypeChange = (types) => {
    setSelectedTypes(types);
  };

  const handleRecommendedChange = (recommendations) => {
    setSelectedRecommendations(recommendations);
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortOption(value);
    if (value === 'default') {
      setSortBy('');
      setIsDesc('false');
      return;
    }
    setSortBy('price');
    setIsDesc(value === 'desc' ? 'true' : 'false');
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
              <div className='flex justify-between bg-gray-50 rounded-lg px-4 mb-8'>
                <div className='flex items-center space-x-2'>
                  <span className='font-semibold text-sm sm:text-lg'>
                    Sắp xếp:
                  </span>
                  <select
                    value={sortOption}
                    onChange={handleSortChange}
                    className='border text-xs sm:text-base border-gray-300 py-1 px-3 rounded-md focus:outline-none bg-white text-gray-700 hover:border-[#EA580C] focus:ring-[#EA580C] focus:border-[#EA580C] focus-visible:ring-[#EA580C]'
                  >
                    <option value='default'>Mặc định</option>
                    <option value='asc'>Giá tăng dần</option>
                    <option value='desc'>Giá giảm dần</option>
                  </select>
                </div>
              </div>

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
