import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import '../styles/userCards.css';

export const CardItem = ({ item, columns }) => {
  const renderContent = (item, column) => {
    if (columns[column].component) {
      const component = columns[column].component;
      return typeof component === 'function' ? component(item) : component;
    }
    return _.get(item, columns[column].path);
  };

  const avatarUrl =
    item.image ||
    `https://api.dicebear.com/7.x/adventurer/svg?seed=${item._id}`;

  return (
    <div className="user-card-modern">
      {/* Avatar */}
      <div className="user-card-avatar">
        <img src={avatarUrl} alt={item.name} />
      </div>

      {/* Main info */}
      <div className="user-card-info">
        <h3 className="user-card-name">{renderContent(item, 'name')}</h3>

        <div className="user-card-details">
          <p>
            <strong>{columns.profession.name}: </strong>
            {renderContent(item, 'profession')}
          </p>
          <p>
            <strong>{columns.qualities.name}: </strong>
            {renderContent(item, 'qualities')}
          </p>
          <p>
            <strong>{columns.completedMeetings.name}: </strong>
            {renderContent(item, 'completedMeetings')}
          </p>
          <p>
            <strong>{columns.rate.name}: </strong>
            {renderContent(item, 'rate')}
          </p>
        </div>

        <div className="user-card-bookmark">
          {renderContent(item, 'bookmark')}
        </div>
      </div>
    </div>
  );
};

CardItem.propTypes = {
  item: PropTypes.object.isRequired,
  columns: PropTypes.object.isRequired,
};
