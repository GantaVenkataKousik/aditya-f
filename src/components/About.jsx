import React from 'react';
import Logo from '../images/aboutlogo.jpg';

const About = () => {
  return (
    <div
      style={{
        backgroundColor: '#f8f8f8',
        padding: '0px 0',
        textAlign: 'center',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      {/* Image Section */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <img
          src={Logo}
          alt="College Logo"
          style={{
            width: '1200px',
            height: '150px',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          }}
        />
      </div>

      {/* Header Section */}
      <div
        style={{
          backgroundColor: '#ff6600',
          color: '#fff',
          padding: '15px 0',
          borderBottom: '5px solid #0066cc',
        }}
      >
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0' }}>
          About Our College
        </h1>
      </div>

      {/* Content Section */}
      <div style={{ maxWidth: '1200px', margin: '20px auto', textAlign: 'left' }}>
        <h2
          style={{
            fontSize: '22px',
            color: '#ff6600',
            margin: '20px 0',
            borderBottom: '2px solid #0066cc',
            paddingBottom: '5px',
          }}
        >
          Aditya Academy
        </h2>
        <p
          style={{
            fontSize: '16px',
            color: '#333',
            lineHeight: '1.8',
            textAlign: 'justify',
            marginBottom: '20px',
          }}
        >
          Aditya, the premier promoter of quality education in the coastal districts of Andhra Pradesh for the past two decades, leads various institutions ranging from K.G to P.G besides professional colleges like Engineering, Pharmacy and Nursing. Sri Nallamilli Seshareddy as a founder chairman, promoted the educational society in the name and style of Aditya Academy at Kakinada in the year 1984, with a vision and mission to create a platform for holistic growth and success to students at all levels.

Aditya has made its entry into the educational arena with a public school to meet the needs of primary and secondary education. In succession and with rapid strides, the academy established a number of Junior Colleges, Degree Colleges, PG Colleges, Engineering Colleges, Pharmacy Colleges, Nursing Colleges, Teacher Training Institutions.

The silver-jubilee educational group with 50,000+ students in 50+ institutions with 5000+ staff across three districts in Andhra Pradesh has become the standard bearer for quality education. In every stream, Aditya has become a spring-board for success through its powered vision, constant innovation and professional excellence
        </p>
        </div>

      <div style={{ maxWidth: '1200px', margin: '20px auto', textAlign: 'left' }}>
        <h2
          style={{
            fontSize: '22px',
            color: '#ff6600',
            margin: '20px 0',
            borderBottom: '2px solid #0066cc',
            paddingBottom: '5px',
          }}
        >
          Aditya Engineering College 
        </h2>
        <p
          style={{
            fontSize: '16px',
            color: '#333',
            lineHeight: '1.8',
            textAlign: 'justify',
            marginBottom: '20px',
          }}
        >
          Aditya Engineering College was established in the academic year 2001-02 under the aegis of Aditya Academy, Kakinada with the approval of AICTE and Affiliated to JNTU with an intake of 180 in three UG Courses in Engineering & Technology.

The College is situated in an eco-friendly area of 180 acres with thick greenery at Surampalem, Gandepalli Mandal, East Godavari District, Andhra Pradesh. The College is 15 KM away from Samalkot Railway Station on Howrah-Chennai Railway line in South Central Railway. The College is 35 Km away from Kakinada and Rajahmundry on ADB Road.

The College has four academic Buildings with a total carpet area of 35,425 Sq. Mts. apart from two boys hostels and one girls hostel buildings. The particulars of academic buildings and the departments / offices accommodated are as follows.
        </p>

        {/* Table Section */}
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            marginBottom: '20px',
            border: '1px solid #ccc',
          }}
        >
          <thead>
            <tr style={{ backgroundColor: '#ff6600', color: '#fff' }}>
              <th style={{ padding: '10px', border: '1px solid #ccc' }}>S.No</th>
              <th style={{ padding: '10px', border: '1px solid #ccc' }}>Building Name</th>
              <th style={{ padding: '10px', border: '1px solid #ccc' }}>
                Department/Office
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>1</td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>Cotton Bhavan</td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                Administrative Office, Examination Cell, Accounts, Admission Office, ECE
              </td>
            </tr>
            <tr>
              <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>2</td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>K. L. Rao Bhavan</td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                Mechanical, Electrical, Petroleum Technology, Mining Engineering
              </td>
            </tr>
            <tr>
              <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>3</td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>Bill Gates Bhavan</td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                CSE, IT, H&BS, Civil, Agricultural Engineering
              </td>
            </tr>
            <tr>
              <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>4</td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>Abdul Kalam Bhavan</td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>Polytechnic Courses</td>
            </tr>
          </tbody>
        </table>
        <p
         style={{
          fontSize: '16px',
          color: '#333',
          lineHeight: '1.8',
          textAlign: 'justify',
          marginBottom: '20px',
        }}>
            The college proudly offers 11 UG and 10 PG programmes in engineering, MCA, MBA and MBA (Integrated) with 15 years of rich standing in the educational era. Besides, the college has added many feathers in its cap which include AA+ Grade by Careers 360, South India 4th rank by Digital Mailers, South India 6th rank by Silicon India, 13th rank out of top 25 engineering colleges by 4Ps, a niche in Asia top 100 colleges by WCRC leaders, Best Placement Award by ASSOCHAM, All India 98th rank-DQ CMR top T-School survey by DATA Quest and 13th position in Top 20 colleges of India by the Sunday Indian. These distinct recognitions speak volumes of the institute’s objective to promote engineering excellence. The total student strength is 5052 with faculty strength of 355 thus giving rise to healthy faculty student ratio.

It is approved by AICTE, recognized by Govt. of Andhra Pradesh, permanently affiliated to Jawaharlal Nehru Technological University Kakinada (JNTUK) and is accredited by National Assessment And Accreditation Council (NAAC) with ‘A++’ Grade. The college also received UGC recognition under Sections 2(f) and 12 (B) of the UGC Act.
        </p>

        {/* Quick Links Section */}
        <div
          style={{
            marginTop: '20px',
            backgroundColor: '#0066cc',
            color: '#fff',
            padding: '15px',
            borderRadius: '8px',
            textAlign: 'center',
          }}
        >
          <h3 style={{ margin: '0 0 10px' }}>Quick Links</h3>
          <ul
            style={{
              listStyle: 'none',
              padding: '0',
              margin: '0',
              lineHeight: '1.8',
              fontSize: '14px',
            }}
          >
            <li>
              <a
                href="#about"
                style={{
                  color: '#fff',
                  textDecoration: 'none',
                }}
              >
                About College
              </a>
            </li>
            <li>
              <a
                href="#vision"
                style={{
                  color: '#fff',
                  textDecoration: 'none',
                }}
              >
                Vision & Mission
              </a>
            </li>
            <li>
              <a
                href="#chairman"
                style={{
                  color: '#fff',
                  textDecoration: 'none',
                }}
              >
                Chairman's Message
              </a>
            </li>
            <li>
              <a
                href="#vice-chairman"
                style={{
                  color: '#fff',
                  textDecoration: 'none',
                }}
              >
                Vice-Chairman's Message
              </a>
            </li>
            <li>
              <a
                href="#secretary"
                style={{
                  color: '#fff',
                  textDecoration: 'none',
                }}
              >
                Secretary's Message
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;
