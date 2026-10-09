import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';
import { 
  AlertTriangle, CheckCircle, Calculator, Info, Bookmark, 
  HelpCircle, FileCheck, ExternalLink, Flag, Sparkles, User, ArrowRight 
} from 'lucide-react';

export const Recommendations = () => {
  const { profile } = useAuth();
  const { language, t } = useLanguage();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedSchemeId, setExpandedSchemeId] = useState(null);
  const [bookmarkSuccess, setBookmarkSuccess] = useState(null);

  // User report state
  const [reportSchemeId, setReportSchemeId] = useState(null);
  const [reportType, setReportType] = useState('ELIGIBILITY_INCORRECT');
  const [reportComments, setReportComments] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);

  useEffect(() => {
    fetchRecommendations();
  }, [profile, language]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/schemes/recommend?lang=${language}`);
      setRecommendations(res.data);
    } catch (err) {
      console.error('Error fetching recommendations', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookmark = async (schemeId) => {
    try {
      setBookmarkSuccess(null);
      await axios.post(`/api/applications/save/${schemeId}`);
      setBookmarkSuccess('Scheme saved to your tracker! View it anytime in "My Applications".');
      setTimeout(() => setBookmarkSuccess(null), 4000);
    } catch (err) {
      console.error('Error bookmarking scheme', err);
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!reportSchemeId) return;

    try {
      await axios.post('/api/admin/reports', {
        schemeId: reportSchemeId,
        reportType,
        comments: reportComments
      });
      setReportSuccess(true);
      setReportComments('');
      setTimeout(() => {
        setReportSuccess(false);
        setReportSchemeId(null);
      }, 3000);
    } catch (err) {
      console.error('Error submitting report', err);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-success" role="status"></div>
        <p className="mt-2 text-muted">{t('loading')}</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Top Banner */}
      <div className="card border-0 bg-white shadow-sm p-4 rounded-4 mb-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="badge bg-success bg-opacity-10 text-success fw-bold px-3 py-1 rounded-pill">
                <Sparkles size={14} className="me-1" />
                Personalized Recommendation Engine
              </span>
            </div>
            <h2 className="fw-bold text-dark mb-1">{t('recTitle')}</h2>
            <p className="text-muted small mb-0">{t('recSubtitle')}</p>
          </div>

          {profile && (
            <div className="bg-light p-3 rounded-3 border">
              <div className="d-flex align-items-center gap-2 mb-1">
                <User size={16} className="text-success" />
                <strong className="small text-dark">Active Profile Parameters</strong>
              </div>
              <div className="small text-muted">
                <span>{profile.occupation || 'Citizen'}</span> • <span>{profile.state || 'All States'}</span> • <span>₹{profile.annualIncome ? Number(profile.annualIncome).toLocaleString() : 'N/A'}</span>
              </div>
              <Link to="/profile" className="small text-success text-decoration-none fw-semibold d-block mt-1">
                Edit Profile Details →
              </Link>
            </div>
          )}
        </div>
      </div>

      {bookmarkSuccess && (
        <div className="alert alert-success d-flex align-items-center gap-2 shadow-sm" role="alert">
          <FileCheck size={20} className="text-success" />
          <span>{bookmarkSuccess}</span>
        </div>
      )}

      {recommendations.length === 0 ? (
        <div className="card p-5 text-center bg-white shadow-sm border-0 rounded-4">
          <Info size={44} className="mb-2 text-warning mx-auto" />
          <h4 className="fw-bold text-dark">No matching recommendations found</h4>
          <p className="text-muted mb-4">
            We could not identify schemes matching your current profile. Please complete or update your demographic details.
          </p>
          <Link to="/profile" className="btn btn-myscheme-primary mx-auto">
            Complete Profile Details
          </Link>
        </div>
      ) : (
        <div className="row g-3">
          {recommendations.map(({ scheme, evaluation }) => {
            const isExpanded = expandedSchemeId === scheme.id;
            const displayName = language === 'ta' && scheme.nameTa ? scheme.nameTa : language === 'hi' && scheme.nameHi ? scheme.nameHi : scheme.nameEn;
            const displayDesc = language === 'ta' && scheme.descriptionTa ? scheme.descriptionTa : language === 'hi' && scheme.descriptionHi ? scheme.descriptionHi : scheme.descriptionEn;
            const displayDept = language === 'ta' && scheme.departmentTa ? scheme.departmentTa : language === 'hi' && scheme.departmentHi ? scheme.departmentHi : scheme.departmentEn;
            const displayBenefit = language === 'ta' && scheme.benefitTa ? scheme.benefitTa : language === 'hi' && scheme.benefitHi ? scheme.benefitHi : scheme.benefitEn;

            return (
              <div key={scheme.id} className="col-12">
                <div className="scheme-card mb-3">
                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
                    <div>
                      <div className="d-flex flex-wrap gap-2 align-items-center mb-2">
                        <span className={`badge ${evaluation.matchPercentage >= 85 ? 'bg-success' : 'bg-warning text-dark'} fs-6 rounded-pill px-3 py-1`}>
                          {evaluation.matchPercentage}% {t('matchLabel')}
                        </span>
                        
                        {evaluation.missingFields.length > 0 && (
                          <span className="badge bg-warning bg-opacity-25 text-dark d-flex align-items-center gap-1 border border-warning">
                            <AlertTriangle size={13} className="text-warning" />
                            {t('potEligible')}
                          </span>
                        )}

                        <span className="tag-pill tag-category">{scheme.category}</span>
                        <span className={`tag-pill ${scheme.isCentral ? 'tag-central' : 'tag-state'}`}>
                          {scheme.isCentral ? 'Central Sector' : `State: ${scheme.stateName || 'State'}`}
                        </span>
                      </div>

                      <h4 className="scheme-card-title mb-1">{displayName}</h4>
                      <p className="scheme-dept-text mb-0">{displayDept || 'Ministry of Social Welfare & Empowerment'}</p>
                    </div>

                    {/* Action buttons */}
                    <div className="d-flex gap-2">
                      <button 
                        className="btn btn-myscheme-outline btn-sm d-flex align-items-center gap-1"
                        onClick={() => setExpandedSchemeId(isExpanded ? null : scheme.id)}
                      >
                        <HelpCircle size={15} />
                        <span>{isExpanded ? 'Hide Details' : t('whyEligible')}</span>
                      </button>
                      
                      <button 
                        className="btn btn-myscheme-primary btn-sm d-flex align-items-center gap-1"
                        onClick={() => handleBookmark(scheme.id)}
                      >
                        <Bookmark size={15} />
                        <span>{t('applyNow')}</span>
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 border-top pt-3">
                    <p className="small text-secondary mb-2">{displayDesc}</p>
                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 text-muted small mt-2">
                      <span><strong className="text-success">Financial Benefit:</strong> {displayBenefit}</span>
                      {scheme.deadlineDate && (
                        <span className="text-danger fw-semibold">
                          ⏰ Application Deadline: {new Date(scheme.deadlineDate).toLocaleDateString()}
                        </span>
                      )}
                      {scheme.officialSourceUrl && (
                        <a href={scheme.officialSourceUrl} target="_blank" rel="noopener noreferrer" className="text-success text-decoration-none d-flex align-items-center gap-1 fw-semibold">
                          Official Guidelines <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Eligibility breakdown drawer (collapsible) */}
                  {isExpanded && (
                    <div className="mt-4 p-4 bg-light rounded-3 border shadow-inner">
                      <h5 className="fw-bold text-dark border-bottom pb-2 mb-3">
                        🔬 Eligibility Assessment Breakdown
                      </h5>

                      <div className="row g-3">
                        {/* Passed Criteria */}
                        <div className="col-md-6">
                          <h6 className="fw-bold text-success mb-2 d-flex align-items-center gap-1">
                            <CheckCircle size={16} />
                            {t('passedRules')}
                          </h6>
                          {evaluation.passedRules.length === 0 ? (
                            <p className="text-muted small">No verified requirements.</p>
                          ) : (
                            <ul className="list-group list-group-flush border rounded-3 bg-white">
                              {evaluation.passedRules.map((rule, idx) => (
                                <li key={idx} className="list-group-item text-success small py-2">
                                  ✓ {rule}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>

                        {/* Missing / Failed criteria */}
                        <div className="col-md-6">
                          {evaluation.missingFields.length > 0 && (
                            <div className="mb-3">
                              <h6 className="fw-bold text-warning mb-2 d-flex align-items-center gap-1">
                                <AlertTriangle size={16} />
                                {t('missingDetails')}
                              </h6>
                              <div className="alert alert-warning py-2 px-3 mb-0 small">
                                <p className="mb-2">We couldn't evaluate these parameters. Please update your profile to verify eligibility:</p>
                                <ul className="mb-0 ps-3">
                                  {evaluation.missingFields.map((field, idx) => (
                                    <li key={idx} className="fw-semibold">{field}</li>
                                  ))}
                                </ul>
                                <Link to="/profile" className="btn btn-sm btn-outline-dark fw-bold mt-2">
                                  Complete Profile Now
                                </Link>
                              </div>
                            </div>
                          )}

                          {evaluation.failedRules.length > 0 && (
                            <div>
                              <h6 className="fw-bold text-danger mb-2 d-flex align-items-center gap-1">
                                <AlertTriangle size={16} />
                                {t('failedRules')}
                              </h6>
                              <ul className="list-group list-group-flush border rounded-3 bg-white">
                                {evaluation.failedRules.map((rule, idx) => (
                                  <li key={idx} className="list-group-item text-danger small py-2">
                                    ✗ {rule}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>

                        {/* Dynamic Benefit Calculator */}
                        {evaluation.calculatedBenefit !== undefined && evaluation.calculatedBenefit !== null && (
                          <div className="col-12 mt-3">
                            <div className="card border-success bg-success bg-opacity-10 p-3">
                              <div className="d-flex align-items-center gap-2 mb-2">
                                <Calculator className="text-success" />
                                <h6 className="fw-bold text-success mb-0">{t('benefitCalculator')}</h6>
                              </div>
                              <p className="mb-1 text-dark small">
                                Based on your profile values (Income, Family scale, Occupation), our dynamic expression calculator has computed your benefits:
                              </p>
                              <h3 className="fw-bold text-success mb-0">
                                ₹{evaluation.calculatedBenefit.toLocaleString()} / year
                              </h3>
                            </div>
                          </div>
                        )}

                        {/* Feedback report incorrect information */}
                        <div className="col-12 mt-3 border-top pt-3 d-flex justify-content-between align-items-center">
                          <span className="text-muted small">
                            Is this scheme information outdated? Help us keep the repository accurate.
                          </span>
                          <button 
                            className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                            onClick={() => setReportSchemeId(scheme.id)}
                          >
                            <Flag size={14} />
                            Report Outdated Data
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Report Modal */}
      {reportSchemeId && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content border-0 rounded-4 shadow-lg">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold text-dark">Report Outdated Scheme Details</h5>
                <button type="button" className="btn-close" onClick={() => setReportSchemeId(null)}></button>
              </div>
              <form onSubmit={handleReportSubmit}>
                <div className="modal-body">
                  {reportSuccess && <div className="alert alert-success p-2 small">Report submitted successfully! Government audits team will verify.</div>}
                  
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">What is incorrect?</label>
                    <select className="form-select form-select-sm" value={reportType} onChange={e => setReportType(e.target.value)}>
                      <option value="DEADLINE_INCORRECT">Application deadline is incorrect</option>
                      <option value="ELIGIBILITY_INCORRECT">Eligibility rules are incorrect</option>
                      <option value="LINK_BROKEN">Official link is broken</option>
                      <option value="INACTIVE">Scheme is no longer active / expired</option>
                      <option value="OTHER">Other problems</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Comments / Description</label>
                    <textarea 
                      className="form-control form-control-sm" 
                      rows={3} 
                      value={reportComments} 
                      onChange={e => setReportComments(e.target.value)} 
                      placeholder="Explain what is incorrect and provide the official source link if possible..."
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer border-0">
                  <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setReportSchemeId(null)}>{t('cancel')}</button>
                  <button type="submit" className="btn btn-sm btn-myscheme-primary">{t('submit')}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
