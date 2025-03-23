
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useCourses } from '@/context/CourseContext';
import { Button } from '@/components/ui/button';
import CourseCard from '@/components/CourseCard';
import { ChevronRight, GraduationCap, Users, Award } from 'lucide-react';

const Index = () => {
  const { user, isAdmin } = useAuth();
  const { courses } = useCourses();
  
  // Only show published courses on the homepage
  const publishedCourses = courses.filter(course => course.published);
  const featuredCourses = publishedCourses.slice(0, 3);

  return (
    <div className="flex flex-col w-full animate-fade-in">
      {/* Header Section */}
      <header className="w-full bg-primary py-4">
        <div className="container mx-auto flex justify-center items-center">
          <h1 className="text-3xl font-bold text-white">NB Institution</h1>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-r from-primary/90 to-primary py-20 md:py-32 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col gap-6 items-center text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
              Advance Your Career with Expert-Led Courses
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl">
              Gain the skills you need to succeed with our comprehensive online learning platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90"
                asChild
              >
                <Link to="/courses">
                  Explore Courses
                </Link>
              </Button>
              {!user ? (
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="bg-transparent border-white text-white hover:bg-white/10"
                  asChild
                >
                  <Link to="/login">
                    Sign In
                  </Link>
                </Button>
              ) : isAdmin ? (
                <Button 
                  size="lg" 
                  variant="outline"
                  className="bg-transparent border-white text-white hover:bg-white/10"
                  asChild
                >
                  <Link to="/admin/dashboard">
                    Admin Dashboard
                  </Link>
                </Button>
              ) : (
                <Button 
                  size="lg" 
                  variant="outline"
                  className="bg-transparent border-white text-white hover:bg-white/10"
                  asChild
                >
                  <Link to="/my-learning">
                    My Learning
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 md:py-24 px-4 container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Why Choose NB Institution
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our platform provides the most comprehensive and efficient learning experience
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
              <GraduationCap size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Expert Instructors</h3>
            <p className="text-muted-foreground">
              Learn from industry professionals with years of experience in their fields
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
              <Award size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Quality Content</h3>
            <p className="text-muted-foreground">
              Access high-quality, curated content designed to help you master skills quickly
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
              <Users size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Community Support</h3>
            <p className="text-muted-foreground">
              Join a community of learners and get support whenever you need it
            </p>
          </div>
        </div>
      </section>
      
      {/* Featured Courses Section */}
      {featuredCourses.length > 0 && (
        <section className="py-16 bg-muted/30 px-4">
          <div className="container">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                Featured Courses
              </h2>
              <Link to="/courses" className="text-primary flex items-center group">
                <span>View All</span>
                <ChevronRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {featuredCourses.map(course => (
                <CourseCard
                  key={course.id}
                  course={course}
                  href={`/courses/${course.id}`}
                />
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4 container">
        <div className="bg-primary/5 border border-primary/10 rounded-xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
            Ready to Start Learning?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Join thousands of students already learning on our platform
          </p>
          <Button 
            size="lg"
            asChild
          >
            <Link to="/courses">
              Browse All Courses
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
