
import React from 'react';
import { useCourses } from '@/context/CourseContext';
import MainLayout from '@/layouts/MainLayout';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, CheckCircle } from 'lucide-react';

// For demo purposes, we'll use mock user data
const MOCK_USERS = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@nbinstitution.com',
    role: 'admin',
    lastLogin: '2023-08-15T10:30:00Z',
  },
  {
    id: '2',
    name: 'Demo User',
    email: 'user@example.com',
    role: 'user',
    lastLogin: '2023-08-14T15:45:00Z',
  },
];

const AdminUsers = () => {
  const { userProgress, courses } = useCourses();
  const [searchTerm, setSearchTerm] = React.useState('');
  
  // Filter users based on search
  const filteredUsers = MOCK_USERS.filter(user => {
    return !searchTerm || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
  });
  
  // Get course enrollments for each user
  const getUserEnrollments = (userId: string) => {
    const enrollments = userProgress.filter(progress => progress.userId === userId);
    return {
      count: enrollments.length,
      completedCount: enrollments.filter(progress => progress.percentComplete === 100).length,
      courses: enrollments.map(enrollment => {
        const course = courses.find(c => c.id === enrollment.courseId);
        return {
          ...enrollment,
          courseTitle: course?.title || 'Unknown Course',
        };
      }),
    };
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground mt-1">
            Manage platform users and their enrollments
          </p>
        </div>
        
        <div className="relative max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Enrolled Courses</TableHead>
                <TableHead>Completed Courses</TableHead>
                <TableHead>Last Login</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map(user => {
                const enrollments = getUserEnrollments(user.id);
                
                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.role === 'admin' ? 'default' : 'outline'}>
                        {user.role === 'admin' ? 'Admin' : 'User'}
                      </Badge>
                    </TableCell>
                    <TableCell>{enrollments.count}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {enrollments.completedCount}
                        {enrollments.completedCount > 0 && (
                          <CheckCircle size={14} className="text-green-500" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(user.lastLogin)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminUsers;
