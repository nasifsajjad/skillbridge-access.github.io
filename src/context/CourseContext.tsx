
import React, { createContext, useContext, useState } from 'react';
import { toast } from 'sonner';

export type Lesson = {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'pdf' | 'text';
  content: string;
  duration?: number; // in minutes for videos
  order: number;
};

export type Course = {
  id: string;
  title: string;
  description: string;
  instructor: string;
  thumbnail: string;
  category: string;
  price: number;
  lessons: Lesson[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

export type UserProgress = {
  userId: string;
  courseId: string;
  completedLessons: string[]; // Array of lesson IDs
  lastAccessed: string; // ISO date string
  percentComplete: number; // 0-100
};

type CourseContextType = {
  courses: Course[];
  userProgress: UserProgress[];
  loading: boolean;
  createCourse: (course: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Course>;
  updateCourse: (id: string, courseData: Partial<Course>) => Promise<Course>;
  deleteCourse: (id: string) => Promise<void>;
  getCourse: (id: string) => Course | undefined;
  addLesson: (courseId: string, lesson: Omit<Lesson, 'id'>) => Promise<Lesson>;
  updateLesson: (courseId: string, lessonId: string, lessonData: Partial<Lesson>) => Promise<Lesson>;
  deleteLesson: (courseId: string, lessonId: string) => Promise<void>;
  markLessonComplete: (userId: string, courseId: string, lessonId: string) => Promise<void>;
  getUserCourseProgress: (userId: string, courseId: string) => UserProgress | undefined;
};

// Mock data for demonstration
const MOCK_COURSES: Course[] = [
  {
    id: '1',
    title: 'Introduction to Digital Design',
    description: 'Learn the basics of digital design, including color theory, typography, and layout principles.',
    instructor: 'Jane Smith',
    thumbnail: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=2592&h=1728',
    category: 'Design',
    price: 49.99,
    published: true,
    createdAt: '2023-05-15T10:30:00Z',
    updatedAt: '2023-06-10T14:20:00Z',
    lessons: [
      {
        id: '1-1',
        title: 'Understanding Color Theory',
        description: 'Learn how colors interact and how to create effective color schemes.',
        type: 'video',
        content: 'https://example.com/videos/color-theory.mp4',
        duration: 25,
        order: 1,
      },
      {
        id: '1-2',
        title: 'Typography Fundamentals',
        description: 'Explore the basics of typography and how to choose fonts for your designs.',
        type: 'text',
        content: 'Typography is the art and technique of arranging type to make written language legible, readable, and appealing when displayed...',
        order: 2,
      },
    ],
  },
  {
    id: '2',
    title: 'Advanced Web Development',
    description: 'Master modern web development techniques with React, Node.js, and cloud services.',
    instructor: 'David Johnson',
    thumbnail: 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&q=80&w=2664&h=1512',
    category: 'Programming',
    price: 79.99,
    published: true,
    createdAt: '2023-04-20T09:15:00Z',
    updatedAt: '2023-06-05T11:45:00Z',
    lessons: [
      {
        id: '2-1',
        title: 'React Component Architecture',
        description: 'Learn to structure React applications with clean component architecture.',
        type: 'video',
        content: 'https://example.com/videos/react-architecture.mp4',
        duration: 35,
        order: 1,
      },
      {
        id: '2-2',
        title: 'State Management with Redux',
        description: 'Master global state management with Redux and React-Redux.',
        type: 'pdf',
        content: 'https://example.com/pdfs/redux-guide.pdf',
        order: 2,
      },
    ],
  },
];

const MOCK_USER_PROGRESS: UserProgress[] = [
  {
    userId: '2', // Demo User
    courseId: '1',
    completedLessons: ['1-1'],
    lastAccessed: '2023-07-20T15:45:00Z',
    percentComplete: 50, // 1 of 2 lessons completed
  },
];

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const CourseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);
  const [userProgress, setUserProgress] = useState<UserProgress[]>(MOCK_USER_PROGRESS);
  const [loading, setLoading] = useState(false);

  // Create a new course
  const createCourse = async (courseData: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>): Promise<Course> => {
    setLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newCourse: Course = {
        ...courseData,
        id: Math.random().toString(36).substring(7),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setCourses(prevCourses => [...prevCourses, newCourse]);
      toast.success('Course created successfully');
      return newCourse;
    } catch (error) {
      toast.error('Failed to create course');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing course
  const updateCourse = async (id: string, courseData: Partial<Course>): Promise<Course> => {
    setLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const courseIndex = courses.findIndex(course => course.id === id);
      
      if (courseIndex === -1) {
        throw new Error('Course not found');
      }
      
      const updatedCourse: Course = {
        ...courses[courseIndex],
        ...courseData,
        updatedAt: new Date().toISOString(),
      };
      
      const updatedCourses = [...courses];
      updatedCourses[courseIndex] = updatedCourse;
      
      setCourses(updatedCourses);
      toast.success('Course updated successfully');
      return updatedCourse;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update course');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Delete a course
  const deleteCourse = async (id: string): Promise<void> => {
    setLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCourses(prevCourses => prevCourses.filter(course => course.id !== id));
      
      // Also remove any user progress related to this course
      setUserProgress(prevProgress => prevProgress.filter(progress => progress.courseId !== id));
      
      toast.success('Course deleted successfully');
    } catch (error) {
      toast.error('Failed to delete course');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get a course by ID
  const getCourse = (id: string): Course | undefined => {
    return courses.find(course => course.id === id);
  };

  // Add a lesson to a course
  const addLesson = async (courseId: string, lessonData: Omit<Lesson, 'id'>): Promise<Lesson> => {
    setLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const courseIndex = courses.findIndex(course => course.id === courseId);
      
      if (courseIndex === -1) {
        throw new Error('Course not found');
      }
      
      const newLesson: Lesson = {
        ...lessonData,
        id: `${courseId}-${Math.random().toString(36).substring(7)}`,
      };
      
      const updatedCourse = {
        ...courses[courseIndex],
        lessons: [...courses[courseIndex].lessons, newLesson],
        updatedAt: new Date().toISOString(),
      };
      
      const updatedCourses = [...courses];
      updatedCourses[courseIndex] = updatedCourse;
      
      setCourses(updatedCourses);
      toast.success('Lesson added successfully');
      return newLesson;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add lesson');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update a lesson
  const updateLesson = async (
    courseId: string, 
    lessonId: string, 
    lessonData: Partial<Lesson>
  ): Promise<Lesson> => {
    setLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const courseIndex = courses.findIndex(course => course.id === courseId);
      
      if (courseIndex === -1) {
        throw new Error('Course not found');
      }
      
      const lessonIndex = courses[courseIndex].lessons.findIndex(
        lesson => lesson.id === lessonId
      );
      
      if (lessonIndex === -1) {
        throw new Error('Lesson not found');
      }
      
      const updatedLesson: Lesson = {
        ...courses[courseIndex].lessons[lessonIndex],
        ...lessonData,
      };
      
      const updatedLessons = [...courses[courseIndex].lessons];
      updatedLessons[lessonIndex] = updatedLesson;
      
      const updatedCourse = {
        ...courses[courseIndex],
        lessons: updatedLessons,
        updatedAt: new Date().toISOString(),
      };
      
      const updatedCourses = [...courses];
      updatedCourses[courseIndex] = updatedCourse;
      
      setCourses(updatedCourses);
      toast.success('Lesson updated successfully');
      return updatedLesson;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update lesson');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Delete a lesson
  const deleteLesson = async (courseId: string, lessonId: string): Promise<void> => {
    setLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const courseIndex = courses.findIndex(course => course.id === courseId);
      
      if (courseIndex === -1) {
        throw new Error('Course not found');
      }
      
      const updatedLessons = courses[courseIndex].lessons.filter(
        lesson => lesson.id !== lessonId
      );
      
      const updatedCourse = {
        ...courses[courseIndex],
        lessons: updatedLessons,
        updatedAt: new Date().toISOString(),
      };
      
      const updatedCourses = [...courses];
      updatedCourses[courseIndex] = updatedCourse;
      
      setCourses(updatedCourses);
      
      // Update user progress for affected users
      setUserProgress(prevProgress => 
        prevProgress.map(progress => {
          if (progress.courseId === courseId && progress.completedLessons.includes(lessonId)) {
            const updatedCompletedLessons = progress.completedLessons.filter(id => id !== lessonId);
            const totalLessons = updatedCourse.lessons.length;
            const percentComplete = totalLessons > 0 
              ? (updatedCompletedLessons.length / totalLessons) * 100 
              : 0;
            
            return {
              ...progress,
              completedLessons: updatedCompletedLessons,
              percentComplete,
            };
          }
          return progress;
        })
      );
      
      toast.success('Lesson deleted successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete lesson');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Mark a lesson as complete
  const markLessonComplete = async (
    userId: string, 
    courseId: string, 
    lessonId: string
  ): Promise<void> => {
    setLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const courseIndex = courses.findIndex(course => course.id === courseId);
      
      if (courseIndex === -1) {
        throw new Error('Course not found');
      }
      
      const lessonExists = courses[courseIndex].lessons.some(lesson => lesson.id === lessonId);
      
      if (!lessonExists) {
        throw new Error('Lesson not found');
      }
      
      const totalLessons = courses[courseIndex].lessons.length;
      
      // Find existing progress or create new
      const progressIndex = userProgress.findIndex(
        progress => progress.userId === userId && progress.courseId === courseId
      );
      
      if (progressIndex >= 0) {
        // Update existing progress
        const updatedProgress = [...userProgress];
        const currentProgress = { ...updatedProgress[progressIndex] };
        
        // Only add if not already completed
        if (!currentProgress.completedLessons.includes(lessonId)) {
          currentProgress.completedLessons.push(lessonId);
          currentProgress.percentComplete = (currentProgress.completedLessons.length / totalLessons) * 100;
        }
        
        currentProgress.lastAccessed = new Date().toISOString();
        updatedProgress[progressIndex] = currentProgress;
        
        setUserProgress(updatedProgress);
      } else {
        // Create new progress entry
        const newProgress: UserProgress = {
          userId,
          courseId,
          completedLessons: [lessonId],
          lastAccessed: new Date().toISOString(),
          percentComplete: (1 / totalLessons) * 100,
        };
        
        setUserProgress([...userProgress, newProgress]);
      }
      
      toast.success('Progress updated');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update progress');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get user's progress for a specific course
  const getUserCourseProgress = (userId: string, courseId: string): UserProgress | undefined => {
    return userProgress.find(
      progress => progress.userId === userId && progress.courseId === courseId
    );
  };

  return (
    <CourseContext.Provider
      value={{
        courses,
        userProgress,
        loading,
        createCourse,
        updateCourse,
        deleteCourse,
        getCourse,
        addLesson,
        updateLesson,
        deleteLesson,
        markLessonComplete,
        getUserCourseProgress,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};

export const useCourses = () => {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error('useCourses must be used within a CourseProvider');
  }
  return context;
};
