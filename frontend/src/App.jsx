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
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route
          path='/product-type'
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ProductTypeList />
            </ProtectedRoute>
          }
        />

        <Route path='*' element={<NotFoundPage />}></Route>
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
