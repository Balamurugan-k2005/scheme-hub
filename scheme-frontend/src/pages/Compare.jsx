import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { ArrowLeft, Check, Layers, AlertCircle, CheckCircle2 } from 'lucide-react';

export const Compare = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const [schemes, setSchemes] = useState([]);
  const [evaluations, setEvaluations] = useState({});
  const [loading, setLoading] = useState(true);

  const schemeIds = searchParams.get('ids')?.split(',') || [];

  useEffect(() => {
    if (schemeIds.length > 0) {
      fetchComparisonData();
    }
  }, [searchParams, language]);

  const fetchComparisonData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/schemes/public/compare?ids=${schemeIds.join(',')}`);
      setSchemes(res.data);

      if (user) {
        const evals = {};
        await Promise.all(
          res.data.map(async (s) => {
            try {
              const evalRes = await axios.get(`/api/schemes/${s.id}/evaluate?lang=${language}`);
              evals[s.id] = evalRes.data;
            } catch (e) {
              console.error(`Error evaluating scheme ${s.id}`, e);
            }
          })
        );
        setEvaluations(evals);
      }
    } catch (err) {
      console.error('Error fetching comparison details', err);
    } finally {
      setLoading(false);
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

  if (schemes.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div className="card p-5 bg-white border-0 shadow-sm rounded-4">
          <Layers size={44} className="text-muted mx-auto mb-2" />
          <h4 className="fw-bold text-dark">No schemes selected for comparison</h4>
          <p className="text-muted small mb-4">Please select 2 or 3 schemes from the search catalog to compare them side-by-side.</p>
          <Link to="/search" className="btn btn-myscheme-primary mx-auto">
            Explore Schemes Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="mb-4">
        <Link to="/search" className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1">
          <ArrowLeft size={16} /> Back to Catalog
        </Link>
      </div>

      <div className="card shadow-sm border-0 bg-white p-4 rounded-4">
        <div className="d-flex align-items-center gap-2 mb-4">
          <div className="bg-success text-white rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', backgroundColor: '#15803d' }}>
            <Layers size={22} />
          </div>
          <div>
            <h3 className="fw-bold text-dark mb-0">Scheme Comparison Matrix</h3>
            <p className="text-muted small mb-0">Side-by-side analysis of welfare benefits, eligibility rules, and deadlines</p>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-bordered align-middle">
            <thead style={{ backgroundColor: '#0f172a', color: '#ffffff' }}>
              <tr>
                <th style={{ width: '22%' }} className="p-3">Comparison Criteria</th>
                {schemes.map(s => {
                  const name = language === 'ta' && s.nameTa ? s.nameTa : language === 'hi' && s.nameHi ? s.nameHi : s.nameEn;
                  return (
                    <th key={s.id} className="text-center p-3" style={{ width: `${78 / schemes.length}%` }}>
                      <span className="fw-bold text-success" style={{ color: '#4ade80' }}>{name}</span>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {/* Category */}
              <tr>
                <td className="fw-bold bg-light">Category Domain</td>
                {schemes.map(s => (
                  <td key={s.id} className="text-center">
                    <span className="tag-pill tag-category">{s.category}</span>
                  </td>
                ))}
              </tr>

              {/* Scope (Central / State) */}
              <tr>
                <td className="fw-bold bg-light">Scope / Sponsorship</td>
                {schemes.map(s => (
                  <td key={s.id} className="text-center">
                    <span className={`tag-pill ${s.isCentral ? 'tag-central' : 'tag-state'}`}>
                      {s.isCentral ? 'Central Sector' : `State: ${s.stateName}`}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Beneficiary Target */}
              <tr>
                <td className="fw-bold bg-light">Target Beneficiaries</td>
                {schemes.map(s => (
                  <td key={s.id} className="text-center small">
                    {s.beneficiaryType}
                  </td>
                ))}
              </tr>

              {/* Department */}
              <tr>
                <td className="fw-bold bg-light">Department / Ministry</td>
                {schemes.map(s => {
                  const dept = language === 'ta' && s.departmentTa ? s.departmentTa : language === 'hi' && s.departmentHi ? s.departmentHi : s.departmentEn;
                  return <td key={s.id} className="text-center small text-secondary">{dept || 'N/A'}</td>;
                })}
              </tr>

              {/* Benefit Details */}
              <tr>
                <td className="fw-bold bg-light">Welfare Financial Benefits</td>
                {schemes.map(s => {
                  const benefit = language === 'ta' && s.benefitTa ? s.benefitTa : language === 'hi' && s.benefitHi ? s.benefitHi : s.benefitEn;
                  return <td key={s.id} className="text-center text-success fw-bold small">{benefit}</td>;
                })}
              </tr>

              {/* Summary of Eligibility */}
              <tr>
                <td className="fw-bold bg-light">Eligibility Summary</td>
                {schemes.map(s => {
                  const desc = language === 'ta' && s.eligibilityDescTa ? s.eligibilityDescTa : language === 'hi' && s.eligibilityDescHi ? s.eligibilityDescHi : s.eligibilityDescEn;
                  return <td key={s.id} className="text-center small text-muted" style={{ minWidth: '160px' }}>{desc}</td>;
                })}
              </tr>

              {/* Deadline */}
              <tr>
                <td className="fw-bold bg-light">Application Deadline</td>
                {schemes.map(s => (
                  <td key={s.id} className="text-center text-danger small font-monospace">
                    {s.deadlineDate ? new Date(s.deadlineDate).toLocaleDateString() : 'Continuous / Open Year-Round'}
                  </td>
                ))}
              </tr>

              {/* Personal Match (Only if authenticated) */}
              {user && (
                <tr style={{ backgroundColor: '#ecfdf5' }}>
                  <td className="fw-bold text-success">Your Match Score</td>
                  {schemes.map(s => {
                    const evalResult = evaluations[s.id];
                    if (!evalResult) {
                      return <td key={s.id} className="text-center text-muted small">Evaluating...</td>;
                    }

                    return (
                      <td key={s.id} className="text-center">
                        <h4 className={`fw-bold mb-1 ${evalResult.eligible ? 'text-success' : 'text-danger'}`}>
                          {evalResult.matchPercentage}% Match
                        </h4>
                        
                        <div className="small">
                          {evalResult.eligible ? (
                            <span className="text-success d-inline-flex align-items-center gap-1 fw-semibold">
                              <CheckCircle2 size={14} /> Qualified
                            </span>
                          ) : (
                            <span className="text-danger d-inline-flex align-items-center gap-1">
                              <AlertCircle size={14} /> Profile mismatch
                            </span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
