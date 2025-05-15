const Header = () => {
  return (
    <div>
      <div className='mb-6 flex-col items-center justify-between rounded-lg bg-white shadow-md sm:flex-row'>
        <div className='relative h-64 overflow-hidden rounded-lg bg-white p-6 shadow-md'>
          <img
            src={
              'https://c8.alamy.com/comp/PKB5FP/banner-with-two-christmas-gift-boxes-and-balls-on-blue-background-gift-boxes-tied-with-red-and-blue-ribbons-PKB5FP.jpg'
            }
            alt='Sport Banner'
            className='absolute inset-0 z-0 h-full w-full object-cover'
          />

          <div className='absolute inset-0 z-10 bg-black opacity-25'></div>
        </div>
      </div>
    </div>
  );
};

export default Header;
