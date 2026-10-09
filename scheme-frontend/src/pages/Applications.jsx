import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';
import { ClipboardList, Bookmark, Info, ExternalLink, Calendar, CheckSquare, UploadCloud, Edit3, Trash, CheckCircle2 } from 'lucide-react';

export const Applications = () => {
  const { language: lang, t: translate } = useLanguage();

  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [loading, setLoading] = useState(true);

  // Edit details form states
  const [refId, setRefId] = useState('');
  const [appDate, setAppDate] = useState('');
  const [notes, setNotes] = useState('');
  const [showEditForm, setShowEditForm] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // File upload state
  const [uploadingDocType, setUploadingDocType] = useState(null);
  const [fileToUpload, setFileToUpload] = useState(null);
  const [uploadMessage, setUploadMessage] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, [lang]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/applications');
      setApplications(res.data);
      if (res.data.length > 0) {
        setSelectedApp(prev => {
          if (prev) {
            const updated = res.data.find(x => x.id === prev.id);
            return updated || res.data[0];
          }
          return res.data[0];
        });
      } else {
        setSelectedApp(null);
      }
    } catch (err) {
      console.error('Error fetching applications', err);
    } finally {
      setLoading(false);
    }
  };

  const selectApp = (app) => {
    setSelectedApp(app);
    setRefId(app.referenceId || '');
    setAppDate(app.applicationDate || '');
    setNotes(app.notes || '');
    setShowEditForm(false);
  };

  const handleStatusChange = async (appId, status) => {
    try {
      await axios.put(`/api/applications/${appId}/status?status=${status}`);
      fetchApplications();
    } catch (err) {
      console.error('Error updating status', err);
    }
  };

  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    if (!selectedApp) return;

    try {
      setSaveSuccess(false);
      const dateParam = appDate ? `&date=${appDate}` : '';
      await axios.put(`/api/applications/${selectedApp.id}/details?referenceId=${refId}&notes=${notes}${dateParam}`);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      fetchApplications();
    } catch (err) {
      console.error('Error updating details', err);
    }
  };

  const handleFileUpload = async (docType) => {
    if (!fileToUpload || !selectedApp) return;

    try {
      setUploadingDocType(docType);
      setUploadMessage(null);
      
      const formData = new FormData();
      formData.append('file', fileToUpload);
      formData.append('documentType', docType);

      await axios.post('/api/applications/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setUploadMessage('Document uploaded successfully!');
      setFileToUpload(null);
      fetchApplications();
    } catch (err) {
      console.error('Error uploading file', err);
      setUploadMessage('File upload failed. Please try again.');
    } finally {
      setUploadingDocType(null);
    }
  };

  const statuses = [
    { value: 'SAVED', label: 'Saved' },
    { value: 'PLANNING', label: 'Planning' },
    { value: 'STARTED', label: 'Started' },
    { value: 'SUBMITTED', label: 'Submitted' },
    { value: 'UNDER_VERIFICATION', label: 'Verification' },
    { value: 'APPROVED', label: 'Approved' },
    { value: 'REJECTED', label: 'Rejected' },
  ];

  const getStatusIndex = (value) => {
    return statuses.findIndex(s => s.value === value);
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-success" role="status"></div>
        <p className="mt-2 text-muted">{translate('loading')}</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center gap-2 mb-4">
        <div className="bg-success text-white rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', backgroundColor: '#15803d' }}>
          <ClipboardList size={22} />
        </div>
        <div>
          <h2 className="fw-bold text-dark mb-0">My Applications & Saved Schemes</h2>
          <p className="text-muted small mb-0">Track official application progress, manage required documents, and store submission reference IDs.</p>
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="card p-5 text-center bg-white shadow-sm border-0 rounded-4">
          <Bookmark size={44} className="mb-2 text-muted mx-auto" />
          <h4 className="fw-bold text-dark">No schemes saved in your tracker yet</h4>
          <p className="text-muted small mb-4">Explore the national catalog and bookmark schemes to track application status and upload mandatory certificates.</p>
          <Link to="/search" className="btn btn-myscheme-primary mx-auto">
            Explore Government Schemes
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          {/* Left Bookmarked Schemes List */}
          <div className="col-lg-4">
            <div className="card shadow-sm border-0 bg-white rounded-4 overflow-hidden">
              <div className="p-3 bg-light border-bottom fw-bold text-dark">
                Saved Schemes ({applications.length})
              </div>
              <div className="list-group list-group-flush">
                {applications.map(app => {
                  const title = lang === 'ta' && app.scheme.nameTa ? app.scheme.nameTa : lang === 'hi' && app.scheme.nameHi ? app.scheme.nameHi : app.scheme.nameEn;
                  const isSelected = selectedApp?.id === app.id;
                  
                  return (
                    <button 
                      key={app.id} 
                      className={`list-group-item list-group-item-action p-3 text-start border-bottom ${isSelected ? 'bg-success bg-opacity-10 border-start border-success border-4 fw-bold' : ''}`}
                      onClick={() => selectApp(app)}
                    >
                      <div className="d-flex justify-content-between align-items-start mb-1">
                        <span className="tag-pill tag-category small">{app.scheme.category}</span>
                        <span className="badge bg-secondary small">{app.status}</span>
                      </div>
                      <span className="text-dark small d-block">{title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right tracking stepper and checklist */}
          {selectedApp && (
            <div className="col-lg-8">
              <div className="card shadow-sm border-0 bg-white p-4 rounded-4">
                <div className="border-bottom pb-3 mb-4">
                  <div className="d-flex flex-wrap gap-2 mb-2">
                    <span className="tag-pill tag-central">{selectedApp.scheme.isCentral ? 'Central Government' : `State: ${selectedApp.scheme.stateName || 'State'}`}</span>
                    <span className="tag-pill tag-category">{selectedApp.scheme.category}</span>
                  </div>
                  <h4 className="fw-bold text-dark mb-1">
                    {lang === 'ta' && selectedApp.scheme.nameTa ? selectedApp.scheme.nameTa : lang === 'hi' && selectedApp.scheme.nameHi ? selectedApp.scheme.nameHi : selectedApp.scheme.nameEn}
                  </h4>
                  <p className="text-muted small mb-0">Department: {selectedApp.scheme.departmentEn || 'Ministry of Social Welfare & Empowerment'}</p>
                </div>

                {/* Progress Stepper bar */}
                <h6 className="fw-bold text-dark text-uppercase small letter-spacing-1 mb-3">Application Progress Status Timeline</h6>
                <div className="position-relative mb-5 mt-4 px-2">
                  {/* Progress Line */}
                  <div className="progress position-absolute top-50 start-0 end-0 translate-middle-y" style={{ height: '4px', zIndex: 1 }}>
                    <div 
                      className="progress-bar bg-success" 
                      role="progressbar" 
                      style={{ 
                        width: `${(getStatusIndex(selectedApp.status) / (statuses.length - 1)) * 100}%`,
                        transition: 'width 0.4s ease'
                      }}
                    ></div>
                  </div>

                  {/* Steps circles */}
                  <div className="d-flex justify-content-between position-relative" style={{ zIndex: 2 }}>
                    {statuses.map((s, idx) => {
                      const activeIdx = getStatusIndex(selectedApp.status);
                      const isPassed = idx < activeIdx;
                      const isCurrent = idx === activeIdx;

                      let circleClass = 'bg-light text-muted border';
                      if (isCurrent) circleClass = 'bg-success text-white fw-bold shadow';
                      else if (isPassed) circleClass = 'bg-success text-white';

                      return (
                        <div key={s.value} className="text-center" style={{ width: '70px' }}>
                          <button 
                            className={`btn rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2 ${circleClass}`}
                            style={{ 
                              width: '32px', 
                              height: '32px', 
                              padding: 0,
                              fontSize: '12px',
                              transition: 'all 0.2s ease'
                            }}
                            onClick={() => handleStatusChange(selectedApp.id, s.value)}
                            title={`Move status to ${s.label}`}
                          >
                            {isPassed ? '✓' : idx + 1}
                          </button>
                          <span className="d-block small text-muted fw-semibold" style={{ fontSize: '9px', lineHeight: '1.2' }}>
                            {s.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Edit Reference Number and Notes */}
                <div className="card mb-4 border bg-light rounded-3">
                  <div className="card-body p-3">
                    <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                      <strong className="text-dark small">Submission & Tracking Information</strong>
                      <button className="btn btn-sm btn-link text-success p-0 text-decoration-none fw-semibold" onClick={() => setShowEditForm(!showEditForm)}>
                        <Edit3 size={14} className="me-1" />
                        Edit Details
                      </button>
                    </div>

                    {saveSuccess && <div className="alert alert-success p-2 small rounded-3">Tracking information saved successfully.</div>}

                    {!showEditForm ? (
                      <div className="row g-2 text-dark small">
                        <div className="col-sm-6"><strong>Reference ID:</strong> {selectedApp.referenceId || 'Not set'}</div>
                        <div className="col-sm-6">
                          <strong>Application Date:</strong> {selectedApp.applicationDate ? new Date(selectedApp.applicationDate).toLocaleDateString() : 'Not set'}
                        </div>
                        <div className="col-12 mt-2"><strong>Notes:</strong> {selectedApp.notes || 'None'}</div>
                      </div>
                    ) : (
                      <form onSubmit={handleDetailsSubmit}>
                        <div className="row g-3">
                          <div className="col-sm-6">
                            <label className="form-label small fw-semibold">Reference ID</label>
                            <input type="text" className="form-control form-control-sm" value={refId} onChange={e => setRefId(e.target.value)} placeholder="e.g. SCH-2026-10293" />
                          </div>
                          <div className="col-sm-6">
                            <label className="form-label small fw-semibold">Application Date</label>
                            <input type="date" className="form-control form-control-sm" value={appDate} onChange={e => setAppDate(e.target.value)} />
                          </div>
                          <div className="col-12">
                            <label className="form-label small fw-semibold">Personal Notes</label>
                            <textarea className="form-control form-control-sm" rows={2} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Add documents check notes or portal steps..." />
                          </div>
                        </div>
                        <div className="d-flex gap-2 mt-3 justify-content-end">
                          <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setShowEditForm(false)}>Cancel</button>
                          <button type="submit" className="btn btn-sm btn-myscheme-primary">Save Info</button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>

                {/* Documents checklist */}
                <h6 className="fw-bold text-dark text-uppercase small letter-spacing-1 mb-3 border-bottom pb-2">
                  Mandatory Required Documents Checklist
                </h6>

                {uploadMessage && (
                  <div className="alert alert-info d-flex align-items-center gap-2 p-2 small rounded-3">
                    <CheckCircle2 size={16} />
                    <span>{uploadMessage}</span>
                  </div>
                )}

                {selectedApp.checklist.length === 0 ? (
                  <p className="text-muted small">No document uploads required for this scheme.</p>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {selectedApp.checklist.map((doc, idx) => {
                      const docName = lang === 'ta' && doc.documentNameTa ? doc.documentNameTa : lang === 'hi' && doc.documentNameHi ? doc.documentNameHi : doc.documentNameEn;
                      
                      return (
                        <div key={idx} className="p-3 border rounded-3 bg-white d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3">
                          <div>
                            <span className="d-flex align-items-center gap-2">
                              <span className={`badge ${doc.uploaded ? 'bg-success' : 'bg-warning text-dark'} rounded-pill px-2 py-1 small`}>
                                {doc.uploaded ? 'Uploaded' : 'Pending'}
                              </span>
                              <strong className="text-dark small">{docName}</strong>
                              {doc.mandatory && <span className="text-danger small">*</span>}
                            </span>
                            {doc.uploaded ? (
                              <span className="text-success small d-block font-monospace mt-1" style={{ fontSize: '11px' }}>
                                ✓ File stored on cloud repository
                              </span>
                            ) : (
                              <span className="text-muted small d-block mt-1">Required for departmental verification</span>
                            )}
                          </div>

                          <div className="d-flex gap-2 align-items-center">
                            {doc.fileUrl && (
                              <a 
                                href={`http://localhost:8080${doc.fileUrl}`} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="btn btn-sm btn-outline-success d-flex align-items-center gap-1"
                              >
                                View File
                              </a>
                            )}
                            
                            <div className="input-group input-group-sm">
                              <input 
                                type="file" 
                                className="form-control form-control-sm"
                                style={{ maxWidth: '170px' }}
                                onChange={e => setFileToUpload(e.target.files ? e.target.files[0] : null)}
                              />
                              <button 
                                className="btn btn-myscheme-primary"
                                onClick={() => handleFileUpload(doc.documentNameEn)}
                                disabled={uploadingDocType === doc.documentNameEn}
                              >
                                <UploadCloud size={14} className="me-1" />
                                {uploadingDocType === doc.documentNameEn ? 'Saving...' : 'Upload'}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
