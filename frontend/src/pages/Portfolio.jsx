import React, { useEffect, useState } from 'react';
import ProjectCard from '../components/portfolio/ProjectCard';
import api from '../services/api';

const Portfolio = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get('/projects/');

        // ✅ Ensure array
        const data = Array.isArray(res.data) ? res.data : [];

        setProjects(data);
      } catch (err) {
        console.error('❌ Failed to load projects', err);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center' }}>
        Loading projects...
      </div>
    );
  }

  if (!projects.length) {
    return (
      <div style={{ padding: '60px', textAlign: 'center' }}>
        No projects found.
      </div>
    );
  }

  return (
    <div className="portfolio-page">
      <section className="portfolio-hero">
        <h1>Our Portfolio</h1>
        <p>Real projects loaded from backend</p>
      </section>

      <section className="portfolio-projects-section">
        <div className="portfolio-projects-grid">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Portfolio;
