import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { CardsGrid } from '@shared/ui/grid';
import { BookMark } from '@entities/bookmark';
import { Profession } from '@entities/profession';
import { QualitiesList } from '@entities/quality';

const UserCards = ({ users, onToggleBookMark }) => {
  const columns = {
    name: {
      path: 'name',
      name: 'Имя',
      component: (user) => (
        <Link
          className="text-decoration-none fw-bold"
          to={`/users/${user._id}`}
        >
          {user.name}
        </Link>
      ),
    },
    qualities: {
      name: 'Качества',
      component: (user) => (
        <div className="d-flex flex-wrap gap-1">
          <QualitiesList qualities={user.qualities} />
        </div>
      ),
    },
    profession: {
      name: 'Профессия',
      component: (user) => <Profession id={user.profession} />,
    },
    completedMeetings: {
      path: 'completedMeetings',
      name: 'Обращений',
    },
    rate: {
      path: 'rate',
      name: 'Оценка',
    },
    bookmark: {
      name: 'Избранное',
      component: (user) => (
        <BookMark
          status={user.bookmark}
          onClick={() => onToggleBookMark(user._id)}
        />
      ),
    },
  };

  return <CardsGrid columns={columns} data={users} />;
};

UserCards.propTypes = {
  users: PropTypes.array.isRequired,
  onToggleBookMark: PropTypes.func.isRequired,
};

export default UserCards;
