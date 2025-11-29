import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { isFavorite } from '@entities/user';
import '../style/bookmark.css';

const BookMark = ({ userId, ...rest }) => {
  const isFav = useSelector(isFavorite(userId));
  return (
    <button {...rest} className="bookmark">
      <i className={'bi bi-bookmark' + (isFav ? '-heart-fill' : '')}></i>
    </button>
  );
};
BookMark.propTypes = {
  status: PropTypes.string,
};

export default BookMark;
