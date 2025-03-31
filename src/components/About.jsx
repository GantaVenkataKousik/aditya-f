import React, { useEffect } from 'react';
import Logo from '../images/aboutlogo.jpg';
import { FaSchool, FaGraduationCap, FaUsers, FaBuilding, FaLink, FaTrophy, FaChalkboardTeacher, FaGlobe } from 'react-icons/fa';
import { BiSolidQuoteLeft, BiSolidQuoteRight } from 'react-icons/bi';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../index.css';

const About = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-in-out'
    });
  }, []);

  // Function to handle counter animation on scroll
  const handleCounterAnimation = () => {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'));
      const speed = parseInt(counter.getAttribute('data-speed'));
      const count = parseInt(counter.innerText);

      const inc = target / speed;

      if (count < target) {
        counter.innerText = Math.ceil(count + inc);
        setTimeout(() => handleCounterAnimation(), 50);
      } else {
        counter.innerText = target;
      }
    });
  };

  // Initialize counters when they become visible
  React.useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target.classList.contains('stats-container')) {
            const counters = entry.target.querySelectorAll('.stat-number');
            counters.forEach(counter => {
              counter.innerText = '0';
            });
            handleCounterAnimation();
          }
          entry.target.classList.add('show');
        }
      });
    }, { threshold: 0.3 });

    document.querySelectorAll('.animate-on-scroll').forEach(elem => {
      observer.observe(elem);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="about-page">
      {/* Hero Section */}
      <div className="about-hero" data-aos="fade-down">
        <div className="overlay"></div>
        <img src={Logo} alt="Aditya College" className="hero-image" />
        <div className="hero-content">
          <h1 style={{ color: 'white' }}>About Aditya University</h1>
          <p style={{ color: 'white' }}>Shaping futures through excellence in education since 1984</p>
        </div>
      </div>

      {/* Introduction Section */}
      <section className="about-section" data-aos="fade-up">
        <div className="container">
          <div className="section-header animate-on-scroll">
            <FaSchool className="section-icon" />
            <h2>Our Legacy</h2>
            <div className="divider"></div>
          </div>

          <div className="quote-container animate-on-scroll">
            <BiSolidQuoteLeft className="quote-mark left" />
            <p className="quote-text">Creating a platform for holistic growth and success to students at all levels</p>
            <BiSolidQuoteRight className="quote-mark right" />
          </div>

          <div className="about-content animate-on-scroll">
            <p>
              Aditya, the premier promoter of quality education in the coastal districts of Andhra Pradesh for the past two decades, leads various institutions ranging from K.G to P.G besides professional colleges like Engineering, Pharmacy and Nursing. Sri Nallamilli Seshareddy as a founder chairman, promoted the educational society in the name and style of Aditya Academy at Kakinada in the year 1984, with a vision and mission to create a platform for holistic growth and success to students at all levels.
            </p>
            <p>
              Aditya has made its entry into the educational arena with a public school to meet the needs of primary and secondary education. In succession and with rapid strides, the academy established a number of Junior Colleges, Degree Colleges, PG Colleges, Engineering Colleges, Pharmacy Colleges, Nursing Colleges, Teacher Training Institutions.
            </p>

            <div className="stats-container animate-on-scroll">
              <div className="stat-item">
                <div className="stat-number" data-target="50000" data-speed="100">0</div>
                <div className="stat-label">Students</div>
              </div>
              <div className="stat-item">
                <div className="stat-number" data-target="50" data-speed="20">0+</div>
                <div className="stat-label">Institutions</div>
              </div>
              <div className="stat-item">
                <div className="stat-number" data-target="5000" data-speed="80">0+</div>
                <div className="stat-label">Staff</div>
              </div>
              <div className="stat-item">
                <div className="stat-number" data-target="3" data-speed="5">0+</div>
                <div className="stat-label">Districts</div>
              </div>
            </div>

            <p>
              The silver-jubilee educational group with 50,000+ students in 50+ institutions with 5000+ staff across three districts in Andhra Pradesh has become the standard bearer for quality education. In every stream, Aditya has become a spring-board for success through its powered vision, constant innovation and professional excellence.
            </p>
          </div>
        </div>
      </section>

      {/* Founder's Vision - New Section */}
      <section className="about-section alternate">
        <div className="container">
          <div className="section-header animate-on-scroll">
            <FaChalkboardTeacher className="section-icon" />
            <h2>Founder's Vision</h2>
            <div className="divider"></div>
          </div>

          <div className="founder-section animate-on-scroll">
            <div className="founder-image">
              {/* Placeholder for founder image */}
              <div className="image-placeholder">
                <FaUsers size={60} color="#ccc" />
              </div>
            </div>
            <div className="founder-content">
              <h3>Sri Nallamilli Seshareddy</h3>
              <p className="founder-title">Founder Chairman</p>
              <p>
                "Our vision at Aditya University is to cultivate an environment where education transcends
                conventional learning. We aspire to shape individuals who not only excel in their chosen
                fields but also contribute meaningfully to society. Through innovation, integrity, and
                inclusivity, we aim to inspire a generation of lifelong learners who are equipped to
                address global challenges with compassion and creativity."
              </p>
              <p>
                The educational philosophy at Aditya has always been centered on providing comprehensive
                growth opportunities for students. By combining rigorous academic training with practical
                exposure and character development, we prepare our students to navigate the complexities
                of the modern world with confidence and purpose.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Engineering College Section */}
      <section className="about-section alternate" data-aos="fade-up">
        <div className="container">
          <div className="section-header animate-on-scroll">
            <FaGraduationCap className="section-icon" />
            <h2>Aditya Engineering College</h2>
            <div className="divider"></div>
          </div>

          <div className="about-content animate-on-scroll">
            <div className="timeline animate-on-scroll">
              <div className="timeline-item">
                <div className="timeline-marker">2001</div>
                <div className="timeline-content">
                  <h3>Establishment</h3>
                  <p>Established with AICTE approval and JNTU affiliation with an intake of 180 in three UG Courses</p>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-marker">2010</div>
                <div className="timeline-content">
                  <h3>Expansion</h3>
                  <p>Expanded offerings to include multiple engineering disciplines and post-graduate programs</p>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-marker">2015</div>
                <div className="timeline-content">
                  <h3>Recognition</h3>
                  <p>Received NAAC A++ accreditation and recognized as one of South India's top engineering colleges</p>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-marker">Today</div>
                <div className="timeline-content">
                  <h3>Growth</h3>
                  <p>11 UG and 10 PG programmes in engineering, MCA, MBA and MBA (Integrated) with decades of rich standing</p>
                </div>
              </div>
            </div>

            <div className="college-description animate-on-scroll">
              <div className="college-image">
                {/* Placeholder for college image */}
                <div className="image-placeholder">
                  <FaBuilding size={60} color="#ccc" />
                </div>
              </div>
              <div className="college-text">
                <p>
                  Aditya Engineering College was established in the academic year 2001-02 under the aegis of Aditya Academy, Kakinada with the approval of AICTE and Affiliated to JNTU with an intake of 180 in three UG Courses in Engineering & Technology.
                </p>
                <p>
                  The College is situated in an eco-friendly area of 180 acres with thick greenery at Surampalem, Gandepalli Mandal, East Godavari District, Andhra Pradesh. The College is 15 KM away from Samalkot Railway Station on Howrah-Chennai Railway line in South Central Railway. The College is 35 Km away from Kakinada and Rajahmundry on ADB Road.
                </p>
                <p>
                  The College has four academic Buildings with a total carpet area of 35,425 Sq. Mts. apart from two boys hostels and one girls hostel buildings.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Campus Buildings Section */}
      <section className="about-section" data-aos="fade-up">
        <div className="container">
          <div className="section-header animate-on-scroll">
            <FaBuilding className="section-icon" />
            <h2>Campus Infrastructure</h2>
            <div className="divider"></div>
          </div>

          <div className="buildings-grid">
            <div className="building-card animate-on-scroll">
              <div className="building-header">
                <h3>Cotton Bhavan</h3>
              </div>
              <div className="building-content">
                <p>Administrative Office, Examination Cell, Accounts, Admission Office, ECE</p>
              </div>
            </div>

            <div className="building-card animate-on-scroll">
              <div className="building-header">
                <h3>K. L. Rao Bhavan</h3>
              </div>
              <div className="building-content">
                <p>Mechanical, Electrical, Petroleum Technology, Mining Engineering</p>
              </div>
            </div>

            <div className="building-card animate-on-scroll">
              <div className="building-header">
                <h3>Bill Gates Bhavan</h3>
              </div>
              <div className="building-content">
                <p>CSE, IT, H&BS, Civil, Agricultural Engineering</p>
              </div>
            </div>

            <div className="building-card animate-on-scroll">
              <div className="building-header">
                <h3>Abdul Kalam Bhavan</h3>
              </div>
              <div className="building-content">
                <p>Polytechnic Courses</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Academic Programs - New Section */}
      <section className="about-section">
        <div className="container">
          <div className="section-header animate-on-scroll">
            <FaGlobe className="section-icon" />
            <h2>Academic Programs</h2>
            <div className="divider"></div>
          </div>

          <div className="programs-container animate-on-scroll">
            <div className="program-category">
              <h3>Undergraduate Programs</h3>
              <ul className="program-list">
                <li>Computer Science Engineering</li>
                <li>Electrical and Electronics Engineering</li>
                <li>Mechanical Engineering</li>
                <li>Civil Engineering</li>
                <li>Electronics and Communication Engineering</li>
                <li>Computer Science and Engineering</li>
                <li>Information Technology</li>
                <li>Agricultural Engineering</li>
                <li>Mining Engineering</li>
                <li>Petroleum Technology</li>
              </ul>
            </div>

            <div className="program-category">
              <h3>Postgraduate Programs</h3>
              <ul className="program-list">
                <li>M.Tech - Structural Engineering</li>
                <li>M.Tech - Power Electronics & Drives</li>
                <li>M.Tech - Thermal Engineering</li>
                <li>M.Tech - VLSI Design</li>
                <li>M.Tech - Computer Science & Engineering</li>
                <li>MBA - Master of Business Administration</li>
                <li>MBA (Integrated)</li>
                <li>MCA - Master of Computer Applications</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Accolades Section */}
      <section className="about-section alternate" data-aos="fade-up">
        <div className="container">
          <div className="section-header animate-on-scroll">
            <FaTrophy className="section-icon" />
            <h2>Achievements & Recognition</h2>
            <div className="divider"></div>
          </div>

          <div className="accolades-container">
            <div className="accolade-item animate-on-scroll">
              <div className="accolade-badge">AA+</div>
              <p>Grade by Careers 360</p>
            </div>

            <div className="accolade-item animate-on-scroll">
              <div className="accolade-badge">4th</div>
              <p>Rank in South India by Digital Mailers</p>
            </div>

            <div className="accolade-item animate-on-scroll">
              <div className="accolade-badge">6th</div>
              <p>Rank in South India by Silicon India</p>
            </div>

            <div className="accolade-item animate-on-scroll">
              <div className="accolade-badge">A++</div>
              <p>Grade by NAAC</p>
            </div>
          </div>

          <div className="about-content animate-on-scroll">
            <p>
              The college proudly offers 11 UG and 10 PG programmes in engineering, MCA, MBA and MBA (Integrated) with 15 years of rich standing in the educational era. Besides, the college has added many feathers in its cap which include AA+ Grade by Careers 360, South India 4th rank by Digital Mailers, South India 6th rank by Silicon India, 13th rank out of top 25 engineering colleges by 4Ps, a niche in Asia top 100 colleges by WCRC leaders, Best Placement Award by ASSOCHAM, All India 98th rank-DQ CMR top T-School survey by DATA Quest and 13th position in Top 20 colleges of India by the Sunday Indian.
            </p>
            <p>
              These distinct recognitions speak volumes of the institute's objective to promote engineering excellence. The total student strength is 5052 with faculty strength of 355 thus giving rise to healthy faculty student ratio.
            </p>
            <p>
              It is approved by AICTE, recognized by Govt. of Andhra Pradesh, permanently affiliated to Jawaharlal Nehru Technological University Kakinada (JNTUK) and is accredited by National Assessment And Accreditation Council (NAAC) with 'A++' Grade. The college also received UGC recognition under Sections 2(f) and 12 (B) of the UGC Act.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="about-section" data-aos="fade-up">
        <div className="container">
          <div className="section-header animate-on-scroll">
            <FaLink className="section-icon" />
            <h2>Quick Links</h2>
            <div className="divider"></div>
          </div>

          <div className="quick-links-container">
            <a href="#about" className="quick-link-item animate-on-scroll">
              About College
            </a>
            <a href="#vision" className="quick-link-item animate-on-scroll">
              Vision & Mission
            </a>
            <a href="#chairman" className="quick-link-item animate-on-scroll">
              Chairman's Message
            </a>
            <a href="#vice-chairman" className="quick-link-item animate-on-scroll">
              Vice-Chairman's Message
            </a>
            <a href="#secretary" className="quick-link-item animate-on-scroll">
              Secretary's Message
            </a>
          </div>
        </div>
      </section>

      <style jsx>{`
        .about-page {
          font-family: 'Poppins', sans-serif;
          color: #333;
          overflow-x: hidden;
        }

        .about-hero {
          position: relative;
          height: 300px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 40px;
        }

        .hero-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          position: absolute;
          top: 0;
          left: 0;
          z-index: 1;
        }

        .overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7));
          z-index: 2;
        }

        .hero-content {
          position: relative;
          z-index: 3;
          text-align: center;
          color: white;
          padding: 0 20px;
        }

        .hero-content h1 {
          font-size: 42px;
          font-weight: 700;
          margin-bottom: 10px;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        }

        .hero-content p {
          font-size: 18px;
          font-weight: 300;
          max-width: 600px;
          margin: 0 auto;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .about-section {
          padding: 60px 0;
          position: relative;
        }

        .about-section.alternate {
          background-color: #f8f9fa;
        }

        .section-header {
          text-align: center;
          margin-bottom: 40px;
          position: relative;
        }

        .section-icon {
          font-size: 36px;
          color: #ff6600;
          margin-bottom: 10px;
        }

        .section-header h2 {
          font-size: 32px;
          font-weight: 600;
          color: #333;
          margin: 0 0 15px;
          position: relative;
          display: inline-block;
        }

        .divider {
          height: 4px;
          width: 80px;
          background: linear-gradient(to right, #ff6600, #0066cc);
          margin: 0 auto;
          border-radius: 2px;
        }

        .about-content {
          font-size: 16px;
          line-height: 1.8;
          color: #555;
          text-align: justify;
        }

        .about-content p {
          margin-bottom: 20px;
        }

        .quote-container {
          background-color: #fff;
          border-left: 5px solid #ff6600;
          padding: 20px 30px;
          margin: 30px 0;
          border-radius: 8px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
          position: relative;
        }

        .quote-mark {
          color: #ddd;
          font-size: 30px;
        }

        .quote-mark.left {
          position: absolute;
          top: 10px;
          left: 10px;
        }

        .quote-mark.right {
          position: absolute;
          bottom: 10px;
          right: 10px;
        }

        .quote-text {
          font-size: 20px;
          font-style: italic;
          text-align: center;
          color: #555;
          margin: 0;
          padding: 10px 30px;
        }

        .stats-container {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          margin: 40px 0;
        }

        .stat-item {
          flex: 1;
          text-align: center;
          padding: 20px;
          min-width: 150px;
          margin: 10px;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .stat-item:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }

        .stat-number {
          font-size: 36px;
          font-weight: 700;
          color: #ff6600;
          margin-bottom: 5px;
        }

        .stat-label {
          font-size: 16px;
          color: #555;
        }

        .timeline {
          position: relative;
          max-width: 800px;
          margin: 0 auto 40px;
        }

        .timeline::before {
          content: '';
          position: absolute;
          width: 4px;
          background-color: #0066cc;
          top: 0;
          bottom: 0;
          left: 50px;
          margin-left: -2px;
          border-radius: 2px;
        }

        .timeline-item {
          padding: 10px 40px 10px 80px;
          position: relative;
          margin-bottom: 30px;
        }

        .timeline-marker {
          position: absolute;
          width: 40px;
          height: 40px;
          left: 50px;
          margin-left: -20px;
          background-color: #ff6600;
          border: 4px solid #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          z-index: 1;
          box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
        }

        .timeline-content {
          background-color: #fff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
        }

        .timeline-content h3 {
          color: #0066cc;
          margin-top: 0;
          margin-bottom: 10px;
        }

        .timeline-content p {
          margin: 0;
        }

        .buildings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
          margin: 30px 0;
        }

        .building-card {
          background: #fff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .building-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }

        .building-header {
          background: linear-gradient(135deg, #0066cc, #004d99);
          color: white;
          padding: 15px;
          text-align: center;
        }

        .building-header h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
        }

        .building-content {
          padding: 20px;
        }

        .building-content p {
          margin: 0;
          color: #555;
        }

        .accolades-container {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 20px;
          margin: 30px 0;
        }

        .accolade-item {
          text-align: center;
          width: 200px;
          padding: 20px;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .accolade-item:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }

        .accolade-badge {
          width: 70px;
          height: 70px;
          line-height: 70px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ff6600, #ff8533);
          color: white;
          font-size: 22px;
          font-weight: 700;
          margin: 0 auto 15px;
          position: relative;
          overflow: hidden;
        }

        .accolade-badge::before {
          content: '';
          position: absolute;
          top: -10px;
          left: -10px;
          right: -10px;
          bottom: -10px;
          background: inherit;
          filter: blur(10px) brightness(1.2);
          opacity: 0.7;
          z-index: -1;
        }

        .accolade-item p {
          color: #555;
          margin: 0;
        }

        .quick-links-container {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 15px;
          margin: 20px 0;
        }

        .quick-link-item {
          background: linear-gradient(135deg, #0066cc, #004d99);
          color: white;
          padding: 15px 25px;
          border-radius: 30px;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.3s ease;
          box-shadow: 0 4px 10px rgba(0, 102, 204, 0.2);
        }

        .quick-link-item:hover {
          background: linear-gradient(135deg, #ff6600, #ff8533);
          transform: translateY(-3px);
          box-shadow: 0 6px 15px rgba(255, 102, 0, 0.3);
        }

        .founder-section {
          display: flex;
          flex-wrap: wrap;
          gap: 30px;
          margin: 30px 0;
        }

        .founder-image {
          flex: 1;
          min-width: 250px;
        }

        .founder-content {
          flex: 2;
          min-width: 300px;
        }

        .founder-content h3 {
          color: #1a4b88;
          font-size: 24px;
          margin-bottom: 5px;
        }

        .founder-title {
          color: #ff6600;
          font-weight: 500;
          margin-bottom: 20px;
        }

        .image-placeholder {
          background-color: #eee;
          height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          overflow: hidden;
        }

        .programs-container {
          display: flex;
          flex-wrap: wrap;
          gap: 30px;
          margin: 30px 0;
        }

        .program-category {
          flex: 1;
          min-width: 300px;
          background: #fff;
          padding: 25px;
          border-radius: 8px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
        }

        .program-category h3 {
          color: #1a4b88;
          border-bottom: 2px solid #ff6600;
          padding-bottom: 10px;
          margin-bottom: 20px;
        }

        .program-list {
          list-style-type: none;
          padding: 0;
          margin: 0;
        }

        .program-list li {
          padding: 8px 0;
          border-bottom: 1px solid #eee;
          position: relative;
          padding-left: 20px;
        }

        .program-list li:before {
          content: "▸";
          color: #ff6600;
          position: absolute;
          left: 0;
        }

        .program-list li:last-child {
          border-bottom: none;
        }

        @media (max-width: 768px) {
          .hero-content h1 {
            font-size: 32px;
          }
          
          .hero-content p {
            font-size: 16px;
          }
          
          .section-header h2 {
            font-size: 28px;
          }
          
          .stats-container {
            flex-direction: column;
          }
          
          .stat-item {
            margin: 10px 0;
          }
          
          .timeline::before {
            left: 30px;
          }
          
          .timeline-item {
            padding-left: 60px;
          }
          
          .timeline-marker {
            left: 30px;
          }
          
          .buildings-grid {
            grid-template-columns: 1fr;
          }
          
          .accolades-container {
            flex-direction: column;
            align-items: center;
          }
          
          .accolade-item {
            width: 100%;
            max-width: 250px;
          }
        }
      `}</style>
    </div>
  );
};

export default About;
