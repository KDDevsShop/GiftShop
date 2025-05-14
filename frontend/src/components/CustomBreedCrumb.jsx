import { Breadcrumbs, Link, Typography } from '@mui/material';

const CustomBreedCrumb = ({ breadcrumbs }) => {
  return (
    <div className='bg-gray-200'>
      <div
        role='presentation'
        className='container mx-auto py-4 px-4 mt-1 sm:mt-0'
      >
        <Breadcrumbs
          aria-label='breadcrumb'
          className='flex flex-wrap text-xs sm:text-sm md:text-base lg:text-lg'
        >
          {breadcrumbs.map((breadcrumb, index) => {
            if (index === breadcrumbs.length - 1) {
              return (
                <Typography key={index} className='text-primary'>
                  {breadcrumb.label}
                </Typography>
              );
            } else {
              return (
                <Link
                  key={index}
                  underline='hover'
                  color='inherit'
                  href={breadcrumb.href}
                >
                  {breadcrumb.label}
                </Link>
              );
            }
          })}
        </Breadcrumbs>
      </div>
    </div>
  );
};

export default CustomBreedCrumb;
