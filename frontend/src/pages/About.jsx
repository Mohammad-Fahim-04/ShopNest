import React from "react";

const About = () => {
  return (
    <main style={pageStyle}>
      <section style={topSectionStyle}>
        <span style={smallLabel}>/ ABOUT THE BRAND</span>

        <h1 style={titleStyle}>SHOPNEST</h1>

        <div style={gridStyle}>
          <div>
            <img src="/dp.jpg" alt="ShopNest Brand" style={imageStyle} />
          </div>

          <div>
            <p style={introStyle}>
              ShopNest explores minimal streetwear through silence, structure,
              oversized silhouettes, and modern editorial aesthetics.
            </p>

            <div style={contentBoxStyle}>
              <p style={paragraphStyle}>
                ShopNest is a modern editorial streetwear platform focused on
                minimal aesthetics, oversized silhouettes, monochrome palettes,
                and contemporary fashion culture.
              </p>

              <p style={paragraphStyle}>
                Inspired by luxury fashion labels, brutal typography, cinematic
                photography, and raw visual storytelling, ShopNest blends
                premium product presentation with modern digital experiences.
              </p>

              <p style={paragraphStyle}>
                Built for the new generation of creators and fashion enthusiasts,
                ShopNest represents individuality, confidence, and modern culture
                through a curated visual experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section style={bottomSectionStyle}>
        <span style={smallLabel}>/ EST. 2026</span>

        <p style={bottomTextStyle}>
          Built for modern minimal fashion culture, premium essentials, cinematic
          product presentation, and timeless monochrome styling.
        </p>
      </section>
    </main>
  );
};

const pageStyle = {
  maxWidth: "1500px",
  margin: "0 auto",
  padding: "40px 34px 80px",
  color: "#f4efe8",
};

const topSectionStyle = {
  borderBottom: "1px solid rgba(255,255,255,0.08)",
  paddingBottom: "60px",
  marginBottom: "60px",
};

const titleStyle = {
  fontSize: "clamp(4rem, 13vw, 11rem)",
  lineHeight: "0.85",
  letterSpacing: "-0.08em",
  margin: "20px 0 40px",
  textTransform: "uppercase",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "60px",
  alignItems: "start",
};

const imageStyle = {
  width: "340px",
  height: "340px",
  borderRadius: "50%",
  objectFit: "cover",
  background: "#111",
  border: "1px solid rgba(255,255,255,0.08)",
};
const introStyle = {
  color: "#f4efe8",
  fontSize: "18px",
  lineHeight: "1.8",
  marginBottom: "40px",
  maxWidth: "560px",
};

const contentBoxStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "28px",
};

const paragraphStyle = {
  color: "#8d8d8d",
  fontSize: "15px",
  lineHeight: "2",
  maxWidth: "560px",
};

const bottomSectionStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: "40px",
  flexWrap: "wrap",
};

const bottomTextStyle = {
  maxWidth: "520px",
  color: "#8d8d8d",
  lineHeight: "1.8",
  fontSize: "14px",
};

const smallLabel = {
  color: "#8d8d8d",
  fontSize: "11px",
  letterSpacing: "0.18em",
  textTransform: "uppercase",
};

export default About;