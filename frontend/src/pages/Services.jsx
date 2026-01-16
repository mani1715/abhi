import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Code, ShoppingCart, Layers, Palette, Sparkles,
  CheckCircle, Zap, Award, Smartphone, Code2, Search, Shield,
  FileSearch, CheckCircle2, Rocket, HeartHandshake
} from 'lucide-react';
import { detailedServices, whyChooseUs, processSteps } from '../data/mock';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { trackPageView } from '../services/analytics';
import FeelingsServicesSection from '../components/FeelingsServicesSection';
import './pages.css';
import './Services.css';

const Services = () => {
  useEffect(() => {
    // Track page view
    trackPageView('services');
  }, []);

  // Icon mapping for services
  const serviceIconMap = {
    Code: Code,
    ShoppingCart: ShoppingCart,
    Layers: Layers,
    Palette: Palette,
    Sparkles: Sparkles
  };

  // Icon mapping for why choose us
  const whyIconMap = {
    Zap: Zap,
    Award: Award,
    Smartphone: Smartphone,
    Code2: Code2,
    Search: Search,
    Shield: Shield
  };

  // Icon mapping for process steps
  const processIconMap = {
    FileSearch: FileSearch,
    Palette: Palette,
    Code: Code,
    CheckCircle2: CheckCircle2,
    Rocket: Rocket,
    HeartHandshake: HeartHandshake
  };

  return (
    <div className="services-page-premium">
      {/* SERVICES HERO SECTION - COLORFUL DESIGN */}
      <section className="services-hero-colorful" data-admin-editable="services-hero">
        <div className="services-hero-background-colorful">
          <div className="floral-decoration floral-left">
            <svg viewBox="0 0 200 200" className="floral-svg">
              <circle cx="100" cy="100" r="40" fill="#E8B4C8" opacity="0.3" />
              <circle cx="120" cy="80" r="30" fill="#D4869C" opacity="0.4" />
              <circle cx="80" cy="80" r="30" fill="#D4869C" opacity="0.4" />
            </svg>
          </div>
          <div className="floral-decoration floral-right">
            <svg viewBox="0 0 200 200" className="floral-svg">
              <circle cx="100" cy="100" r="40" fill="#E8B4C8" opacity="0.3" />
              <circle cx="120" cy="120" r="30" fill="#D4869C" opacity="0.4" />
              <circle cx="80" cy="120" r="30" fill="#D4869C" opacity="0.4" />
            </svg>
          </div>
        </div>
        <div className="services-hero-container-colorful">
          <div className="services-hero-badge-colorful" data-admin-editable="services-badge">
            <Sparkles className="badge-icon" />
            <span>What We Offer</span>
          </div>
          <h2 style={{
            fontSize: '32px',
            fontWeight: '600',
            background: 'linear-gradient(135deg, #D4AF37 0%, #7C5CFF 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '16px',
            textAlign: 'center'
          }} data-admin-editable="services-tagline">
            We build feelings not websites
          </h2>
          <h1 className="services-hero-title-colorful" data-admin-editable="services-title">
            Our Services
          </h1>
          <p className="services-hero-description-colorful" data-admin-editable="services-description">
            Comprehensive web solutions tailored to elevate your digital presence and drive business growth.
          </p>
        </div>
      </section>

      {/* DETAILED SERVICES GRID SECTION */}
      <section className="detailed-services-section" data-admin-editable="detailed-services">
        <div className="section-container-premium">
          <div className="detailed-services-grid">
            {detailedServices.map((service, index) => {
              const IconComponent = serviceIconMap[service.icon] || Code;
              return (
                <Card 
                  key={service.id} 
                  className="detailed-service-card"
                  data-admin-editable={`service-${service.id}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Service Image (if available) */}
                  {service.image && (
                    <div className="service-image-wrapper" style={{
                      width: '100%',
                      height: '200px',
                      overflow: 'hidden',
                      borderRadius: '12px 12px 0 0',
                      marginBottom: '20px'
                    }}>
                      <img 
                        src={service.image} 
                        alt={service.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </div>
                  )}
                  
                  <div className="service-card-header-detailed">
                    <div className="service-icon-detailed">
                      <IconComponent className="h-10 w-10" />
                    </div>
                  </div>
                  
                  <h3 className="service-title-detailed" data-admin-editable={`service-title-${service.id}`}>
                    {service.title}
                  </h3>
                  
                  <p className="service-description-detailed" data-admin-editable={`service-desc-${service.id}`}>
                    {service.description}
                  </p>
                  
                  <div className="service-features-detailed">
                    <h4 className="features-heading">Key Features:</h4>
                    <ul className="service-features-list-detailed">
                      {service.features.map((feature, idx) => (
                        <li 
                          key={idx} 
                          className="service-feature-item-detailed"
                          data-admin-editable={`service-feature-${service.id}-${idx}`}
                        >
                          <CheckCircle className="feature-check-detailed" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Price Display */}
                  {service.price && (
                    <div style={{
                      marginTop: '20px',
                      padding: '12px',
                      background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
                      borderRadius: '8px',
                      textAlign: 'center'
                    }}>
                      <p style={{
                        color: '#FFFFFF',
                        fontWeight: '700',
                        fontSize: '18px',
                        margin: 0
                      }}>
                        {service.price}
                      </p>
                    </div>
                  )}
                  
                  {/* Demo Link */}
                  {service.demoLink && (
                    <a 
                      href={service.demoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'block',
                        marginTop: '16px',
                        padding: '12px',
                        background: 'linear-gradient(135deg, #60A5FA 0%, #8B5CF6 100%)',
                        borderRadius: '8px',
                        textAlign: 'center',
                        color: '#FFFFFF',
                        fontWeight: '600',
                        textDecoration: 'none',
                        transition: 'transform 0.3s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      View Live Demo →
                    </a>
                  )}
                  
                  <div className="service-card-gradient-detailed"></div>
                  <div className="service-card-glow"></div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US SECTION */}
      <section className="why-choose-us-section" data-admin-editable="why-choose-us">
        <div className="section-container-premium">
          <div className="section-header-premium">
            <div className="section-badge" data-admin-editable="why-badge">
              Why Choose Us
            </div>
            <h2 className="section-title-premium" data-admin-editable="why-title">
              What Makes Us Different
            </h2>
            <p className="section-description-premium" data-admin-editable="why-description">
              The advantages that set us apart in delivering exceptional web solutions
            </p>
          </div>

          <div className="why-choose-grid">
            {whyChooseUs.map((item, index) => {
              const IconComponent = whyIconMap[item.icon] || Award;
              return (
                <Card 
                  key={item.id} 
                  className="why-choose-card"
                  data-admin-editable={`why-${item.id}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="why-icon-wrapper">
                    <div className="why-icon">
                      <IconComponent className="h-7 w-7" />
                    </div>
                  </div>
                  
                  <h3 className="why-title" data-admin-editable={`why-title-${item.id}`}>
                    {item.title}
                  </h3>
                  
                  <p className="why-description" data-admin-editable={`why-desc-${item.id}`}>
                    {item.description}
                  </p>
                  
                  <div className="why-card-border"></div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* PROCESS / WORKFLOW SECTION */}
      <section className="process-section" data-admin-editable="process-section">
        <div className="section-container-premium">
          <div className="section-header-premium">
            <div className="section-badge" data-admin-editable="process-badge">
              Our Process
            </div>
            <h2 className="section-title-premium" data-admin-editable="process-title">
              How We Work
            </h2>
            <p className="section-description-premium" data-admin-editable="process-description">
              Our proven workflow to deliver exceptional projects from concept to launch
            </p>
          </div>

          <div className="process-timeline">
            {processSteps.map((step, index) => {
              const IconComponent = processIconMap[step.icon] || Code;
              const isEven = index % 2 === 0;
              return (
                <div 
                  key={step.id} 
                  className={`process-step ${isEven ? 'step-left' : 'step-right'}`}
                  data-admin-editable={`process-${step.id}`}
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <div className="process-step-content">
                    <div className="process-number" data-admin-editable={`process-number-${step.id}`}>
                      {step.number}
                    </div>
                    <div className="process-icon">
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <h3 className="process-title" data-admin-editable={`process-title-${step.id}`}>
                      {step.title}
                    </h3>
                    <p className="process-description" data-admin-editable={`process-desc-${step.id}`}>
                      {step.description}
                    </p>
                  </div>
                  <div className="process-connector"></div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FEELINGS SERVICES SECTION - SPECIAL EVENTS */}
      <FeelingsServicesSection />

      {/* CTA SECTION */}
      <section className="cta-section-services" data-admin-editable="cta-section">
        <div className="cta-background-gradient-services"></div>
        <div className="cta-container-services">
          <div className="cta-sparkles-wrapper-services">
            <Sparkles className="cta-sparkle sparkle-1" />
            <Sparkles className="cta-sparkle sparkle-2" />
            <Sparkles className="cta-sparkle sparkle-3" />
          </div>
          
          <h2 className="cta-title-services" data-admin-editable="cta-title">
            Ready to Build Your Website?
          </h2>
          
          <p className="cta-description-services" data-admin-editable="cta-description">
            Let's transform your vision into a stunning digital reality. Start your project with us today.
          </p>
          
          <Link to="/contact" data-admin-editable="cta-button-link">
            <Button className="cta-gold-large-services">
              <span data-admin-editable="cta-button-text">Start a Project</span>
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Services;
