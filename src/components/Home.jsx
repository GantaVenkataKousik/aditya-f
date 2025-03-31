import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Faculty from './Faculty';
import Departments from './Departments';
import Footer from './Footer';
import Header from './Header';
import Carousal from './Carousal';
import DisplayClasses from './DisplayClasses';
import FacultyScoreTable from './FacultyScoreTable';
import HoDTable from './HodTable';
import { FaGraduationCap, FaAward, FaUniversity, FaBookReader, FaFlask, FaGlobe, FaBriefcase, FaUsers, FaChalkboardTeacher } from 'react-icons/fa';

const Home = (props) => {
  const faculty = props.faculty;
  const departments = props.departments;
  const [user, setUser] = useState({});
  const [isVisible, setIsVisible] = useState({
    section1: false,
    section2: false,
    section3: false
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const response = await fetch(`https://aditya-b.onrender.com/fetchData?userId=${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          console.error('Failed to fetch user:', response.statusText);
        }
      } catch (error) {
        console.error('Error occurred:', error);
      }
    };
    fetchUser();

    // Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.15
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    const sections = document.querySelectorAll('.animate-on-scroll');
    sections.forEach(section => {
      observer.observe(section);
    });

    return () => {
      sections.forEach(section => {
        observer.unobserve(section);
      });
    };
  }, []);

  return (
    <div>
      <Header />
      <Navbar />
      <Carousal role={user.designation} />

      <div className='m-2 p-1'>
        {/* <div>
        {user.designation === 'Faculty' && <FacultyScoreTable user={user}/>}
        {user.designation === 'HOD' && <FacultyScoreTable user={user}/>}
          <Faculty faculty={faculty} />
        </div> */}


        {user.designation === 'HOD' && <div><Faculty faculty={faculty} /></div>}
        {user.designation === 'Dean' && <div>
          <Departments departments={departments} />
        </div>}

      </div>

      {/* Campus Facilities Section */}
      <section
        id="section1"
        className="animate-on-scroll py-16"
        style={{
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          opacity: isVisible.section1 ? 1 : 0,
          transform: isVisible.section1 ? 'translateY(0)' : 'translateY(50px)',
          transition: 'opacity 0.8s ease, transform 0.8s ease',
        }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#333' }}>
              World-Class Campus Facilities
            </h2>
            <div style={{
              width: '80px',
              height: '4px',
              background: '#ff7f27',
              margin: '0 auto',
              borderRadius: '2px',
              marginBottom: '1.5rem'
            }}></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Aditya provides state-of-the-art facilities designed to enhance the learning experience and foster an environment of academic excellence.
            </p>
          </div>

          <div className="flex flex-wrap justify-center -mx-4">
            {[
              {
                title: 'Modern Hostels',
                icon: <FaUniversity size={36} />,
                description: 'Separate hostels for boys and girls with AC facilities, modern amenities and nutritious dining options.',
                color: '#4285F4',
                bg: '#EBF4FF'
              },
              {
                title: 'Transport Network',
                icon: <FaBriefcase size={36} />,
                description: 'Fleet of 250+ buses serving every corner of the district with regular schedules for safe commuting.',
                color: '#EA4335',
                bg: '#FFF1F0'
              },
              {
                title: 'Digital Library',
                icon: <FaBookReader size={36} />,
                description: 'Over 44,000 volumes and 240 journals with access to global lectures and educational channels.',
                color: '#FBBC05',
                bg: '#FFFAEB'
              },
              {
                title: 'Research Labs',
                icon: <FaFlask size={36} />,
                description: 'Cutting-edge laboratories equipped with the latest instruments for hands-on experiential learning.',
                color: '#34A853',
                bg: '#ECFDF5'
              }
            ].map((facility, index) => (
              <div
                key={index}
                className="w-full md:w-1/2 lg:w-1/4 px-4 mb-8"
                style={{
                  opacity: isVisible.section1 ? 1 : 0,
                  transform: isVisible.section1 ? 'translateY(0)' : 'translateY(30px)',
                  transition: `opacity 0.8s ease ${0.2 + index * 0.1}s, transform 0.8s ease ${0.2 + index * 0.1}s`,
                }}
              >
                <div
                  className="rounded-lg p-6 h-full"
                  style={{
                    backgroundColor: facility.bg,
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-10px)';
                    e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  <div
                    className="rounded-full w-16 h-16 flex items-center justify-center mb-4 mx-auto"
                    style={{ backgroundColor: facility.color, color: 'white' }}
                  >
                    {facility.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-center" style={{ color: facility.color }}>
                    {facility.title}
                  </h3>
                  <p className="text-gray-600 text-center">
                    {facility.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Academic Excellence Section */}
      <section
        id="section2"
        className="animate-on-scroll py-16 bg-white"
        style={{
          opacity: isVisible.section2 ? 1 : 0,
          transform: isVisible.section2 ? 'translateY(0)' : 'translateY(50px)',
          transition: 'opacity 0.8s ease, transform 0.8s ease',
        }}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center">
            <div className="w-full lg:w-1/2 mb-10 lg:mb-0 px-4">
              <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#333' }}>
                Academic Excellence
              </h2>
              <div style={{
                width: '80px',
                height: '4px',
                background: '#ff7f27',
                borderRadius: '2px',
                marginBottom: '1.5rem'
              }}></div>
              <p className="text-lg text-gray-600 mb-6">
                Aditya is ranked among Asia's 100 Best & Fastest Growing Private Education Institutes, recognized by KPMG in India.
              </p>

              <div className="space-y-4">
                {[
                  { title: 'A++ Rating by Careers360', icon: <FaAward />, color: '#4285F4' },
                  { title: 'Among Top 10 in India Today Rankings', icon: <FaGraduationCap />, color: '#EA4335' },
                  { title: 'Excellence in Research & Innovation', icon: <FaFlask />, color: '#34A853' },
                  { title: 'International Academic Collaborations', icon: <FaGlobe />, color: '#FBBC05' },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center"
                    style={{
                      opacity: isVisible.section2 ? 1 : 0,
                      transform: isVisible.section2 ? 'translateX(0)' : 'translateX(-30px)',
                      transition: `opacity 0.8s ease ${0.3 + index * 0.1}s, transform 0.8s ease ${0.3 + index * 0.1}s`,
                    }}
                  >
                    <div style={{
                      color: item.color,
                      marginRight: '12px',
                      fontSize: '1.25rem'
                    }}>
                      {item.icon}
                    </div>
                    <p className="text-gray-700 font-medium">{item.title}</p>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="w-full lg:w-1/2 px-4"
              style={{
                opacity: isVisible.section2 ? 1 : 0,
                transform: isVisible.section2 ? 'translateX(0)' : 'translateX(30px)',
                transition: 'opacity 0.8s ease 0.4s, transform 0.8s ease 0.4s',
              }}
            >
              <div className="relative">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 transform -rotate-6 rounded-xl opacity-30"
                  style={{ zIndex: 0 }}
                ></div>
                <div
                  className="relative bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xl z-10"
                >
                  <div className="grid grid-cols-2 gap-0.5">
                    {[
                      { label: 'Programs', value: '50+', color: '#4285F4' },
                      { label: 'Students', value: '10,000+', color: '#EA4335' },
                      { label: 'Faculty', value: '500+', color: '#FBBC05' },
                      { label: 'Placements', value: '95%', color: '#34A853' },
                    ].map((stat, index) => (
                      <div
                        key={index}
                        className="p-6 text-center"
                        style={{ borderBottom: index < 2 ? '1px solid #eee' : 'none', borderRight: index % 2 === 0 ? '1px solid #eee' : 'none' }}
                      >
                        <p className="text-3xl font-bold mb-1" style={{ color: stat.color }}>{stat.value}</p>
                        <p className="text-gray-500">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industry Partners Section */}
      <section
        id="section3"
        className="animate-on-scroll py-16"
        style={{
          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
          opacity: isVisible.section3 ? 1 : 0,
          transform: isVisible.section3 ? 'translateY(0)' : 'translateY(50px)',
          transition: 'opacity 0.8s ease, transform 0.8s ease',
        }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#333' }}>
              Our Recruiters
            </h2>
            <div style={{
              width: '80px',
              height: '4px',
              background: '#ff7f27',
              margin: '0 auto',
              borderRadius: '2px',
              marginBottom: '1.5rem'
            }}></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We collaborate with industry leaders to ensure our students receive exceptional opportunities for career growth.
            </p>
          </div>

          <div
            className="flex flex-wrap justify-center items-center gap-8 md:gap-10 mb-10"
            style={{
              opacity: isVisible.section3 ? 1 : 0,
              transform: isVisible.section3 ? 'translateY(0)' : 'translateY(30px)',
              transition: 'opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s',
            }}
          >
            {['Cognizant', 'Infosys', 'Accenture', 'Justdial', 'Suntec', 'Mindtree'].map((company, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-4 shadow-md flex items-center justify-center"
                style={{
                  width: '160px',
                  height: '80px',
                  transition: 'all 0.3s ease',
                  transform: `scale(${isVisible.section3 ? 1 : 0.8})`,
                  opacity: isVisible.section3 ? 1 : 0,
                  transitionDelay: `${0.2 + index * 0.1}s`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '';
                }}
              >
                <div className="text-gray-700 font-medium">{company}</div>
              </div>
            ))}
          </div>

          <div
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl p-8 text-center shadow-lg max-w-3xl mx-auto"
            style={{
              opacity: isVisible.section3 ? 1 : 0,
              transform: isVisible.section3 ? 'translateY(0)' : 'translateY(30px)',
              transition: 'opacity 0.8s ease 0.6s, transform 0.8s ease 0.6s',
            }}
          >
            <h3 className="text-2xl font-bold mb-2">95% Placement Record</h3>
            <p className="mb-6">Join Aditya and connect with top companies for a successful career journey</p>
            <button
              className="bg-white text-orange-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition duration-300"
              style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
            >
              Explore Placement Opportunities
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
