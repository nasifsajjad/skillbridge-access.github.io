
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCourses, Lesson } from '@/context/CourseContext';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/layouts/MainLayout';
import LessonList from '@/components/LessonList';
import LessonContent from '@/components/LessonContent';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Clock, BookOpen, User } from 'lucide-react';
import { toast } from 'sonner';

const CourseDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCourse, getUserCourseProgress, markLessonComplete } = useCourses();
  const { user } = useAuth();
  
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(false);
  
  const course = id ? getCourse(id) : undefined;
  const userProgress = user && course 
    ? getUserCourseProgress(user.id, course.id)
    : undefined;
  
  // Set the first lesson as current when course loads
  useEffect(() => {
    if (course && course.lessons.length > 0) {
      const sortedLessons = [...course.lessons].sort((a, b) => a.order - b.order);
      setCurrentLesson(sortedLessons[0]);
    }
  }, [course]);
  
  if (!course) {
    return (
      <MainLayout>
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold mb-4">Course not found</h1>
          <Button onClick={() => navigate('/courses')}>Back to Courses</Button>
        </div>
      </MainLayout>
    );
  }
  
  const totalLessons = course.lessons.length;
  const completedLessons = userProgress?.completedLessons || [];
  const percentComplete = userProgress?.percentComplete || 0;
  
  const handleSelectLesson = (lesson: Lesson) => {
    setCurrentLesson(lesson);
    // Scroll to top on mobile
    if (window.innerWidth < 768) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const handleMarkComplete = async () => {
    if (!user || !currentLesson) return;
    
    setLoading(true);
    try {
      await markLessonComplete(user.id, course.id, currentLesson.id);
      
      // Find the next lesson if available
      const sortedLessons = [...course.lessons].sort((a, b) => a.order - b.order);
      const currentIndex = sortedLessons.findIndex(l => l.id === currentLesson.id);
      
      if (currentIndex < sortedLessons.length - 1) {
        // If there's a next lesson, advance to it
        const nextLesson = sortedLessons[currentIndex + 1];
        setCurrentLesson(nextLesson);
        toast.success('Lesson completed! Moving to next lesson.');
      } else {
        // If this was the last lesson
        toast.success('Congratulations! You have completed this course.');
      }
    } catch (error) {
      toast.error('Failed to update progress');
    } finally {
      setLoading(false);
    }
  };
  
  // Calculate total duration if available
  const totalDuration = course.lessons.reduce((total, lesson) => {
    return total + (lesson.duration || 0);
  }, 0);

  return (
    <MainLayout>
      <div className="mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mb-4"
          onClick={() => navigate('/courses')}
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to courses
        </Button>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course content area */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{course.title}</h1>
              <p className="text-muted-foreground mt-2">{course.description}</p>
              
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <User size={16} className="mr-1" />
                  <span>Instructor: {course.instructor}</span>
                </div>
                
                <div className="flex items-center text-sm text-muted-foreground">
                  <BookOpen size={16} className="mr-1" />
                  <span>{totalLessons} {totalLessons === 1 ? 'lesson' : 'lessons'}</span>
                </div>
                
                {totalDuration > 0 && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock size={16} className="mr-1" />
                    <span>{totalDuration} minutes</span>
                  </div>
                )}
              </div>
              
              {user && userProgress && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Your progress</span>
                    <span className="text-sm text-muted-foreground">
                      {completedLessons.length} of {totalLessons} completed
                    </span>
                  </div>
                  <Progress value={percentComplete} className="h-2" />
                </div>
              )}
            </div>
            
            {/* Current lesson content */}
            {currentLesson && (
              <div className="mt-8 p-6 border rounded-lg bg-card">
                <LessonContent 
                  lesson={currentLesson}
                  onComplete={handleMarkComplete}
                  isCompleted={completedLessons.includes(currentLesson.id)}
                  isLoading={loading}
                />
              </div>
            )}
          </div>
          
          {/* Lesson list sidebar */}
          <div className="space-y-4">
            <div className="sticky top-4">
              <h3 className="font-medium text-lg mb-4">Course Content</h3>
              
              <LessonList 
                lessons={course.lessons}
                completedLessons={completedLessons}
                onSelectLesson={handleSelectLesson}
                currentLessonId={currentLesson?.id}
              />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CourseDetails;
