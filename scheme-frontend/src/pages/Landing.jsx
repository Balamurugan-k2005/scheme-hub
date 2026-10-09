import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { 
  Search, ArrowRight, Shield, CheckCircle2, ChevronRight,
  GraduationCap, Sprout, HeartPulse, Building2, Home,
  Briefcase, Users, Scale, Cpu, Award, Trophy, Train, Compass, Droplet, UserCheck,
  Check, Sparkles, Filter, FileText, HelpCircle
} from 'lucide-react';

export const Landing = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');

  // Interactive Questionnaire Wizard State
  const [wizardStep, setWizardStep] = useState(1);
  const [wizGender, setWizGender] = useState('MALE');
  const [wizAge, setWizAge] = useState(24);
  const [wizState, setWizState] = useState('Tamil Nadu');
  const [wizArea, setWizArea] = useState('RURAL');
  const [wizCaste, setWizCaste] = useState('OBC');
  const [wizOccupation, setWizOccupation] = useState('STUDENT');
  const [wizIncome, setWizIncome] = useState(200000);
  const [wizDisability, setWizDisability] = useState(false);

  // States exploration tab
  const [activeTab, setActiveTab] = useState('CENTRAL');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/search');
    }
  };

  const handleTagClick = (tag) => {
    navigate(`/search?query=${encodeURIComponent(tag)}`);
  };

  const handleCategoryClick = (categoryKey) => {
    navigate(`/search?category=${categoryKey}`);
  };

  // 15 myScheme Standard Categories
  const categories = [
    { key: 'AGRICULTURE', name: 'Agriculture, Rural & Environment', icon: Sprout, count: '640+' },
    { key: 'FINANCIAL', name: 'Banking, Financial Services & Insurance', icon: Building2, count: '280+' },
    { key: 'BUSINESS', name: 'Business & Entrepreneurship', icon: Briefcase, count: '390+' },
    { key: 'EDUCATION', name: 'Education & Learning', icon: GraduationCap, count: '720+' },
    { key: 'HEALTH', name: 'Health & Wellness', icon: HeartPulse, count: '410+' },
    { key: 'HOUSING', name: 'Housing & Shelter', icon: Home, count: '190+' },
    { key: 'SAFETY', name: 'Public Safety, Law & Justice', icon: Scale, count: '130+' },
    { key: 'TECH', name: 'Science, IT & Communications', icon: Cpu, count: '175+' },
    { key: 'SKILLS', name: 'Skills & Employment', icon: Award, count: '460+' },
    { key: 'SOCIAL', name: 'Social Welfare & Empowerment', icon: Users, count: '850+' },
    { key: 'SPORTS', name: 'Sports & Culture', icon: Trophy, count: '140+' },
    { key: 'TRANSPORT', name: 'Transport & Infrastructure', icon: Train, count: '110+' },
    { key: 'TOURISM', name: 'Travel & Tourism', icon: Compass, count: '95+' },
    { key: 'UTILITY', name: 'Utility & Sanitation', icon: Droplet, count: '160+' },
    { key: 'WOMEN', name: 'Women and Child', icon: UserCheck, count: '520+' },
  ];

  const popularStates = [
    { name: 'Tamil Nadu', count: '380+' },
    { name: 'Maharashtra', count: '420+' },
    { name: 'Uttar Pradesh', count: '460+' },
    { name: 'Karnataka', count: '340+' },
    { name: 'Kerala', count: '290+' },
    { name: 'Andhra Pradesh', count: '310+' },
    { name: 'Telangana', count: '280+' },
    { name: 'West Bengal', count: '350+' },
  ];

  // Dynamic preview computation for questionnaire
  const computePreview = () => {
    let matches = [];
    if (wizOccupation === 'FARMER') {
      matches.push({ title: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)', score: 96, benefit: '₹6,000 / year' });
    }
    if (wizOccupation === 'STUDENT' || wizAge <= 25) {
      matches.push({ title: 'Post Matric Scholarship for OBC/SC/ST Students', score: 92, benefit: 'Up to ₹20,000 / year' });
    }
    if (wizIncome <= 500000) {
      matches.push({ title: 'Ayushman Bharat - PM-JAY Health Protection', score: 88, benefit: '₹5,00,000 cover' });
      matches.push({ title: 'Pradhan Mantri Awas Yojana (PMAY-Gramin)', score: 85, benefit: '₹1,20,000 subsidy' });
    }
    if (wizDisability) {
      matches.push({ title: 'Divyangjan Swavalamban Welfare Assistance', score: 95, benefit: '₹15,000 allowance' });
    }
    return matches;
  };

  const previewMatches = computePreview();

  return (
    <div className="landing-page bg-light">
      {/* ---------------- Hero Section ---------------- */}
      <section className="myscheme-hero">
        <div className="container text-center">
          <div className="hero-badge mb-3">
            <Sparkles size={16} />
            <span>Official Government Welfare Discovery Platform</span>
          </div>

          <h1 className="hero-title mb-3">
            Find Schemes Based on <span className="text-success" style={{ color: '#15803d' }}>Your Eligibility</span>
          </h1>
          <p className="hero-subtitle mb-4">
            One-stop search and discovery platform of Central and State Government schemes across India. Discover welfare benefits tailored to your profile.
          </p>

          {/* Call to Actions */}
          <div className="d-flex justify-content-center gap-3 mb-4 flex-wrap">
            <a href="#eligibility-wizard" className="btn btn-myscheme-primary d-inline-flex align-items-center gap-2 py-3 px-4 fs-5 shadow-sm">
              <span>Find Schemes For You</span>
              <ArrowRight size={20} />
            </a>
            <Link to="/search" className="btn btn-myscheme-outline d-inline-flex align-items-center gap-2 py-3 px-4 fs-5">
              <span>Explore All Schemes</span>
            </Link>
          </div>

          {/* Big Search Bar */}
          <div className="row justify-content-center mb-4">
            <div className="col-lg-8 col-md-10">
              <form onSubmit={handleSearchSubmit} className="card p-2 shadow-sm border-0 rounded-4">
                <div className="input-group">
                  <span className="input-group-text bg-transparent border-0 ps-3">
                    <Search size={22} className="text-muted" />
                  </span>
                  <input 
                    type="text" 
                    className="form-control border-0 py-3 fs-6 shadow-none" 
                    placeholder="Search by scheme name, keywords (e.g. Scholarship, PM Kisan, Health)..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button className="btn btn-myscheme-primary px-4 rounded-3 fw-bold" type="submit">
                    Search
                  </button>
                </div>
              </form>

              {/* Trending Tag Chips */}
              <div className="d-flex align-items-center justify-content-center gap-2 mt-3 flex-wrap small">
                <span className="text-muted fw-semibold">Trending:</span>
                {['PM-KISAN', 'Post Matric Scholarship', 'Ayushman Bharat', 'PMAY Housing', 'Women Welfare'].map((tag) => (
                  <button 
                    key={tag} 
                    className="btn btn-sm btn-light border bg-white rounded-pill px-3 py-1 text-secondary shadow-none"
                    onClick={() => handleTagClick(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Stats Counter Strip */}
          <div className="row justify-content-center mt-5">
            <div className="col-lg-10">
              <div className="stats-strip">
                <div className="row g-0">
                  <div className="col-md-3 col-6 stat-item">
                    <div className="stat-num">4,700+</div>
                    <div className="stat-label">Total Schemes Onboarded</div>
                  </div>
                  <div className="col-md-3 col-6 stat-item">
                    <div className="stat-num">520+</div>
                    <div className="stat-label">Central Government Schemes</div>
                  </div>
                  <div className="col-md-3 col-6 stat-item">
                    <div className="stat-num">4,180+</div>
                    <div className="stat-label">State & UT Schemes</div>
                  </div>
                  <div className="col-md-3 col-6 stat-item">
                    <div className="stat-num">15</div>
                    <div className="stat-label">Domain Categories</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- How It Works (3 Steps) ---------------- */}
      <section className="py-5 bg-white border-bottom">
        <div className="container">
          <div className="text-center mb-5">
            <span className="text-success fw-bold small text-uppercase letter-spacing-1">Simple 3-Step Process</span>
            <h2 className="fw-bold text-dark mt-1">How myScheme Works for You</h2>
            <p className="text-muted">Easy, transparent, and personalized government welfare discovery in three quick steps.</p>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="step-card">
                <div className="step-num-badge">1</div>
                <h5 className="fw-bold text-dark mb-2">Enter Details</h5>
                <p className="text-muted small mb-0">
                  Start by entering your basic demographic details such as age, gender, state, occupation, and income category.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="step-card">
                <div className="step-num-badge">2</div>
                <h5 className="fw-bold text-dark mb-2">Search & Match</h5>
                <p className="text-muted small mb-0">
                  Our dynamic eligibility engine evaluates your profile against hundreds of government rules and computes match scores.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="step-card">
                <div className="step-num-badge">3</div>
                <h5 className="fw-bold text-dark mb-2">Select & Apply</h5>
                <p className="text-muted small mb-0">
                  Select matching schemes, review required documents checklists, and navigate directly to official government portals to apply.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 15 myScheme Category Tiles Grid ---------------- */}
      <section className="py-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <span className="text-success fw-bold small text-uppercase">Explore by Domain</span>
              <h2 className="fw-bold text-dark mt-1">Schemes by Category</h2>
              <p className="text-muted mb-0">Browse welfare programs classified across 15 government service sectors.</p>
            </div>
            <Link to="/search" className="btn btn-outline-success btn-sm fw-semibold d-none d-md-inline-flex align-items-center gap-1">
              <span>View All Categories</span>
              <ChevronRight size={16} />
            </Link>
          </div>

          <div className="row g-3">
            {categories.map((cat) => {
              const IconComp = cat.icon;
              return (
                <div key={cat.key} className="col-lg-2 col-md-3 col-6">
                  <div 
                    className="category-card cursor-pointer"
                    onClick={() => handleCategoryClick(cat.key)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="category-icon-wrapper" style={{ backgroundColor: '#ecfdf5', color: '#15803d' }}>
                      <IconComp size={26} />
                    </div>
                    <div className="category-title">{cat.name}</div>
                    <div className="category-count mt-auto">{cat.count} Schemes</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------- Interactive Eligibility Questionnaire Wizard ---------------- */}
      <section id="eligibility-wizard" className="py-5 bg-white border-top border-bottom">
        <div className="container">
          <div className="text-center mb-4">
            <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 fw-semibold rounded-pill mb-2">
              ⚡ Instant Eligibility Checker
            </span>
            <h2 className="fw-bold text-dark">Find Schemes You are Eligible For</h2>
            <p className="text-muted max-w-600 mx-auto">
              Answer 3 simple questions to let our intelligent rule engine verify your qualifications in real time.
            </p>
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="wizard-container p-4 p-md-5">
                {/* Stepper Tabs */}
                <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
                  <div className="d-flex align-items-center gap-2">
                    <span className={`badge rounded-circle p-2 ${wizardStep >= 1 ? 'bg-success text-white' : 'bg-secondary text-white'}`}>
                      1
                    </span>
                    <span className="small fw-semibold d-none d-sm-inline">Demographics</span>
                  </div>
                  <div className="text-muted">──────</div>
                  <div className="d-flex align-items-center gap-2">
                    <span className={`badge rounded-circle p-2 ${wizardStep >= 2 ? 'bg-success text-white' : 'bg-light text-dark'}`}>
                      2
                    </span>
                    <span className="small fw-semibold d-none d-sm-inline">Location & Caste</span>
                  </div>
                  <div className="text-muted">──────</div>
                  <div className="d-flex align-items-center gap-2">
                    <span className={`badge rounded-circle p-2 ${wizardStep >= 3 ? 'bg-success text-white' : 'bg-light text-dark'}`}>
                      3
                    </span>
                    <span className="small fw-semibold d-none d-sm-inline">Income & Occupation</span>
                  </div>
                </div>

                {/* Step 1: Demographics */}
                {wizardStep === 1 && (
                  <div>
                    <h5 className="fw-bold text-dark mb-3">1. Tell us about your basic demographics</h5>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">What is your gender?</label>
                        <div className="d-flex gap-2">
                          {['MALE', 'FEMALE', 'TRANSGENDER'].map((g) => (
                            <button
                              key={g}
                              type="button"
                              className={`btn btn-sm flex-fill py-2 ${wizGender === g ? 'btn-success fw-bold' : 'btn-outline-secondary'}`}
                              onClick={() => setWizGender(g)}
                            >
                              {g}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">What is your age? ({wizAge} years)</label>
                        <input 
                          type="range" 
                          className="form-range" 
                          min="10" 
                          max="90" 
                          value={wizAge}
                          onChange={(e) => setWizAge(Number(e.target.value))}
                        />
                        <div className="d-flex justify-content-between small text-muted">
                          <span>10 yrs</span>
                          <span className="fw-bold text-success">{wizAge} yrs</span>
                          <span>90 yrs</span>
                        </div>
                      </div>

                      <div className="col-12 mt-3">
                        <div className="form-check form-switch">
                          <input 
                            className="form-check-input" 
                            type="checkbox" 
                            id="disSwitch"
                            checked={wizDisability}
                            onChange={(e) => setWizDisability(e.target.checked)}
                          />
                          <label className="form-check-label small fw-semibold" htmlFor="disSwitch">
                            Person with Disability (Divyangjan)?
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="d-flex justify-content-end mt-4">
                      <button className="btn btn-myscheme-primary" onClick={() => setWizardStep(2)}>
                        Next Step <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Location & Social Category */}
                {wizardStep === 2 && (
                  <div>
                    <h5 className="fw-bold text-dark mb-3">2. Where do you reside and what is your social category?</h5>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Select your State / UT</label>
                        <select className="form-select" value={wizState} onChange={(e) => setWizState(e.target.value)}>
                          {['Andhra Pradesh', 'Karnataka', 'Kerala', 'Maharashtra', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal'].map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Area of Residence</label>
                        <div className="d-flex gap-2">
                          <button
                            type="button"
                            className={`btn btn-sm flex-fill py-2 ${wizArea === 'RURAL' ? 'btn-success fw-bold' : 'btn-outline-secondary'}`}
                            onClick={() => setWizArea('RURAL')}
                          >
                            Rural
                          </button>
                          <button
                            type="button"
                            className={`btn btn-sm flex-fill py-2 ${wizArea === 'URBAN' ? 'btn-success fw-bold' : 'btn-outline-secondary'}`}
                            onClick={() => setWizArea('URBAN')}
                          >
                            Urban
                          </button>
                        </div>
                      </div>

                      <div className="col-12">
                        <label className="form-label small fw-semibold">Social Category</label>
                        <div className="d-flex gap-2 flex-wrap">
                          {['GENERAL', 'OBC', 'SC', 'ST'].map((c) => (
                            <button
                              key={c}
                              type="button"
                              className={`btn btn-sm flex-fill py-2 ${wizCaste === c ? 'btn-success fw-bold' : 'btn-outline-secondary'}`}
                              onClick={() => setWizCaste(c)}
                            >
                              {c}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="d-flex justify-content-between mt-4">
                      <button className="btn btn-outline-secondary" onClick={() => setWizardStep(1)}>
                        Back
                      </button>
                      <button className="btn btn-myscheme-primary" onClick={() => setWizardStep(3)}>
                        Next Step <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Occupation & Income */}
                {wizardStep === 3 && (
                  <div>
                    <h5 className="fw-bold text-dark mb-3">3. What is your profession and annual family income?</h5>
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label small fw-semibold">Select your Occupation</label>
                        <div className="d-flex gap-2 flex-wrap">
                          {[
                            { key: 'STUDENT', label: 'Student' },
                            { key: 'FARMER', label: 'Farmer / Agri' },
                            { key: 'BUSINESS', label: 'Self-Employed / Business' },
                            { key: 'UNEMPLOYED', label: 'Unemployed / Jobseeker' },
                            { key: 'OTHER', label: 'Other' },
                          ].map((occ) => (
                            <button
                              key={occ.key}
                              type="button"
                              className={`btn btn-sm flex-fill py-2 ${wizOccupation === occ.key ? 'btn-success fw-bold' : 'btn-outline-secondary'}`}
                              onClick={() => setWizOccupation(occ.key)}
                            >
                              {occ.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="col-12">
                        <label className="form-label small fw-semibold">
                          Annual Family Income: ₹{Number(wizIncome).toLocaleString()}
                        </label>
                        <input 
                          type="range" 
                          className="form-range" 
                          min="30000" 
                          max="1500000" 
                          step="20000"
                          value={wizIncome}
                          onChange={(e) => setWizIncome(Number(e.target.value))}
                        />
                        <div className="d-flex justify-content-between small text-muted">
                          <span>₹30,000</span>
                          <span>₹5,00,000</span>
                          <span>₹15,00,000+</span>
                        </div>
                      </div>
                    </div>

                    <div className="d-flex justify-content-between mt-4">
                      <button className="btn btn-outline-secondary" onClick={() => setWizardStep(2)}>
                        Back
                      </button>
                      <button className="btn btn-myscheme-primary" onClick={() => setWizardStep(4)}>
                        View Eligible Schemes <Check size={16} />
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 4: Results Showcase */}
                {wizardStep === 4 && (
                  <div>
                    <div className="alert alert-success d-flex align-items-center gap-2 mb-3">
                      <CheckCircle2 className="text-success" size={22} />
                      <div>
                        <strong>Great News!</strong> We found <strong>{previewMatches.length + 8} schemes</strong> matching your profile criteria.
                      </div>
                    </div>

                    <div className="d-flex flex-column gap-2 mb-4">
                      {previewMatches.map((m, idx) => (
                        <div key={idx} className="p-3 bg-light rounded border d-flex justify-content-between align-items-center">
                          <div>
                            <div className="fw-bold text-dark">{m.title}</div>
                            <span className="small text-muted">Benefit: {m.benefit}</span>
                          </div>
                          <span className="badge bg-success rounded-pill px-3 py-2 fs-6">
                            {m.score}% Match
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="d-flex gap-2 justify-content-between">
                      <button className="btn btn-outline-secondary" onClick={() => setWizardStep(1)}>
                        Restart Questionnaire
                      </button>
                      
                      {user ? (
                        <Link to="/recommendations" className="btn btn-myscheme-primary d-flex align-items-center gap-1">
                          <span>View Full Recommendations</span>
                          <ArrowRight size={16} />
                        </Link>
                      ) : (
                        <Link to="/login" className="btn btn-myscheme-primary d-flex align-items-center gap-1">
                          <span>Sign In to Save & Apply</span>
                          <ArrowRight size={16} />
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Central & State Schemes Exploration Section ---------------- */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-4">
            <span className="text-success fw-bold small text-uppercase">Geographic Coverage</span>
            <h2 className="fw-bold text-dark mt-1">Explore Central & State Schemes</h2>
            <p className="text-muted">Find schemes funded by the Union Government or specific State Administrations.</p>
          </div>

          <div className="d-flex justify-content-center gap-2 mb-4">
            <button 
              className={`btn px-4 py-2 fw-semibold ${activeTab === 'CENTRAL' ? 'btn-myscheme-primary' : 'btn-outline-secondary'}`}
              onClick={() => setActiveTab('CENTRAL')}
            >
              Central Government Schemes (520+)
            </button>
            <button 
              className={`btn px-4 py-2 fw-semibold ${activeTab === 'STATE' ? 'btn-myscheme-primary' : 'btn-outline-secondary'}`}
              onClick={() => setActiveTab('STATE')}
            >
              State & UT Schemes (4,180+)
            </button>
          </div>

          {activeTab === 'CENTRAL' ? (
            <div className="card p-4 shadow-sm border-0 rounded-4 text-center bg-white">
              <h5 className="fw-bold text-dark mb-2">Central Sector & Centrally Sponsored Schemes</h5>
              <p className="text-muted small mb-4">
                Schemes directly funded by the Central Government Ministries like Ministry of Agriculture, Ministry of Education, Ministry of Health, etc.
              </p>
              <div className="d-flex justify-content-center gap-2 flex-wrap">
                {['Direct Benefit Transfer (DBT)', 'National Scholarships', 'Farmers Welfare', 'Health Insurance (PM-JAY)', 'Housing for All'].map((item) => (
                  <button key={item} className="btn btn-light border small px-3 py-2" onClick={() => handleTagClick(item)}>
                    {item}
                  </button>
                ))}
              </div>
              <div className="mt-4">
                <Link to="/search?isCentral=true" className="btn btn-myscheme-primary">
                  Explore Central Schemes Catalog →
                </Link>
              </div>
            </div>
          ) : (
            <div className="row g-3">
              {popularStates.map((st) => (
                <div key={st.name} className="col-md-3 col-6">
                  <div 
                    className="card p-3 h-100 border text-center cursor-pointer hover-card bg-white"
                    onClick={() => navigate(`/search?state=${encodeURIComponent(st.name)}`)}
                    role="button"
                    tabIndex={0}
                  >
                    <h6 className="fw-bold text-dark mb-1">{st.name}</h6>
                    <span className="badge bg-success bg-opacity-10 text-success">{st.count} Schemes</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
