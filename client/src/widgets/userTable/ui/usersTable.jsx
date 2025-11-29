import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Table } from '@shared/ui/table';
import { BookMark } from '@entities/bookmark';
import { Profession } from '@entities/profession';
import { QualitiesList } from '@entities/quality';

const UserTable = ({ users, onSort, selectedSort, onToggleBookMark }) => {
  const columns = {
    name: {
      path: 'name',
      name: 'Имя',
      component: (user) => (
        <Link className="text-decoration-none" to={`/users/${user._id}`}>
          {user.name}
        </Link>
      ),
    },
    qualities: {
      name: 'Качества',
      component: (user) => (
        <div className="d-flex flex-column align-items-start">
          <QualitiesList qualities={user.qualities} />
        </div>
      ),
    },
    professions: {
      name: 'Профессия',
      component: (user) => <Profession id={user.profession} />,
    },
    completedMeetings: {
      path: 'completedMeetings',
      name: 'Обращений',
    },
    rate: { path: 'rate', name: 'Оценка' },
    bookmark: {
      path: 'bookmark',
      name: 'Избранное',
      component: (user) => (
        <BookMark
          userId={user._id}
          onClick={() => onToggleBookMark(user._id)}
        />
      ),
    },
  };

  return (
    <Table
      onSort={onSort}
      selectedSort={selectedSort}
      columns={columns}
      data={users}
    />
  );
};

UserTable.propTypes = {
  users: PropTypes.array.isRequired,
  onSort: PropTypes.func.isRequired,
  selectedSort: PropTypes.object.isRequired,
  onToggleBookMark: PropTypes.func.isRequired,
};

export default UserTable;
