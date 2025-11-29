import PropTypes from 'prop-types';
import '../styles/userCards.css';
import { CardItem } from './cardItem';

export const CardsGrid = ({ columns, data }) => {
  return (
    <div className="cards-grid-container">
      {data.map((item) => (
        <CardItem key={item._id} item={item} columns={columns} />
      ))}
    </div>
  );
};

CardsGrid.propTypes = {
  columns: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
};
