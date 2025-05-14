import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

const CustomPagination = ({ path, totalPages }) => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const currentPage = parseInt(query.get('page') || '1', 10);

  return (
    <Pagination
      page={currentPage}
      count={totalPages}
      renderItem={(item) => {
        const pageNumber = item.page;
        // Clone query parameters and remove the existing 'page' parameter
        const updatedQuery = new URLSearchParams(query.toString());
        updatedQuery.set('page', pageNumber);
        // Generate the URL for each page
        const to = `${path}?${updatedQuery.toString()}`;

        return <PaginationItem component={Link} to={to} {...item} />;
      }}
    />
  );
};

CustomPagination.propTypes = {
  path: PropTypes.string.isRequired,
  totalPages: PropTypes.number.isRequired,
};

export default CustomPagination;
