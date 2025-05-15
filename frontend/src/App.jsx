import { Routes, Route } from 'react-router-dom';
import Login from './pages/authentication/Login';
import Register from './pages/authentication/Register';
import ProductTypeList from './pages/admin/ProductTypeList';
import HomePage from './pages/client/HomePage';
import CustomerLayout from './layouts/CustomerLayout';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import NotFoundPage from './pages/NotFoundPage';
import UserInfo from './pages/client/UserInfo';
import MBTITest from './pages/client/MBTITest';
import ProductPage from './pages/client/ProductPage';
import AdminLayout from './layouts/AdminLayout';
import ProductList from './pages/admin/ProductList';
import UserList from './pages/admin/UserList';
import ProductDetail from './pages/client/ProductDetailPage';
import CartPage from './pages/client/CartPage';
import OrderList from './pages/admin/OrderList';
import OrderPage from './pages/client/OrderPage';
import ThankYouPage from './pages/client/ThanksPage';

function App() {
  return (
    <>
      <Routes>
        <Route
          path='/'
          element={
            <CustomerLayout>
              <HomePage />
            </CustomerLayout>
          }
        />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />

        <Route
          path='/me'
          element={
            <CustomerLayout>
              <ProtectedRoute allowedRoles={['customer', 'admin']}>
                <UserInfo />
              </ProtectedRoute>
            </CustomerLayout>
          }
        />
        <Route
          path='/mbti-test'
          element={
            <CustomerLayout>
              <ProtectedRoute allowedRoles={['customer', 'admin']}>
                <MBTITest />
              </ProtectedRoute>
            </CustomerLayout>
          }
        />
        <Route
          path='/products'
          element={
            <CustomerLayout>
              <ProtectedRoute allowedRoles={['customer', 'admin']}>
                <ProductPage />
              </ProtectedRoute>
            </CustomerLayout>
          }
        />

        <Route
          path='/products/:id'
          element={
            <CustomerLayout>
              <ProtectedRoute allowedRoles={['customer', 'admin']}>
                <ProductDetail />
              </ProtectedRoute>
            </CustomerLayout>
          }
        />

        <Route
          path='/cart'
          element={
            <CustomerLayout>
              <ProtectedRoute allowedRoles={['customer', 'admin']}>
                <CartPage />
              </ProtectedRoute>
            </CustomerLayout>
          }
        />

        <Route
          path='/order'
          element={
            <CustomerLayout>
              <ProtectedRoute allowedRoles={['customer', 'admin']}>
                <OrderPage />
              </ProtectedRoute>
            </CustomerLayout>
          }
        />

        <Route
          path='/thankyou'
          element={
            <CustomerLayout>
              <ThankYouPage />
            </CustomerLayout>
          }
        />

        <Route
          path='/order'
          element={
            <CustomerLayout>
              <ProtectedRoute allowedRoles={['customer', 'admin']}>
                <OrderPage />
              </ProtectedRoute>
            </CustomerLayout>
          }
        />

        <Route
          path='/thankyou'
          element={
            <CustomerLayout>
              <ThankYouPage />
            </CustomerLayout>
          }
        />

        <Route
          path='/product-type'
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ProductTypeList />
            </ProtectedRoute>
          }
        />

        <Route
          path='/admin/products'
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ProductList />
            </ProtectedRoute>
          }
        />

        <Route
          path='/admin/users'
          element={
            <AdminLayout>
              <ProtectedRoute allowedRoles={['admin']}>
                <UserList />
              </ProtectedRoute>
            </AdminLayout>
          }
        />

        <Route
          path='/admin/orders'
          element={
            <AdminLayout>
              <ProtectedRoute allowedRoles={['admin']}>
                <OrderList />
              </ProtectedRoute>
            </AdminLayout>
          }
        />

        <Route path='*' element={<NotFoundPage />} />
      </Routes>

      <ToastContainer
        position='top-right'
        autoClose={2000}
        hideProgressBar={false}
        closeOnClick={true}
        pauseOnHover={true}
        draggable={true}
        theme='light'
      />
    </>
  );
}

export default App;
