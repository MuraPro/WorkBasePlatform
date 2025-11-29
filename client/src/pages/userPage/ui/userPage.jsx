import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Loader } from '@shared/ui/loader';
import { MeetingsCard } from '@shared/ui/meetingsCard';
import { getCommentsLoadingStatus, loadCommentsList } from '@features/comments';
import { UserCard } from '@features/userCard';
import { getUserById } from '@entities/user';
import { AboutCard } from '@widgets/aboutCard';
import { CommentsCard } from '@widgets/commentsCard';
import { QualitiesCard } from '@widgets/qualityCard';
import '../styles/userPage.css';

const UserPage = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();

  const user = useSelector(getUserById(userId));

  const commentsLoading = useSelector(getCommentsLoadingStatus());

  useEffect(() => {
    dispatch(loadCommentsList(userId));
  }, [dispatch, userId]);

  if (!user || commentsLoading) {
    return (
      <div className="page-loader-wrapper">
        <Loader />
      </div>
    );
  }

  return (
    <div className="container mt-3">
      <div className="row gutters-sm">
        <div className="col-md-4 mb-3">
          <UserCard user={user} />
          <QualitiesCard data={user.qualities} />
          <MeetingsCard value={user.completedMeetings} />
        </div>
        <div className="col-md-8">
          <AboutCard text={user.about} />
          <CommentsCard />
        </div>
      </div>
    </div>
  );
};

export default UserPage;
