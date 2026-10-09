import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { 
  Search as SearchIcon, Filter, Layers, LayoutGrid, CheckSquare, 
  Square, ChevronLeft, ChevronRight, Bookmark, ExternalLink, Sparkles, X, CheckCircle2, Clock
} from 'lucide-react';

export const Search = () => {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search state initialized from query params
  const [query, setQuery] = useState(searchParams.get('query') || '');
  const [state, setState] = useState(searchParams.get('state') || 'all');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [beneficiary, setBeneficiary] = useState('all');
  const [isCentral, setIsCentral] = useState(
    searchParams.get('isCentral') === 'true' ? true : searchParams.get('isCentral') === 'false' ? false : null
  );

  // Pagination & Sorting
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [sortBy, setSortBy] = useState('viewsCount');
  const [sortDir, setSortDir] = useState('desc');

  // Scheme Comparison selection
  const [selectedSchemeIds, setSelectedSchemeIds] = useState([]);
  const [bookmarkMessage, setBookmarkMessage] = useState(null);

  useEffect(() => {
    fetchSchemes();
  }, [state, category, beneficiary, isCentral, page, sortBy, sortDir]);

  const fetchSchemes = async () => {
    try {
      setLoading(true);
      const isCentralParam = isCentral !== null ? `&isCentral=${isCentral}` : '';
      const res = await axios.get(
        `/api/schemes/public/search?query=${encodeURIComponent(query)}&state=${state}&category=${category}&beneficiary=${beneficiary}${isCentralParam}&page=${page}&size=6&sortBy=${sortBy}&sortDir=${sortDir}`
      );
      setSchemes(res.data.content);
      setTotalPages(res.data.totalPages);
      setTotalElements(res.data.totalElements || res.data.content.length);
    } catch (err) {
      console.error('Error fetching schemes', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchClick = (e) => {
    e.preventDefault();
    setPage(0);
    fetchSchemes();
  };

  const handleClearFilters = () => {
    setQuery('');
    setState('all');
    setCategory('all');
    setBeneficiary('all');
    setIsCentral(null);
    setPage(0);
    setSearchParams({});
  };

  const toggleCompare = (id) => {
    if (selectedSchemeIds.includes(id)) {
      setSelectedSchemeIds(prev => prev.filter(x => x !== id));
    } else {
      if (selectedSchemeIds.length >= 3) {
        alert('You can compare a maximum of 3 schemes simultaneously.');
        return;
      }
      setSelectedSchemeIds(prev => [...prev, id]);
    }
  };

  const handleCompareClick = () => {
    if (selectedSchemeIds.length < 2) {
      alert('Please select at least 2 schemes to compare.');
      return;
    }
    navigate(`/compare?ids=${selectedSchemeIds.join(',')}`);
  };

  const handleBookmark = async (schemeId) => {
    if (!user) {
      alert('Please sign in to save schemes and track them in My Applications.');
      navigate('/login');
      return;
    }

    try {
      setBookmarkMessage(null);
      await axios.post(`/api/applications/save/${schemeId}`);
      setBookmarkMessage('Scheme saved to your applications portfolio!');
      setTimeout(() => setBookmarkMessage(null), 4000);
    } catch (err) {
      console.error(err);
      alert('Unable to bookmark scheme. Please try again.');
    }
  };

  const states = ["Andhra Pradesh", "Karnataka", "Kerala", "Maharashtra", "Tamil Nadu", "Telangana", "Uttar Pradesh", "West Bengal"];
  const categories = ["EDUCATION", "AGRICULTURE", "HEALTH", "HOUSING", "FINANCIAL", "BUSINESS", "WOMEN", "SOCIAL"];
  const beneficiaries = ["STUDENTS", "FARMERS", "WOMEN", "SENIOR_CITIZENS", "ALL"];

  return (
    <div className="container py-4">
      {/* Breadcrumb & Header */}
      <div className="mb-4">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb small">
            <li className="breadcrumb-item"><Link to="/" className="text-decoration-none text-muted">Home</Link></li>
            <li className="breadcrumb-item active text-success fw-semibold" aria-current="page">Schemes Catalog</li>
          </ol>
        </nav>
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2">
          <div>
            <h2 className="fw-bold text-dark mb-0">Government Schemes Discovery</h2>
            <p className="text-muted small mb-0">
              Showing {schemes.length} of {totalElements} available schemes across Central and State ministries
            </p>
          </div>
          
          {selectedSchemeIds.length > 0 && (
            <div className="d-flex align-items-center gap-2 bg-white p-2 rounded-3 border shadow-sm">
              <span className="badge bg-success">{selectedSchemeIds.length} Selected</span>
              <button className="btn btn-sm btn-myscheme-primary py-1" onClick={handleCompareClick}>
                Compare Now ({selectedSchemeIds.length})
              </button>
            </div>
          )}
        </div>
      </div>

      {bookmarkMessage && (
        <div className="alert alert-success d-flex align-items-center gap-2 shadow-sm">
          <CheckCircle2 size={18} className="text-success" />
          <span>{bookmarkMessage}</span>
        </div>
      )}

      <div className="row g-4">
        {/* ---------------- Left Filters Sidebar ---------------- */}
        <div className="col-lg-3">
          <div className="filter-sidebar sticky-top" style={{ top: '80px' }}>
            <div className="filter-header">
              <span className="d-flex align-items-center gap-2">
                <Filter size={18} className="text-success" />
                <span>Filters</span>
              </span>
              {(category !== 'all' || state !== 'all' || beneficiary !== 'all' || isCentral !== null || query) && (
                <button className="btn btn-link btn-sm p-0 text-danger text-decoration-none fw-semibold" onClick={handleClearFilters}>
                  Clear All
                </button>
              )}
            </div>

            {/* Keyword search input */}
            <form onSubmit={handleSearchClick} className="mb-3">
              <label className="filter-group-title">Search Keywords</label>
              <div className="input-group input-group-sm">
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. Kisan, Scholarship..."
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                />
                <button className="btn btn-myscheme-primary" type="submit">
                  <SearchIcon size={14} />
                </button>
              </div>
            </form>

            {/* Scope: Central vs State */}
            <div className="mb-3">
              <label className="filter-group-title">Scheme Scope</label>
              <div className="d-flex flex-column gap-1">
                <div className="form-check small">
                  <input 
                    type="radio" 
                    className="form-check-input" 
                    id="radioAll" 
                    name="scope" 
                    checked={isCentral === null} 
                    onChange={() => { setIsCentral(null); setPage(0); }} 
                  />
                  <label className="form-check-label" htmlFor="radioAll">All Schemes</label>
                </div>
                <div className="form-check small">
                  <input 
                    type="radio" 
                    className="form-check-input" 
                    id="radioCentral" 
                    name="scope" 
                    checked={isCentral === true} 
                    onChange={() => { setIsCentral(true); setPage(0); }} 
                  />
                  <label className="form-check-label" htmlFor="radioCentral">Central Government Only</label>
                </div>
                <div className="form-check small">
                  <input 
                    type="radio" 
                    className="form-check-input" 
                    id="radioState" 
                    name="scope" 
                    checked={isCentral === false} 
                    onChange={() => { setIsCentral(false); setPage(0); }} 
                  />
                  <label className="form-check-label" htmlFor="radioState">State Specific Schemes</label>
                </div>
              </div>
            </div>

            {/* Category Filter */}
            <div className="mb-3">
              <label className="filter-group-title">Category Domain</label>
              <select className="form-select form-select-sm" value={category} onChange={e => { setCategory(e.target.value); setPage(0); }}>
                <option value="all">All Categories</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* State Filter */}
            <div className="mb-3">
              <label className="filter-group-title">State / UT</label>
              <select className="form-select form-select-sm" value={state} onChange={e => { setState(e.target.value); setPage(0); }}>
                <option value="all">All States</option>
                {states.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Beneficiary Filter */}
            <div className="mb-4">
              <label className="filter-group-title">Beneficiary Type</label>
              <select className="form-select form-select-sm" value={beneficiary} onChange={e => { setBeneficiary(e.target.value); setPage(0); }}>
                <option value="all">All Target Groups</option>
                {beneficiaries.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            <div className="d-grid">
              <button type="button" className="btn btn-outline-secondary btn-sm" onClick={handleClearFilters}>
                Reset All Filters
              </button>
            </div>
          </div>
        </div>

        {/* ---------------- Right Schemes List ---------------- */}
        <div className="col-lg-9">
          {/* Active Filter Chips & Sort Bar */}
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2 bg-white p-3 rounded-3 border">
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <span className="small text-muted fw-semibold">Active:</span>
              {category !== 'all' && (
                <span className="badge bg-success bg-opacity-10 text-success d-inline-flex align-items-center gap-1">
                  Category: {category}
                  <X size={12} className="cursor-pointer" onClick={() => setCategory('all')} />
                </span>
              )}
              {state !== 'all' && (
                <span className="badge bg-success bg-opacity-10 text-success d-inline-flex align-items-center gap-1">
                  State: {state}
                  <X size={12} className="cursor-pointer" onClick={() => setState('all')} />
                </span>
              )}
              {isCentral !== null && (
                <span className="badge bg-primary bg-opacity-10 text-primary d-inline-flex align-items-center gap-1">
                  Scope: {isCentral ? 'Central' : 'State'}
                  <X size={12} className="cursor-pointer" onClick={() => setIsCentral(null)} />
                </span>
              )}
              {category === 'all' && state === 'all' && isCentral === null && (
                <span className="small text-muted">All Schemes</span>
              )}
            </div>

            <div className="d-flex align-items-center gap-2">
              <span className="small text-muted">Sort By:</span>
              <select className="form-select form-select-sm border-0 bg-light w-auto fw-semibold" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="viewsCount">Most Popular</option>
                <option value="deadlineDate">Closing Soon</option>
                <option value="nameEn">Alphabetical</option>
              </select>
            </div>
          </div>

          {/* Scheme Cards Stream */}
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-success" role="status"></div>
              <p className="mt-2 text-muted">Loading verified schemes...</p>
            </div>
          ) : schemes.length === 0 ? (
            <div className="card p-5 text-center bg-white border-0 shadow-sm rounded-4">
              <h5 className="fw-bold text-dark">No schemes match your selected filters</h5>
              <p className="text-muted small">Try broadening your search keywords or resetting specific filters.</p>
              <button className="btn btn-myscheme-outline btn-sm mx-auto" onClick={handleClearFilters}>
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {schemes.map(s => {
                const displayName = language === 'ta' && s.nameTa ? s.nameTa : language === 'hi' && s.nameHi ? s.nameHi : s.nameEn;
                const displayDesc = language === 'ta' && s.descriptionTa ? s.descriptionTa : language === 'hi' && s.descriptionHi ? s.descriptionHi : s.descriptionEn;
                const isSelected = selectedSchemeIds.includes(s.id);

                return (
                  <div key={s.id} className="scheme-card">
                    {/* Header Tags & Comparison Checkbox */}
                    <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                      <div className="d-flex flex-wrap gap-2 align-items-center">
                        <span className={`tag-pill ${s.isCentral ? 'tag-central' : 'tag-state'}`}>
                          {s.isCentral ? 'Central Sector' : `State: ${s.stateName || 'State'}`}
                        </span>
                        <span className="tag-pill tag-category">{s.category}</span>
                        <span className="small text-muted font-monospace">👁️ {s.viewsCount} views</span>
                      </div>

                      {/* Compare Checkbox */}
                      <button 
                        className="btn btn-sm btn-link p-0 text-decoration-none text-muted d-flex align-items-center gap-1"
                        onClick={() => toggleCompare(s.id)}
                      >
                        {isSelected ? <CheckSquare size={18} className="text-success" /> : <Square size={18} />}
                        <span className="small d-none d-sm-inline">Compare</span>
                      </button>
                    </div>

                    {/* Scheme Title */}
                    <h5 className="scheme-card-title">{displayName}</h5>
                    <p className="scheme-dept-text mb-2">
                      Department: {s.departmentEn || 'Ministry of Social Welfare & Empowerment'}
                    </p>

                    <p className="small text-secondary mb-3" style={{ lineHeight: 1.5 }}>
                      {displayDesc}
                    </p>

                    {/* Benefit and Closing Date Strip */}
                    <div className="d-flex flex-wrap justify-content-between align-items-center border-top pt-3 text-muted small">
                      <div>
                        <strong className="text-success">Financial Benefit:</strong> {s.benefitEn}
                      </div>

                      {s.deadlineDate && (
                        <div className="text-danger fw-semibold d-flex align-items-center gap-1">
                          <Clock size={13} />
                          <span>Closing: {new Date(s.deadlineDate).toLocaleDateString()}</span>
                        </div>
                      )}

                      <div className="d-flex gap-2 mt-2 mt-sm-0">
                        {user ? (
                          <button 
                            className="btn btn-sm btn-myscheme-primary py-1 px-3"
                            onClick={() => handleBookmark(s.id)}
                          >
                            Save / Apply
                          </button>
                        ) : (
                          <Link to="/login" className="btn btn-sm btn-myscheme-outline py-1 px-3">
                            Check Eligibility
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center align-items-center gap-2 mt-4">
                  <button 
                    className="btn btn-sm btn-outline-secondary" 
                    onClick={() => setPage(prev => Math.max(prev - 1, 0))}
                    disabled={page === 0}
                  >
                    <ChevronLeft size={16} /> Previous
                  </button>
                  <span className="small fw-semibold px-2">Page {page + 1} of {totalPages}</span>
                  <button 
                    className="btn btn-sm btn-outline-secondary" 
                    onClick={() => setPage(prev => Math.min(prev + 1, totalPages - 1))}
                    disabled={page === totalPages - 1}
                  >
                    Next <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
