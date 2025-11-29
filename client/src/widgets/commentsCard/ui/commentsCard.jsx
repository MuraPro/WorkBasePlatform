import React from 'react';
import { orderBy } from 'lodash';
import { useSelector } from 'react-redux';
import {
  AddCommentForm,
  CommentsList,
  getComments,
  getCommentsLoadingStatus,
} from '@features/comments';

const CommentsCard = () => {
  const loading = useSelector(getCommentsLoadingStatus());
  const comments = useSelector(getComments());
  const sortedComments = orderBy(comments, ['created_at'], ['desc']);

  if (!loading) {
    return (
      <>
        <div className="card mb-2">
          <div className="card-body ">
            <AddCommentForm />
          </div>
        </div>
        <div className="card mb-3">
          <div className="card-body ">
            <h5>Отзывы</h5>
            <hr />
            {loading ? (
              <div className="text-center p-3">
                <LoaderWave />
              </div>
            ) : sortedComments.length > 0 ? (
              <CommentsList comments={sortedComments} />
            ) : (
              <div className="text-muted">Комментариев пока нет...</div>
            )}
          </div>
        </div>
      </>
    );
  }
};
export default CommentsCard;
