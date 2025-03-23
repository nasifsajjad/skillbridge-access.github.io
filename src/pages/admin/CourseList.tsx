
import React, { useState } from 'react';
import { useCourses } from '@/context/CourseContext';
import MainLayout from '@/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow
} from '@/components/ui/table';
import { Link } from 'react-router-dom';
import { 
  Edit, 
  Trash, 
  Eye, 
  Plus, 
  Search,
  Check,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from '@/components/ui/badge';

const AdminCourseList = () => {
  const { courses, deleteCourse, loading } = useCourses();
  const [searchTerm, setSearchTerm] = useState('');
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);
  
  // Filter courses based on search
  const filteredCourses = courses.filter(course => {
    return !searchTerm || 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.category.toLowerCase().includes(searchTerm.toLowerCase());
  });
  
  const handleDeleteCourse = async () => {
    if (!courseToDelete) return;
    
    try {
      await deleteCourse(courseToDelete);
      toast.success('Course deleted successfully');
    } catch (error) {
      toast.error('Failed to delete course');
      console.error('Delete error:', error);
    } finally {
      setCourseToDelete(null);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Manage Courses</h1>
            <p className="text-muted-foreground mt-1">
              Create, edit and manage your courses
            </p>
          </div>
          
          <Button asChild>
            <Link to="/admin/courses/new">
              <Plus size={16} className="mr-2" />
              New Course
            </Link>
          </Button>
        </div>
        
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 max-w-md"
          />
        </div>
        
        {filteredCourses.length > 0 ? (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Instructor</TableHead>
                  <TableHead>Lessons</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourses.map(course => (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">{course.title}</TableCell>
                    <TableCell>{course.category}</TableCell>
                    <TableCell>{course.instructor}</TableCell>
                    <TableCell>{course.lessons.length}</TableCell>
                    <TableCell>
                      {course.published ? (
                        <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                          <Check size={12} className="mr-1" />
                          Published
                        </Badge>
                      ) : (
                        <Badge variant="outline">
                          <X size={12} className="mr-1" />
                          Draft
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          asChild
                        >
                          <Link to={`/courses/${course.id}`}>
                            <Eye size={16} />
                          </Link>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          asChild
                        >
                          <Link to={`/admin/courses/${course.id}`}>
                            <Edit size={16} />
                          </Link>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => setCourseToDelete(course.id)}
                            >
                              <Trash size={16} />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Course</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{course.title}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                onClick={handleDeleteCourse}
                                disabled={loading}
                              >
                                {loading ? 'Deleting...' : 'Delete'}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12 border rounded-lg">
            <p className="text-lg text-muted-foreground mb-4">No courses found</p>
            {searchTerm ? (
              <Button 
                variant="outline"
                onClick={() => setSearchTerm('')}
              >
                Clear search
              </Button>
            ) : (
              <Button asChild>
                <Link to="/admin/courses/new">Create your first course</Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default AdminCourseList;
