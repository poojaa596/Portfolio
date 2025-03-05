document.addEventListener("DOMContentLoaded", function () {
    // Smooth scrolling for navigation
    document.querySelectorAll("nav ul li a").forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            const targetId = this.getAttribute("href").substring(1);
            document.getElementById(targetId).scrollIntoView({ behavior: "smooth" });
        });
    });

    // Active section highlighting in navbar
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll("nav ul li a");

    window.addEventListener("scroll", () => {
        let current = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (pageYOffset >= sectionTop) {
                current = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href").substring(1) === current) {
                link.classList.add("active");
            }
        });
    });

    // Theme toggle functionality
    const themeToggle = document.createElement("button");
    themeToggle.innerText = "🌞";
    themeToggle.style.position = "fixed";
    themeToggle.style.top = "10px";
    themeToggle.style.right = "10px";
    themeToggle.style.padding = "10px 15px";
    themeToggle.style.border = "none";
    themeToggle.style.cursor = "pointer";
    themeToggle.style.zIndex = "1000";
    themeToggle.style.fontSize = "20px";
    
    document.body.appendChild(themeToggle);

    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("light-theme");
        adjustThemeColors();
        themeToggle.innerText = document.body.classList.contains("light-theme") ? "🌙" : "🌞";
    });

    function adjustThemeColors() {
        if (document.body.classList.contains("light-theme")) {
            document.body.style.backgroundColor = "#FFFFFF";
            document.body.style.color = "#000000";
            document.querySelectorAll(".section, .project, .experience-list li").forEach(el => {
                el.style.backgroundColor = "#f5f5f5";
                el.style.color = "#000000";
            });
            document.querySelectorAll("h1, h2, h3").forEach(el => {
                el.style.color = "#333333";
            });
            document.querySelectorAll("nav ul li a").forEach(el => {
                el.style.color = "#000000";
            });
        } else {
            document.body.style.backgroundColor = "#000000";
            document.body.style.color = "#F0F0F0";
            document.querySelectorAll(".section, .project, .experience-list li").forEach(el => {
                el.style.backgroundColor = "#1F1F1F";
                el.style.color = "#F0F0F0";
            });
            document.querySelectorAll("h1, h2, h3").forEach(el => {
                el.style.color = "#F0F0F0";
            });
            document.querySelectorAll("nav ul li a").forEach(el => {
                el.style.color = "#F0F0F0";
            });
        }
    }

    // Hover effects on skills
    document.querySelectorAll(".skills-container li").forEach(skill => {
        skill.addEventListener("mouseover", () => {
            skill.style.transform = "scale(1.1)";
            skill.style.transition = "transform 0.3s ease";
        });
        skill.addEventListener("mouseout", () => {
            skill.style.transform = "scale(1)";
        });
    });

    // Alert when clicking contact links
    document.querySelectorAll("#contact a").forEach(link => {
        link.addEventListener("click", function (e) {
            alert("You are about to visit: " + this.href);
        });
    });

    // Add download resume button in About Me section
    const aboutMeSection = document.getElementById("about");
    const downloadButton = document.createElement("a");
    downloadButton.innerText = "View Resume";
    downloadButton.href = "https://drive.google.com/file/d/1E0taA4J-Mxs5z1NI7JrtUESkSHKA8mXS/view?usp=sharing"; 
    downloadButton.download = "Pooja_Resume.pdf";
    downloadButton.style.display = "block";
    downloadButton.style.marginTop = "10px";
    downloadButton.style.padding = "10px 15px";
    downloadButton.style.backgroundColor = "#1F1F1F";
    downloadButton.style.color = "white";
    downloadButton.style.textAlign = "center";
    downloadButton.style.borderRadius = "5px";
    downloadButton.style.textDecoration = "none";
    
    aboutMeSection.appendChild(downloadButton);
});
