import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ExternalLink, Mail, Phone, MapPin, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="gov-footer pt-5">
      <div className="container pb-4">
        <div className="row g-4">
          {/* Column 1: Brand & National Identity */}
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="bg-success text-white rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px', backgroundColor: '#15803d' }}>
                <Shield size={20} />
              </div>
              <h5 className="text-white fw-bold mb-0">myScheme <span className="text-success">Hub</span></h5>
            </div>
            <p className="small mb-3 text-secondary" style={{ lineHeight: 1.6 }}>
              myScheme Hub is a National Platform that aims to offer one-stop search and discovery of Central and State Government schemes for citizens across India based on eligibility criteria.
            </p>
            <div className="d-flex align-items-center gap-2 small text-muted">
              <span>Powered by Digital Citizen Empowerment</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="col-lg-2 col-md-6 col-6">
            <h6>Quick Links</h6>
            <Link to="/">Home</Link>
            <Link to="/search">Find Schemes</Link>
            <Link to="/search?isCentral=true">Central Schemes</Link>
            <Link to="/search?isCentral=false">State Schemes</Link>
            <Link to="/profile">Eligibility Profile</Link>
            <Link to="/applications">Track Applications</Link>
          </div>

          {/* Column 3: Scheme Categories */}
          <div className="col-lg-3 col-md-6 col-6">
            <h6>Scheme Domains</h6>
            <Link to="/search?category=AGRICULTURE">Agriculture & Rural</Link>
            <Link to="/search?category=EDUCATION">Education & Learning</Link>
            <Link to="/search?category=HEALTH">Health & Wellness</Link>
            <Link to="/search?category=FINANCIAL">Banking & Financial</Link>
            <Link to="/search?category=HOUSING">Housing & Shelter</Link>
            <Link to="/search?category=WOMEN">Women & Child Welfare</Link>
          </div>

          {/* Column 4: Help & Contact */}
          <div className="col-lg-3 col-md-6">
            <h6>Citizen Support</h6>
            <p className="small mb-2 text-secondary">
              Need assistance checking eligibility or finding documents?
            </p>
            <div className="small text-secondary mb-1 d-flex align-items-center gap-2">
              <Mail size={14} className="text-success" />
              <span>support-myscheme@gov.in</span>
            </div>
            <div className="small text-secondary mb-1 d-flex align-items-center gap-2">
              <Phone size={14} className="text-success" />
              <span>Toll Free: 1800-11-2026</span>
            </div>
            <div className="small text-secondary mt-2 d-flex align-items-center gap-2">
              <MapPin size={14} className="text-success" />
              <span>New Delhi, India</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Strip */}
      <div className="gov-footer-bottom">
        <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 text-center text-md-start">
          <div>
            © 2026 myScheme Hub. Content Owned, Managed and Updated by National Governance Platform.
          </div>
          <div className="d-flex gap-3 small">
            <Link to="/search" className="text-muted text-decoration-none">Terms of Service</Link>
            <Link to="/search" className="text-muted text-decoration-none">Privacy Policy</Link>
            <Link to="/search" className="text-muted text-decoration-none">Hyperlinking Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
