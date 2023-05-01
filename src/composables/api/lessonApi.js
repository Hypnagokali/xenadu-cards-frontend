import { api } from 'src/boot/api';
import { extractResponse } from './extractResponse';
import Lesson from 'src/classes/lesson';

const getLessons = function (cardSetId) {
  return {
    retrieve: function () {
      return extractResponse(
        api.get(`/api/card-sets/${cardSetId}/lessons`),
        Lesson
      );
    },
  };
};

const assertTypeLesson = function (obj) {
  if (!obj instanceof Lesson) {
    throw new Error('Lesson must be instance of Lesson');
  }
};

const deleteLesson = function (cardSetId) {
  return {
    delete: function (lesson) {
      assertTypeLesson(lesson);

      return extractResponse(
        api.delete(`/api/card-sets/${cardSetId}/lessons/${lesson.id}`)
      );
    },
  };
};

const updateLesson = function (cardSetId) {
  return {
    update: function (lesson) {
      assertTypeLesson(lesson);

      return extractResponse(
        api.put(`/api/card-sets/${cardSetId}/lessons/${lesson.id}`, lesson),
        Lesson
      );
    },
  };
};

const createLesson = function (cardSetId) {
  return {
    create: function (lesson) {
      if (!lesson instanceof Lesson) {
        throw new Error('Lesson must be instance of Lesson');
      }
      return extractResponse(
        api.post(`/api/card-sets/${cardSetId}/lessons`, lesson),
        Lesson
      );
    },
  };
};

export { createLesson, updateLesson, getLessons, deleteLesson };
