import React, { useState, useEffect, useRef } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import one from "../images/one.jpg";
import two from "../images/two.jpg";
import three from "../images/three.jpeg";
import four from "../images/four.jpg";
import five from "../images/five.jpg";

const Carousal = (props) => {
  const [canShow, setCanShow] = useState(false);
  const [role, setRole] = useState('');
  const [activeSlide, setActiveSlide] = useState(0);
  const [hoveredLink, setHoveredLink] = useState(null);
  const carouselRef = useRef(null);

  // Slide captions and buttons
  const slideContent = [
    {
      title: "Welcome to Aditya University",
      subtitle: "Shaping futures through excellence in education",
      buttonText: "Explore Programs",
      buttonLink: "/academics"
    },
    {
      title: "State-of-the-Art Facilities",
      subtitle: "Modern laboratories and learning environments",
      buttonText: "Tour Campus",
      buttonLink: "/campus"
    },
    {
      title: "Research & Innovation",
      subtitle: "Pushing boundaries through cutting-edge research",
      buttonText: "Research Centers",
      buttonLink: "/research"
    },
    {
      title: "Global Opportunities",
      subtitle: "International partnerships and exchange programs",
      buttonText: "Global Network",
      buttonLink: "/international"
    },
    {
      title: "Student Success",
      subtitle: "Preparing graduates for a changing world",
      buttonText: "Alumni Stories",
      buttonLink: "/alumni"
    }
  ];

  useEffect(() => {
    const role = localStorage.getItem('role');
    setRole(role);
    if (role === 'HOD' || role === 'Dean' || role === 'Admin') {
      setCanShow(false);
    }

    // Add keyboard navigation for carousel
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        carouselRef.current?.previousSlide();
      } else if (e.key === 'ArrowRight') {
        carouselRef.current?.nextSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSlideChange = (index) => {
    setActiveSlide(index);
  };

  return (
    <div style={styles.container}>
      {/* Modern Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <h2 style={styles.sidebarTitle}>Navigation</h2>
          <div style={styles.divider}></div>
        </div>

        <ul style={styles.navList}>
          <li>
            <a
              href="/profile"
              style={{
                ...styles.navLink,
                ...(hoveredLink === 'profile' ? styles.navLinkHover : {})
              }}
              onMouseEnter={() => setHoveredLink('profile')}
              onMouseLeave={() => setHoveredLink(null)}
            >
              <span style={styles.navIcon}>📋</span>
              <span style={styles.navText}>Part-A</span>
            </a>
          </li>
          <li>
            <a
              href="/partb"
              style={{
                ...styles.navLink,
                ...(hoveredLink === 'partb' ? styles.navLinkHover : {})
              }}
              onMouseEnter={() => setHoveredLink('partb')}
              onMouseLeave={() => setHoveredLink(null)}
            >
              <span style={styles.navIcon}>📊</span>
              <span style={styles.navText}>Part-B</span>
            </a>
          </li>

          {role === 'Faculty' && (
            <li>
              <a
                href="/facultyaprisaltable"
                style={{
                  ...styles.navLink,
                  ...(hoveredLink === 'facultyaprisal' ? styles.navLinkHover : {})
                }}
                onMouseEnter={() => setHoveredLink('facultyaprisal')}
                onMouseLeave={() => setHoveredLink(null)}
              >
                <span style={styles.navIcon}>📝</span>
                <span style={styles.navText}>Faculty Self Appraisal</span>
              </a>
            </li>
          )}
          {role === 'HOD' && (
            <li>
              <a
                href="/hodtable"
                style={{
                  ...styles.navLink,
                  ...(hoveredLink === 'hodtable' ? styles.navLinkHover : {})
                }}
                onMouseEnter={() => setHoveredLink('hodtable')}
                onMouseLeave={() => setHoveredLink(null)}
              >
                <span style={styles.navIcon}>👨‍💼</span>
                <span style={styles.navText}>HOD Table</span>
              </a>
            </li>
          )}
          {role === 'Admin' && (
            <li>
              <a
                href="/admin"
                style={{
                  ...styles.navLink,
                  ...(hoveredLink === 'admin' ? styles.navLinkHover : {})
                }}
                onMouseEnter={() => setHoveredLink('admin')}
                onMouseLeave={() => setHoveredLink(null)}
              >
                <span style={styles.navIcon}>⚙️</span>
                <span style={styles.navText}>Admin Panel</span>
              </a>
            </li>
          )}
          <li>
            <a
              href="/about"
              style={{
                ...styles.navLink,
                ...(hoveredLink === 'about' ? styles.navLinkHover : {})
              }}
              onMouseEnter={() => setHoveredLink('about')}
              onMouseLeave={() => setHoveredLink(null)}
            >
              <span style={styles.navIcon}>ℹ️</span>
              <span style={styles.navText}>About</span>
            </a>
          </li>
        </ul>

        <div style={styles.sidebarFooter}>
          <div style={styles.quickStats}>
            <div style={styles.statItem}>
              <span style={styles.statNumber}>15k+</span>
              <span style={styles.statLabel}>Students</span>
            </div>
            <div style={styles.statItem}>
              <span style={styles.statNumber}>500+</span>
              <span style={styles.statLabel}>Faculty</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Carousel Container */}
      <div style={styles.carouselContainer}>
        <Carousel
          ref={carouselRef}
          autoPlay
          infiniteLoop
          interval={5000}
          showThumbs={false}
          showStatus={false}
          showIndicators={true}
          onChange={handleSlideChange}
          swipeable={true}
          emulateTouch={true}
          stopOnHover={true}
          transitionTime={1000}
          renderIndicator={(clickHandler, isSelected, index) => (
            <div
              style={{
                display: 'inline-block',
                margin: '0 8px',
                cursor: 'pointer',
              }}
              onClick={clickHandler}
              key={index}
            >
              <div style={{
                width: '12px',
                height: '12px',
                backgroundColor: isSelected ? '#ff7f27' : 'rgba(255, 255, 255, 0.5)',
                borderRadius: '50%',
                transition: 'all 0.3s ease',
                transform: isSelected ? 'scale(1.2)' : 'scale(1)',
              }}></div>
            </div>
          )}
          renderArrowPrev={(clickHandler, hasPrev) => (
            hasPrev && (
              <button
                onClick={clickHandler}
                className="carousel-arrow prev"
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '20px',
                  transform: 'translateY(-50%)',
                  zIndex: 10,
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: 'none',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 127, 39, 0.8)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(0, 0, 0, 0.3)';
                }}
              >
                &#10094;
              </button>
            )
          )}
          renderArrowNext={(clickHandler, hasNext) => (
            hasNext && (
              <button
                onClick={clickHandler}
                className="carousel-arrow next"
                style={{
                  position: 'absolute',
                  top: '50%',
                  right: '20px',
                  transform: 'translateY(-50%)',
                  zIndex: 10,
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: 'none',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 127, 39, 0.8)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(0, 0, 0, 0.3)';
                }}
              >
                &#10095;
              </button>
            )
          )}
        >
          {[one, two, three, four, five].map((src, index) => (
            <div key={index} style={styles.carouselSlide}>
              <img
                src={src}
                alt={`Slide ${index + 1}`}
                style={styles.image}
              />
              <div
                className="carousel-caption"
                style={{
                  position: 'absolute',
                  bottom: '0',
                  left: '0',
                  right: '0',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                  color: 'white',
                  padding: '40px 20px 20px',
                  textAlign: 'left',
                  opacity: activeSlide === index ? 1 : 0,
                  transform: activeSlide === index ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'opacity 0.5s ease, transform 0.5s ease',
                }}
              >
                <div
                  className="container"
                  style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    paddingLeft: '20px',
                  }}
                >
                  <h2
                    style={{
                      fontSize: '2.5rem',
                      fontWeight: 'bold',
                      margin: '0 0 10px',
                      textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                      animation: activeSlide === index ? 'fadeInUp 1s ease' : 'none',
                      color: 'white',
                    }}
                  >
                    {slideContent[index].title}
                  </h2>
                  <p
                    style={{
                      fontSize: '1.2rem',
                      fontWeight: '300',
                      marginBottom: '20px',
                      maxWidth: '700px',
                      textShadow: '1px 1px 3px rgba(0,0,0,0.5)',
                      animation: activeSlide === index ? 'fadeInUp 1s ease 0.2s' : 'none',
                      animationFillMode: 'both',
                      color: 'white',
                    }}
                  >
                    {slideContent[index].subtitle}
                  </p>
                  <a
                    href={slideContent[index].buttonLink}
                    style={{
                      display: 'inline-block',
                      padding: '12px 25px',
                      backgroundColor: '#ff7f27',
                      color: 'white',
                      borderRadius: '30px',
                      textDecoration: 'none',
                      fontWeight: 'bold',
                      boxShadow: '0 4px 15px rgba(255, 127, 39, 0.4)',
                      transition: 'all 0.3s ease',
                      animation: activeSlide === index ? 'fadeInUp 1s ease 0.4s' : 'none',
                      animationFillMode: 'both',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#e86b10';
                      e.target.style.transform = 'translateY(-3px)';
                      e.target.style.boxShadow = '0 6px 20px rgba(255, 127, 39, 0.6)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#ff7f27';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 15px rgba(255, 127, 39, 0.4)';
                    }}
                  >
                    {slideContent[index].buttonText} →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </Carousel>

        {/* Image Counter */}
        <div style={styles.imageCounter}>
          <span style={styles.currentImage}>{activeSlide + 1}</span>
          <span style={styles.totalImages}>/ 5</span>
        </div>
      </div>

      {/* CSS Animations */}
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes pulse {
            0% {
              box-shadow: 0 0 0 0 rgba(255, 127, 39, 0.7);
            }
            70% {
              box-shadow: 0 0 0 10px rgba(255, 127, 39, 0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(255, 127, 39, 0);
            }
          }
        `}
      </style>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    maxWidth: "100%",
    margin: "0 auto",
    overflow: "hidden",
    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
    borderRadius: "10px",
  },
  sidebar: {
    width: "300px",
    background: "linear-gradient(135deg, #002b5e 0%, #004a94 100%)",
    padding: "25px 0",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    boxShadow: "5px 0 15px rgba(0, 0, 0, 0.1)",
    position: "relative",
    zIndex: 2,
  },
  sidebarHeader: {
    padding: "0 25px 20px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    marginBottom: "20px",
  },
  sidebarTitle: {
    fontSize: "24px",
    fontWeight: "600",
    margin: "0 0 10px",
    color: "white",
  },
  divider: {
    width: "40px",
    height: "4px",
    backgroundColor: "#ff7f27",
    borderRadius: "2px",
  },
  navList: {
    listStyleType: "none",
    padding: "0 15px",
    margin: 0,
    flexGrow: 1,
  },
  navLink: {
    display: "flex",
    alignItems: "center",
    padding: "14px 20px",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "8px",
    marginBottom: "8px",
    transition: "all 0.3s ease",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  navLinkHover: {
    backgroundColor: "rgba(255, 127, 39, 0.5)",
    transform: "translateX(5px)",
  },
  navIcon: {
    marginRight: "15px",
    fontSize: "18px",
    opacity: 0.9,
  },
  navText: {
    fontSize: "16px",
    fontWeight: "500",
  },
  sidebarFooter: {
    padding: "20px 25px 0",
    borderTop: "1px solid rgba(255, 255, 255, 0.1)",
    marginTop: "auto",
  },
  quickStats: {
    display: "flex",
    justifyContent: "space-between",
  },
  statItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  statNumber: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#ff7f27",
  },
  statLabel: {
    fontSize: "14px",
    color: "rgba(255, 255, 255, 0.7)",
  },
  carouselContainer: {
    flex: 1,
    position: "relative",
    overflow: "hidden",
  },
  carouselSlide: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: "550px",
    objectFit: "cover",
  },
  imageCounter: {
    position: "absolute",
    bottom: "20px",
    right: "20px",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    color: "white",
    padding: "5px 15px",
    borderRadius: "20px",
    fontSize: "14px",
    zIndex: 10,
  },
  currentImage: {
    fontWeight: "bold",
    color: "#ff7f27",
  },
  totalImages: {
    color: "rgba(255, 255, 255, 0.7)",
  },
};

export default Carousal;