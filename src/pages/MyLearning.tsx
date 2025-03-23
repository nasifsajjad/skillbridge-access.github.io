
import React from 'react';
import { useCourses } from '@/context/CourseContext';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/layouts/MainLayout';
import CourseCard from '@/components/CourseCard';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

const MyLearning = () => {
  const { user } = useAuth();
  const { courses, userProgress } = useCourses();
  const navigate = useNavigate();
  
  // Only show courses where the user has progress
  const userCourseIds = userProgress
    .filter(progress => progress.userId === user?.id)
    .map(progress => progress.courseId);
  
  // Get courses with user progress
  const userCourses = courses
    .filter(course => userCourseIds.includes(course.id))
    .map(course => {
      const progress = userProgress.find(
        p => p.userId === user?.id && p.courseId === course.id
      );
      return {
        ...course,
        progress: progress?.percentComplete || 0,
        completedLessons: progress?.completedLessons || [],
        lastAccessed: progress?.lastAccessed
      };
    })
    .sort((a, b) => {
      // Sort by last accessed first, then by progress
      if (a.lastAccessed && b.lastAccessed) {
        return new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime();
      }
      return b.progress - a.progress;
    });
  
  // Calculate overall progress
  const totalCourses = userCourses.length;
  const completedCourses = userCourses.filter(course => course.progress === 100).length;
  const overallProgress = totalCourses > 0 
    ? (completedCourses / totalCourses) * 100 
    : 0;

  // If not logged in, redirect to login
  if (!user) {
    return (
      <MainLayout>
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold mb-4">Please sign in to view your learning</h1>
          <Button onClick={() => navigate('/login')}>Sign In</Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Learning</h1>
          <p className="text-muted-foreground mt-1">
            Track your progress and continue learning
          </p>
        </div>
        
        {totalCourses > 0 ? (
          <>
            <div className="p-6 border rounded-lg bg-card">
              <h2 className="text-xl font-semibold mb-4">Overall Progress</h2>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">
                  {completedCourses} of {totalCourses} courses completed
                </span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(overallProgress)}%
                </span>
              </div>
              <Progress value={overallProgress} className="h-2" />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {userCourses.map(course => (
                <CourseCard
                  key={course.id}
                  course={course}
                  progress={course.progress}
                  href={`/courses/${course.id}`}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
              <BookOpen size={32} />
            </div>
            <h2 className="text-xl font-semibold mb-2">No courses yet</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              You haven't started any courses yet. Browse our catalog to find something you're interested in.
            </p>
            <Button asChild>
              <Link to="/courses">Browse Courses</Link>
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default MyLearning;
