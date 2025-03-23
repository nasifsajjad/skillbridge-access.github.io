
import React from 'react';
import { useCourses } from '@/context/CourseContext';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/layouts/MainLayout';
import CourseCard from '@/components/CourseCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const Courses = () => {
  const { courses } = useCourses();
  const { isAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [category, setCategory] = React.useState<string | null>(null);
  
  // Only show published courses for non-admin users
  const visibleCourses = isAdmin 
    ? courses 
    : courses.filter(course => course.published);
  
  // Extract all unique categories
  const categories = Array.from(
    new Set(visibleCourses.map(course => course.category))
  );
  
  // Filter courses based on search and category
  const filteredCourses = visibleCourses.filter(course => {
    const matchesSearch = !searchTerm || 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !category || course.category === category;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Courses</h1>
            <p className="text-muted-foreground mt-1">
              Browse our collection of high-quality courses
            </p>
          </div>
          
          {isAdmin && (
            <Button asChild>
              <Link to="/admin/courses/new">
                <Plus size={16} className="mr-2" />
                New Course
              </Link>
            </Button>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
            <Button
              variant={category === null ? "default" : "outline"}
              size="sm"
              onClick={() => setCategory(null)}
              className="whitespace-nowrap"
            >
              All Categories
            </Button>
            
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={category === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setCategory(cat)}
                className="whitespace-nowrap"
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>
        
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map(course => (
              <CourseCard
                key={course.id}
                course={course}
                href={isAdmin ? `/admin/courses/${course.id}` : `/courses/${course.id}`}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No courses found matching your criteria</p>
            {searchTerm && (
              <Button 
                variant="link" 
                onClick={() => {
                  setSearchTerm('');
                  setCategory(null);
                }}
              >
                Clear filters
              </Button>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Courses;
