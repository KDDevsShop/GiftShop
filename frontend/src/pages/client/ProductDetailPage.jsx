import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, Zoom } from 'swiper/modules';
import CustomBreedCrumb from '../../components/CustomBreedCrumb';
import LoadingSpinner from '../../components/LoadingSpinner';
import CartSidebar from '../../components/CartSidebar';
import productService from '../../services/product.service';
import cartService from '../../services/cart.service.js';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/zoom';
import { CircularProgress } from '@mui/material';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [error, setError] = useState(null);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const addToCartButtonRef = useRef(null);
  const navigate = useNavigate();

  const accessToken = useMemo(() => localStorage.getItem('accessToken'), []);

  // Get user from local storage
  const user = useMemo(() => localStorage.getItem('user'), []);

  // Format the product images for display
  const images = useMemo(() => {
    if (!product.productImagePath || product.productImagePath.length === 0) {
      return [];
    }

    return product.productImagePath.map((image) => ({
      url: String(image).startsWith('http')
        ? image
        : `http://localhost:5000/${String(image).replace(/\\/g, '/')}`,
      alt: product.productName,
    }));
  }, [product.productImagePath, product.productName]);

  // Determine stock status and corresponding color
  const stockStatus = useMemo(() => {
    if (!product.countInStock)
      return { text: 'Out of stock', color: 'text-red-600' };
    if (product.countInStock <= 5)
      return { text: 'Low stock', color: 'text-amber-500' };
    return { text: 'In stock', color: 'text-green-600' };
  }, [product.countInStock]);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productResponse = await productService.getProductById(id);
        setProduct(productResponse);
      } catch (error) {
        console.error('Error fetching product data:', error);
        setError('Failed to load product details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Build breadcrumbs for navigation
  const breadcrumbs = useMemo(
    () =>
      [
        { label: 'Home', href: '/' },
        product?.productType?.productTypeName
          ? {
              label: product.productType.productTypeName,
              href: `/products?productType=${product.productType.productTypeName}`,
            }
          : null,
        {
          label: product.productName || 'Product Details',
          href: `/products/${id}`,
        },
      ].filter(Boolean),
    [product, id]
  );

  // Handle quantity changes
  const increment = useCallback(() => {
    setQuantity((prev) => prev + 1);
  }, []);

  const decrement = useCallback(() => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  }, []);

  // Handle lightbox operations
  const openLightbox = useCallback((index) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeLightbox = useCallback(() => {
    setIsLightboxOpen(false);
    document.body.style.overflow = 'auto';
  }, []);

  // Cart operations
  const handleAddToCart = useCallback(async () => {
    setButtonLoading(true);
    if (!user) {
      toast.error('Please log in to add items to your cart!');
      return;
    }

    if (product.countInStock <= 0) {
      toast.error('This product is currently out of stock.');
      return;
    }

    try {
      // Animation for button press
      if (addToCartButtonRef.current) {
        addToCartButtonRef.current.classList.add('scale-95');
        setTimeout(() => {
          addToCartButtonRef.current.classList.remove('scale-95');
        }, 150);
      }

      await cartService.addToCart(accessToken, {
        productId: id,
        quantity: quantity,
      });

      // Show success toast and open cart sidebar
      toast.success('Added to cart!');
      setIsCartOpen(true);
    } catch (error) {
      toast.error('Failed to add product to cart. Please try again.');
      console.error('Add to cart error:', error);
    } finally {
      setButtonLoading(false);
    }
  }, [user, product.countInStock, accessToken, id, quantity]);

  const fetchCart = useCallback(async () => {
    return await cartService.getCartByUser(accessToken);
  }, [accessToken]);

  const handleBuyNow = useCallback(async () => {
    if (!user) {
      toast.error('Please log in to make a purchase');
      return;
    }

    if (product.countInStock <= 0) {
      toast.error('This product is currently out of stock.');
      return;
    }

    try {
      await cartService.addToCart(accessToken, {
        productId: id,
        quantity: quantity,
      });
      const cart = await fetchCart();
      sessionStorage.setItem(
        'selectedProductIds',
        JSON.stringify(cart?.cart?.cartItems)
      );
      navigate('/order');
    } catch (error) {
      toast.error('Failed to process your order. Please try again.');
      console.error('Buy now error:', error);
    }
  }, [
    user,
    product.countInStock,
    accessToken,
    id,
    quantity,
    fetchCart,
    navigate,
  ]);

  // Show loading state
  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <LoadingSpinner />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className='container mx-auto py-12 px-4 text-center'>
        <h2 className='text-xl text-red-600 mb-4'>{error}</h2>
        <button
          onClick={() => window.location.reload()}
          className='bg-purple-800 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded'
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      <CustomBreedCrumb breadcrumbs={breadcrumbs} />

      {/* Product detail container */}
      <div className='container mx-auto py-8 px-4'>
        {/* Product top section */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          {/* Product image gallery */}
          <div className='relative'>
            {/* Main image swiper with zoom */}
            <div className='mb-4'>
              <Swiper
                modules={[Navigation, Thumbs, Zoom]}
                thumbs={{ swiper: thumbsSwiper }}
                navigation
                zoom={{ maxRatio: 3 }}
                className='product-main-swiper rounded-lg border border-gray-200'
              >
                {images.map((image, index) => (
                  <SwiperSlide key={index} className='h-[400px] cursor-zoom-in'>
                    <div className='swiper-zoom-container h-full flex items-center justify-center'>
                      <img
                        src={image.url}
                        alt={image.alt}
                        className='object-contain w-full h-full'
                        onClick={() => openLightbox(index)}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Thumbnail swiper */}
            {images.length > 1 && (
              <Swiper
                modules={[Navigation, Thumbs]}
                onSwiper={setThumbsSwiper}
                watchSlidesProgress
                slidesPerView={4}
                spaceBetween={10}
                className='product-thumbs-swiper h-24'
              >
                {images.map((image, index) => (
                  <SwiperSlide
                    key={index}
                    className='border rounded-lg overflow-hidden cursor-pointer'
                  >
                    <img
                      src={image.url}
                      alt={`Thumbnail ${index + 1}`}
                      className='object-cover w-full h-full'
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>

          {/* Product information */}
          <div className='space-y-4'>
            <h1 className='text-xl sm:text-2xl lg:text-3xl font-bold mb-2'>
              {product.productName}
            </h1>

            {/* Price */}
            <div className='flex items-center gap-2'>
              <span className='text-2xl sm:text-3xl font-bold text-purple-800'>
                ${product.price}
              </span>

              {/* Stock indicator with color coding */}
              <div className={`ml-auto ${stockStatus.color} font-medium`}>
                {stockStatus.text}
                {product.countInStock > 0 && product.countInStock <= 10 && (
                  <span className='ml-1'>({product.countInStock} left)</span>
                )}
              </div>
            </div>

            {/* Personality type tags */}
            {product.recommendedTypes &&
              product.recommendedTypes.length > 0 && (
                <div className='mt-4'>
                  <p className='text-sm text-gray-700 mb-1'>Recommended for:</p>
                  <div className='flex flex-wrap gap-2'>
                    {product.recommendedTypes.map((type, index) => (
                      <span
                        key={index}
                        className='inline-block bg-purple-100 text-purple-800 px-2 py-1 rounded-md text-sm font-medium'
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            {/* Product traits */}
            {product.traits && product.traits.length > 0 && (
              <div className='mt-4'>
                <p className='text-sm text-gray-700 mb-1'>Key Traits:</p>
                <div className='flex flex-wrap gap-2'>
                  {product.traits.map((trait, index) => (
                    <span
                      key={index}
                      className='inline-block bg-gray-100 text-gray-800 px-2 py-1 rounded-md text-sm'
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity selector - only show if in stock */}
            {product.countInStock > 0 && (
              <div className='mt-6'>
                <label
                  htmlFor='quantity'
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  Quantity
                </label>
                <div className='flex items-center'>
                  <button
                    aria-label='Decrease quantity'
                    className='bg-purple-800 hover:bg-purple-700 text-white font-bold h-10 w-10 rounded-l-lg transition duration-150 focus:outline-none focus:ring-2 focus:ring-purple-500'
                    onClick={decrement}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <div className='flex items-center justify-center h-10 w-16 border-t border-b border-purple-800 bg-white'>
                    <span id='quantity' className='text-center'>
                      {quantity}
                    </span>
                  </div>
                  <button
                    aria-label='Increase quantity'
                    className='bg-purple-800 hover:bg-purple-700 text-white font-bold h-10 w-10 rounded-r-lg transition duration-150 focus:outline-none focus:ring-2 focus:ring-purple-500'
                    onClick={increment}
                    disabled={product.countInStock <= quantity}
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className='flex flex-col sm:flex-row gap-3 mt-6'>
              <button
                className='bg-purple-800 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg flex-1 transition duration-150 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer'
                onClick={handleBuyNow}
              >
                BUY NOW
              </button>
              <button
                ref={addToCartButtonRef}
                className='bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg flex-1 transition duration-150 focus:outline-none focus:ring-2 focus:ring-gray-500 cursor-pointer'
                onClick={handleAddToCart}
              >
                {buttonLoading ? (
                  <CircularProgress size={'1.2rem'} color='inherit' />
                ) : (
                  'ADD TO CART'
                )}
              </button>
            </div>

            {/* Keywords for SEO and discoverability */}
            {product.keywords && product.keywords.length > 0 && (
              <div className='mt-6 pt-4 border-t border-gray-200'>
                <p className='text-xs text-gray-500'>Keywords:</p>
                <div className='flex flex-wrap gap-2 mt-1'>
                  {product.keywords.map((keyword, index) => (
                    <span key={index} className='text-xs text-gray-500'>
                      {keyword}
                      {index < product.keywords.length - 1 ? ',' : ''}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Product description */}
        <div className='mt-12'>
          <h2 className='text-2xl font-semibold border-b-2 border-gray-200 pb-2 mb-4'>
            Product Description
          </h2>
          <div
            className='prose prose-purple max-w-none'
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </div>
      </div>

      {/* Lightbox modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center'
            onClick={closeLightbox}
          >
            <div className='relative w-full h-full flex items-center justify-center'>
              <button
                className='absolute top-4 right-4 text-white text-xl p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70'
                onClick={closeLightbox}
                aria-label='Close lightbox'
              >
                ✕
              </button>

              <Swiper
                modules={[Navigation, Zoom]}
                initialSlide={lightboxIndex}
                navigation
                zoom={{ maxRatio: 5 }}
                className='w-full h-full'
              >
                {images.map((image, index) => (
                  <SwiperSlide
                    key={index}
                    className='flex items-center justify-center'
                  >
                    <div className='swiper-zoom-container'>
                      <img
                        src={image.url}
                        alt={image.alt}
                        className='max-w-[90vw] max-h-[90vh] object-contain'
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default ProductDetail;
