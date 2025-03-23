
import React from 'react';
import { useCourses } from '@/context/CourseContext';
import MainLayout from '@/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Users, BookOpen, BookText, Clock } from 'lucide-react';

const AdminDashboard = () => {
  const { courses, userProgress } = useCourses();
  
  // Calculate statistics
  const totalCourses = courses.length;
  const publishedCourses = courses.filter(course => course.published).length;
  const totalLessons = courses.reduce((acc, course) => acc + course.lessons.length, 0);
  
  // Count unique users who have enrolled in courses
  const uniqueUsers = new Set(userProgress.map(progress => progress.userId)).size;
  
  // Calculate average progress across all users
  const averageProgress = userProgress.length > 0
    ? userProgress.reduce((acc, progress) => acc + progress.percentComplete, 0) / userProgress.length
    : 0;
  
  // Count courses by category
  const coursesByCategory = courses.reduce((acc: Record<string, number>, course) => {
    const category = course.category;
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});
  
  // Get course with most enrollments
  const coursesWithEnrollments = courses.map(course => {
    const enrollments = userProgress.filter(progress => progress.courseId === course.id).length;
    return { ...course, enrollments };
  });
  
  const mostPopularCourse = coursesWithEnrollments.length > 0
    ? coursesWithEnrollments.reduce((prev, current) => 
        prev.enrollments > current.enrollments ? prev : current
      )
    : null;

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of your platform's performance
          </p>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{uniqueUsers}</div>
              <p className="text-xs text-muted-foreground">
                {userProgress.length} enrollments
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCourses}</div>
              <p className="text-xs text-muted-foreground">
                {publishedCourses} published
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Lessons</CardTitle>
              <BookText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalLessons}</div>
              <p className="text-xs text-muted-foreground">
                Across {totalCourses} courses
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Avg. Completion</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(averageProgress)}%</div>
              <Progress value={averageProgress} className="h-2 mt-1" />
            </CardContent>
          </Card>
        </div>
        
        {/* Detailed Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Courses by Category */}
          <Card>
            <CardHeader>
              <CardTitle>Courses by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(coursesByCategory).map(([category, count]) => (
                  <div key={category}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{category}</span>
                      <span className="text-sm text-muted-foreground">
                        {count} {count === 1 ? 'course' : 'courses'}
                      </span>
                    </div>
                    <Progress 
                      value={(count / totalCourses) * 100} 
                      className="h-2" 
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Most Popular Course */}
          <Card>
            <CardHeader>
              <CardTitle>Most Popular Course</CardTitle>
            </CardHeader>
            <CardContent>
              {mostPopularCourse ? (
                <div>
                  <div className="aspect-video w-full bg-muted rounded-md overflow-hidden mb-4">
                    <img
                      src={mostPopularCourse.thumbnail}
                      alt={mostPopularCourse.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <h3 className="font-semibold">{mostPopularCourse.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 mb-2">
                    {mostPopularCourse.enrollments} {mostPopularCourse.enrollments === 1 ? 'enrollment' : 'enrollments'}
                  </p>
                  <p className="text-sm line-clamp-2">{mostPopularCourse.description}</p>
                </div>
              ) : (
                <p className="text-muted-foreground">No course enrollments yet</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;
