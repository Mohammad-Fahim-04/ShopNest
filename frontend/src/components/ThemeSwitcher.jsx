import React, { useState, useEffect } from "react";
import "../styles/themeSwitcher.css";

const ThemeSwitcher = () => {
    const [currentTheme, setCurrentTheme] = useState("black");

    // Initialize theme from localStorage on mount
    useEffect(() => {
        const savedTheme = localStorage.getItem("shopnet-theme") || "black";
        setCurrentTheme(savedTheme);
        applyTheme(savedTheme);
    }, []);

    const applyTheme = (theme) => {
        // Remove all theme classes
        document.body.classList.remove("theme-black", "theme-cream", "theme-red");

        // Add new theme class
        if (theme !== "black") {
            document.body.classList.add(`theme-${theme}`);
        }

        // Save to localStorage
        localStorage.setItem("shopnet-theme", theme);
        setCurrentTheme(theme);
    };

    const themes = [
        { id: "black", name: "Black", color: "#000000" },
        { id: "cream", name: "Cream", color: "#ebe3dc" },
        { id: "red", name: "Red", color: "#ff1208" },
    ];

    return (
        <div className="theme-switcher">
            {themes.map((theme) => (
                <button
                    key={theme.id}
                    className={`theme-btn ${currentTheme === theme.id ? "active" : ""}`}
                    onClick={() => applyTheme(theme.id)}
                    title={`Switch to ${theme.name} theme`}
                    style={{ "--theme-color": theme.color }}
                >
                    <span className="theme-bg-ring" />
                    <span className="theme-circle" />
                    <span className="theme-shine" />
                    {currentTheme === theme.id && (
                        <>
                            <span className="theme-indicator" />
                            <span className="theme-glow" />
                        </>
                    )}
                </button>
            ))}
        </div>
    );
};

export default ThemeSwitcher;
