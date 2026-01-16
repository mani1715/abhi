import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Code, ShoppingCart, Layers, Palette, Sparkles,
  CheckCircle, Zap, Award, Smartphone, Code2, Search, Shield,
  FileSearch, CheckCircle2, Rocket, HeartHandshake, X
} from 'lucide-react';
import { detailedServices, whyChooseUs, processSteps } from '../data/mock';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import { trackPageView } from '../services/analytics';
import FeelingsServicesSection from '../components/FeelingsServicesSection';
import api from '../services/api';
import './pages.css';
import './Services.css';

const Services = () => {
  const [showContactForm, setShowContactForm] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    message: ''
  });

  useEffect(() => {
    // Track page view
    trackPageView('services');
  }, []);

  const handleContactClick = (service) => {
    setSelectedService(service);
    setShowContactForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitContact = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const contactData = {
        service_id: selectedService.id.toString(),
        service_name: selectedService.title,
        ...formData
      };

      await api.post('/service-contacts/', contactData);
      toast.success('Request submitted successfully! We will contact you soon.');
      setShowContactForm(false);
      setFormData({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting contact:', error);
      toast.error('Failed to submit request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

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

  // Featured Birthday Services - can show multiple
  const featuredServices = detailedServices.filter(s => s.id === 5);

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

      {/* FEATURED SERVICES - GRID LAYOUT (SMALLER CARDS) */}
      {featuredServices.length > 0 && (
        <section style={{
          padding: '60px 0',
          background: 'linear-gradient(135deg, #FFF5F7 0%, #F3E8FF 100%)',
          position: 'relative',
          overflow: 'hidden'
        }} data-admin-editable="featured-services">
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 24px'
          }}>
            {/* Section Badge */}
            <div style={{
              textAlign: 'center',
              marginBottom: '40px'
            }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'linear-gradient(135deg, #D4AF37 0%, #7C5CFF 100%)',
                color: '#ffffff',
                padding: '10px 20px',
                borderRadius: '50px',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '16px',
                boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)'
              }}>
                <Sparkles className="h-4 w-4" />
                <span>Featured Special Services</span>
              </div>
              <h2 style={{
                fontSize: '36px',
                fontWeight: '700',
                color: '#1C2A3A',
                marginBottom: '12px'
              }}>
                Create Unforgettable Moments
              </h2>
              <p style={{
                fontSize: '16px',
                color: '#64748b',
                maxWidth: '600px',
                margin: '0 auto'
              }}>
                Transform special occasions into magical digital experiences
              </p>
            </div>

            {/* Featured Services Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '12px'
            }}>
              {featuredServices.map((service) => {
                const IconComponent = serviceIconMap[service.icon] || Sparkles;
                return (
                  <Card key={service.id} style={{
                    background: 'linear-gradient(135deg, #ffffff 0%, #fefcff 100%)',
                    border: '2px solid',
                    borderImage: 'linear-gradient(135deg, #D4AF37 0%, #7C5CFF 100%) 1',
                    borderRadius: '12px',
                    padding: '0',
                    overflow: 'hidden',
                    boxShadow: '0 8px 20px rgba(124, 92, 255, 0.12)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 12px 30px rgba(124, 92, 255, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(124, 92, 255, 0.12)';
                  }}>
                    {/* Image Section */}
                    {service.image && (
                      <div style={{
                        position: 'relative',
                        height: '100px',
                        overflow: 'hidden'
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
                        {service.price && (
                          <div style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            background: 'linear-gradient(135deg, #D4AF37 0%, #f59e0b 100%)',
                            color: '#0f172a',
                            padding: '6px 12px',
                            borderRadius: '50px',
                            fontWeight: '700',
                            fontSize: '12px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                          }}>
                            {service.price}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Content Section */}
                    <div style={{
                      padding: '12px'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        marginBottom: '8px'
                      }}>
                        <div style={{
                          width: '28px',
                          height: '28px',
                          background: 'linear-gradient(135deg, #D4AF37 0%, #7C5CFF 100%)',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 4px 12px rgba(124, 92, 255, 0.3)'
                        }}>
                          <IconComponent className="h-4 w-4" style={{ color: '#ffffff' }} />
                        </div>
                      </div>

                      <h3 style={{
                        fontSize: '15px',
                        fontWeight: '700',
                        color: '#1C2A3A',
                        marginBottom: '6px',
                        lineHeight: '1.2'
                      }}>
                        {service.title}
                      </h3>

                      <p style={{
                        fontSize: '12px',
                        color: '#64748b',
                        lineHeight: '1.4',
                        marginBottom: '8px'
                      }}>
                        {service.description.substring(0, 80)}...
                      </p>

                      {/* Features List - Compact */}
                      <ul style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: '0 0 10px 0',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px'
                      }}>
                        {service.features.slice(0, 2).map((feature, idx) => (
                          <li key={idx} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '11px',
                            color: '#334155'
                          }}>
                            <CheckCircle style={{
                              color: '#7C5CFF',
                              flexShrink: 0,
                              width: '12px',
                              height: '12px'
                            }} />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Action Buttons */}
                      <div style={{
                        display: 'flex',
                        gap: '6px',
                        flexWrap: 'wrap'
                      }}>
                        {service.demoLink && (
                          <a 
                            href={service.demoLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '3px',
                              background: 'linear-gradient(135deg, #D4AF37 0%, #f59e0b 100%)',
                              color: '#0f172a',
                              padding: '6px 10px',
                              borderRadius: '6px',
                              textDecoration: 'none',
                              fontWeight: '600',
                              fontSize: '11px',
                              transition: 'all 0.3s ease',
                              boxShadow: '0 3px 10px rgba(234, 179, 8, 0.4)',
                              border: 'none',
                              cursor: 'pointer',
                              flex: 1
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'translateY(-2px)';
                              e.currentTarget.style.boxShadow = '0 5px 15px rgba(234, 179, 8, 0.5)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'translateY(0)';
                              e.currentTarget.style.boxShadow = '0 3px 10px rgba(234, 179, 8, 0.4)';
                            }}
                          >
                            <Sparkles size={12} />
                            View Demo
                          </a>
                        )}
                        
                        <Button 
                          onClick={() => handleContactClick(service)}
                          style={{
                            background: 'linear-gradient(135deg, #7C5CFF 0%, #A78BFA 100%)',
                            color: '#ffffff',
                            padding: '6px 10px',
                            borderRadius: '6px',
                            fontWeight: '600',
                            fontSize: '11px',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 3px 10px rgba(124, 92, 255, 0.4)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '3px',
                            flex: 1
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 5px 15px rgba(124, 92, 255, 0.5)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 3px 10px rgba(124, 92, 255, 0.4)';
                          }}>
                          Contact Us
                          <ArrowRight size={12} />
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Contact Form Dialog */}
      <Dialog open={showContactForm} onOpenChange={setShowContactForm}>
        <DialogContent style={{
          maxWidth: '500px',
          background: 'linear-gradient(135deg, #ffffff 0%, #fefcff 100%)',
          borderRadius: '16px',
          padding: '32px'
        }}>
          <DialogHeader>
            <DialogTitle style={{
              fontSize: '24px',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #D4AF37 0%, #7C5CFF 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '8px'
            }}>
              Contact Us for {selectedService?.title}
            </DialogTitle>
            <DialogDescription style={{ fontSize: '14px', color: '#64748b' }}>
              Fill in your details and we'll get back to you soon!
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmitContact} style={{ marginTop: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <Label htmlFor="customer_name" style={{ fontSize: '14px', fontWeight: '600', color: '#334155' }}>
                  Your Name *
                </Label>
                <Input
                  id="customer_name"
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleInputChange}
                  required
                  placeholder="John Doe"
                  style={{
                    marginTop: '8px',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '2px solid #e2e8f0',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <Label htmlFor="customer_email" style={{ fontSize: '14px', fontWeight: '600', color: '#334155' }}>
                  Email Address *
                </Label>
                <Input
                  id="customer_email"
                  name="customer_email"
                  type="email"
                  value={formData.customer_email}
                  onChange={handleInputChange}
                  required
                  placeholder="john@example.com"
                  style={{
                    marginTop: '8px',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '2px solid #e2e8f0',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <Label htmlFor="customer_phone" style={{ fontSize: '14px', fontWeight: '600', color: '#334155' }}>
                  Phone Number *
                </Label>
                <Input
                  id="customer_phone"
                  name="customer_phone"
                  type="tel"
                  value={formData.customer_phone}
                  onChange={handleInputChange}
                  required
                  placeholder="+91-9876543210"
                  style={{
                    marginTop: '8px',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '2px solid #e2e8f0',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <Label htmlFor="message" style={{ fontSize: '14px', fontWeight: '600', color: '#334155' }}>
                  Message (Optional)
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell us about your requirements..."
                  rows={4}
                  style={{
                    marginTop: '8px',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '2px solid #e2e8f0',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{
                display: 'flex',
                gap: '12px',
                marginTop: '8px'
              }}>
                <Button
                  type="button"
                  onClick={() => setShowContactForm(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '8px',
                    border: '2px solid #e2e8f0',
                    background: '#ffffff',
                    color: '#334155',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #7C5CFF 0%, #A78BFA 100%)',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: '600',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    opacity: submitting ? 0.7 : 1
                  }}
                >
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* DETAILED SERVICES GRID SECTION */}
      <section className="detailed-services-section" data-admin-editable="detailed-services">
        <div className="section-container-premium">
          <div className="detailed-services-grid">
            {detailedServices.filter(s => s.id !== 5).map((service, index) => {
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
                      height: '120px',
                      overflow: 'hidden',
                      borderRadius: '12px 12px 0 0',
                      marginBottom: '16px'
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
