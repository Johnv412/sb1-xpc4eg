import React, { useEffect, useState } from 'react';
import { useLessonStore } from '../store/lessonStore';
import { LessonCard } from '../components/LessonCard';
import { LessonViewer } from '../components/LessonViewer';
import { FlashcardComponent } from '../components/FlashcardComponent';
import { Search, Filter } from 'lucide-react';

function Lessons() {
  const { lessons, userProgress, fetchLessons, markLessonComplete } = useLessonStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [practiceLesson, setPracticeLesson] = useState(null);

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

  const handleStartLesson = (lesson) => {
    setSelectedLesson(lesson);
  };

  const handlePracticeLesson = (lesson) => {
    setPracticeLesson(lesson);
  };

  const handleCompleteLesson = async () => {
    if (selectedLesson) {
      await markLessonComplete(selectedLesson.id);
      setSelectedLesson(null);
    }
  };

  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lesson.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel === 'all' || lesson.level === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Available Lessons</h1>
          
          <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search lessons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            {/* Filter */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredLessons.map((lesson) => (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            isCompleted={!!userProgress[lesson.id]}
            onStart={() => handleStartLesson(lesson)}
            onPractice={() => handlePracticeLesson(lesson)}
          />
        ))}
      </div>

      {filteredLessons.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No lessons found matching your criteria.</p>
        </div>
      )}

      {selectedLesson && (
        <LessonViewer
          lesson={selectedLesson}
          onComplete={handleCompleteLesson}
          onClose={() => setSelectedLesson(null)}
          isCompleted={!!userProgress[selectedLesson.id]}
        />
      )}

      {practiceLesson && (
        <FlashcardComponent
          lesson={practiceLesson}
          onClose={() => setPracticeLesson(null)}
        />
      )}
    </div>
  );
}

export default Lessons;