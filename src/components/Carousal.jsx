import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Ensure you import Carousel CSS
import one from "../images/one.jpg";
import two from "../images/two.jpg";
import three from "../images/three.jpeg";
import four from "../images/four.jpg";
import five from "../images/five.jpg";

const Carousal = (props) => {
  const images = [one, two, three, four, five];
    
  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <ul style={styles.navList}>
          <li>
            <a href="/profile" style={styles.navLink}>Part-A</a>
          </li>
          <li>
            <a href="/partb" style={styles.navLink}>Part-B</a>
          </li>
          <li>
            <a href="/facultyaprisaltable" style={styles.navLink}>Faculty Self Appraisal</a>
          </li>
          {props.role === 'HOD' &&   <li>
            <a href="/hodtable" style={styles.navLink}>HOD Table</a>
          </li> }

          {props.role === 'Admin' &&   <li>
            <a href="/admin" style={styles.navLink}>Admin Pannel</a>
          </li> }
          <li>
            <a href="/about" style={styles.navLink}>About</a>
          </li>
        </ul>
      </div>
      
      {/* Carousel */}
      <div style={styles.carouselContainer}>
        <Carousel
          autoPlay
          infiniteLoop
          interval={3000}
          showThumbs={false}
          showStatus={false}
          showIndicators={true}
        >
          {images.map((src, index) => (
            <div key={index} style={styles.carouselSlide}>
              <img
                src={src}
                alt={`Slide ${index + 1}`}
                style={styles.image}
              />
            </div>
          ))}
        </Carousel>
      </div>
     
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    maxWidth: "100%",
    margin: "0 auto",
    minHeight: "500px", // Adjusted height
    background: "#f4f4f4",
  },
  sidebar: {
    width: "20%",
    background: "rgb(255, 127, 39)", // Matched with your navbar
    padding: "25px 20px",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxShadow: "5px 0 10px rgba(0, 0, 0, 0.2)",
    minHeight: "500px", // Adjusted height
  },
  navList: {
    listStyleType: "none",
    padding: 0,
    width: "100%",
  },
  navLink: {
    display: "block",
    padding: "12px 20px",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "6px",
    transition: "background 0.3s ease",
    textAlign: "center",
    fontSize: "16px",
    fontWeight: "500",
    marginBottom: "10px",
    background: "rgba(255, 255, 255, 0.2)",
  },
  navLinkHover: {
    background: "rgba(255, 255, 255, 0.4)",
  },
  carouselContainer: {
    flex: 1,
    width: "80%",
    overflow: "hidden",
    minHeight: "500px", // Adjusted height
  },
  carouselSlide: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "500px", // Adjusted height
    objectFit: "cover",
    borderRadius: "10px",
    boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.2)",
  },
};

export default Carousal;
